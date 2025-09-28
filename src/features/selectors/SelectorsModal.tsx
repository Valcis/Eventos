import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';
import type { SelectorKind, BaseItem } from '../../types/selectores';
import { SELECTOR_CONFIG, type FieldSpec } from './config';
import { z } from 'zod';
import { upsertSelector } from '../../store/localdb';

type UnknownRecord = Record<string, unknown>;
export type RowBase = BaseItem & UnknownRecord;

interface Props {
  title: string;
  kind: SelectorKind;
  eventId: string;
  isOpen: boolean;
  isReadOnly: boolean;
  initial?: RowBase;
  onClose: () => void;
  onSaved: (saved?: RowBase) => void;
}

export default function SelectorsModal({
  title,
  kind,
  eventId,
  isOpen,
  isReadOnly,
  initial,
  onClose,
  onSaved,
}: Props): JSX.Element {
  const cfg = SELECTOR_CONFIG[kind];
  const schema: z.ZodType<unknown> = cfg.schema;

  const baseNew: RowBase = useMemo(
    () => ({ id: crypto.randomUUID(), nombre: '', notas: '', activo: true }),
    [],
  );

  const [val, setVal] = useState<RowBase>(initial ?? baseNew);
  useEffect(() => {
    setVal(initial ?? baseNew);
  }, [initial, baseNew]);

  const onChange = (k: string, v: unknown): void => setVal((s) => ({ ...s, [k]: v }));

  const handleAccept = (): void => {
    if (isReadOnly) {
      onClose();
      return;
    }
    const parsed = schema.safeParse(val);
    if (!parsed.success) {
      alert(parsed.error.errors[0]?.message ?? 'Datos inválidos');
      return;
    }
    // 👇 Mezclamos con `val` para conservar campos opcionales no definidos en el schema (telefono/capacidad, etc.)
    const data = { ...val, ...(parsed.data as object) } as RowBase;
    if (!initial) data.activo = true; // crear => activo true
    upsertSelector<RowBase>(eventId, kind, data);
    onSaved(data);
  };

  // submit con Enter
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    handleAccept();
  };

  // ---------- helpers ----------
  const isNotasKey = (key: string) => key === 'notas' || key === 'comentarios';
  const notasLen = (key: string) => String((val[key] as string | undefined) ?? '').length;

  const prettyValue = (f: FieldSpec | { key: 'activo'; label: string }): string => {
    const raw = val[f.key as keyof RowBase];
    if (f.key === 'activo') return (raw as boolean) ? 'Sí' : 'No';
    if (typeof raw === 'boolean') return raw ? 'Sí' : 'No';
    const s = String((raw as string | number | undefined) ?? '');
    return s.trim() === '' ? '—' : s;
  };

  const SelectWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="relative">
      {children}
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none text-gray-400">
        ⌄
      </span>
    </div>
  );

  const renderEditableField = (f: FieldSpec): JSX.Element => {
    const common = { disabled: isReadOnly };

    if (isNotasKey(f.key)) {
      const len = notasLen(f.key);
      return (
        <>
          <input
            className="input w-full"
            value={String((val[f.key] as string | undefined) ?? '')}
            onChange={(e) => onChange(f.key, e.target.value.slice(0, 250))}
            maxLength={250}
            {...common}
          />
          <div className="mt-1 text-right text-xs text-gray-400">{len}/250</div>
        </>
      );
    }

    if (f.type === 'select') {
      const current = val[f.key] as boolean | string | number | undefined;
      const asString = String(current ?? '');
      const first = f.options?.[0];
      const isBoolSelect = typeof first?.value === 'boolean';
      return (
        <SelectWrapper>
          <select
            className="input w-full appearance-none bg-white pr-8"
            value={asString}
            onChange={(e) => {
              const next = isBoolSelect ? e.target.value === 'true' : e.target.value;
              onChange(f.key, next);
            }}
            {...common}
          >
            {f.options?.map((o) => (
              <option key={String(o.value)} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </select>
        </SelectWrapper>
      );
    }

    if (f.type === 'number') {
      const current = val[f.key] as number | string | undefined;
      return (
        <input
          className="input w-full"
          type="number"
          value={current === undefined || current === null ? '' : String(current)}
          onChange={(e) => {
            const v = e.target.value;
            onChange(f.key, v === '' ? undefined : Number(v));
          }}
          {...common}
        />
      );
    }

    if (f.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={Boolean(val[f.key])}
          onChange={(e) => onChange(f.key, e.target.checked)}
          {...common}
        />
      );
    }

    return (
      <input
        className="input w-full"
        value={String((val[f.key] as string | undefined) ?? '')}
        onChange={(e) => onChange(f.key, e.target.value)}
        {...common}
      />
    );
  };

  // ---------- read-only con Notas en segunda línea ----------
  const InlineInfo: React.FC = () => {
    const fieldsNoNotes = cfg.fields.filter((f) => !isNotasKey(f.key));
    const notesField = cfg.fields.find((f) => isNotasKey(f.key));

    return (
      <div className="rounded-xl border bg-gray-50 px-3 py-2">
        {/* Línea 1: Activo + resto (sin Notas) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] leading-5">
          <div className="flex items-baseline">
            <span className="text-gray-500">Activo:</span>
            <span className="ml-1 font-medium text-gray-800">{val.activo ? 'Sí' : 'No'}</span>
          </div>
          {fieldsNoNotes.map((f, idx) => (
            <div key={f.key} className="flex items-baseline">
              <span className="text-gray-500">{f.label}:</span>
              <span className="ml-1 font-medium text-gray-800" title={prettyValue(f)}>
                {prettyValue(f)}
              </span>
              {idx < fieldsNoNotes.length - 1 && <span className="mx-2 text-gray-300">•</span>}
            </div>
          ))}
        </div>

        {/* Línea 2: Notas (si existe) */}
        {notesField && (
          <div className="mt-2 rounded-lg border bg-white/70 px-2.5 py-2">
            <div className="text-[11px] font-medium leading-4 text-gray-500">
              {notesField.label}
            </div>
            <div className="mt-0.5 whitespace-pre-wrap break-words text-[14px] leading-5 text-gray-800">
              {prettyValue(notesField)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal title={title} isOpen={isOpen} onClose={onClose}>
      <form onSubmit={onSubmit}>
        {isReadOnly ? (
          <InlineInfo />
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              {cfg.fields.map((f) => (
                <div key={f.key} className={f.fullWidth ? 'md:col-span-2' : ''}>
                  <FormField label={f.label}>{renderEditableField(f)}</FormField>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" className="rounded-2xl border px-3 py-1.5" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="rounded-2xl border px-3 py-1.5">
                Guardar
              </button>
            </div>
          </>
        )}

        {isReadOnly && (
          <div className="mt-3 flex items-center justify-end">
            <button type="button" className="rounded-2xl border px-3 py-1.5" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}
