import React, { useEffect, useMemo, useState } from 'react';
import type { FilterField, FilterValues, Primitive } from './types';

export interface FilterBarProps<T> {
  fields: FilterField<T>[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  isInline?: boolean;
  debounceMs?: number;
  className?: string;
  title?: string;
  isCollapsible?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

const DEFAULT_DEBOUNCE = 250;

/**
 * Generic, reusable filter bar. Controlled via `values` + `onChange`.
 * - Text/number inputs are debounced.
 * - Select/boolean/date fire instantly.
 */
export function FilterBar<T>({
  fields,
  values,
  onChange,
  isInline = true,
  debounceMs = DEFAULT_DEBOUNCE,
  className,
  title,
  isCollapsible = false,
  isOpen,
  onToggle,
}: FilterBarProps<T>) {
  const [local, setLocal] = useState<FilterValues>(values);
  const [openInternal, setOpenInternal] = useState<boolean>(true);
  const open = typeof isOpen === 'boolean' ? isOpen : openInternal;

  function toggleOpen() {
    const next = !open;
    onToggle ? onToggle(next) : setOpenInternal(next);
  }

  // Sync external changes in case the parent resets filters.
  useEffect(() => setLocal(values), [values]);

  // Debounced commit for text/number.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (JSON.stringify(local) !== JSON.stringify(values)) {
        onChange(local);
      }
    }, debounceMs);
    return () => clearTimeout(handle);
  }, [local, values, onChange, debounceMs]);

  const containerCls = useMemo(
    () =>
      `${isInline ? 'flex flex-wrap items-end gap-3' : 'grid gap-3'} bg-white p-3 rounded-2xl shadow-sm ${className ?? ''}`,
    [isInline, className],
  );

  const labelCls = 'text-sm font-medium text-zinc-700';
  const inputCls =
    'w-full rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white';

  function setValue(id: string, value: Primitive, instant = false) {
    if (instant) {
      onChange({ ...local, [id]: value });
      setLocal((prev) => ({ ...prev, [id]: value }));
      return;
    }
    setLocal((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <div className={containerCls}>
      {/* Cabecera: título + botón mostrar/ocultar */}
      <div className="w-full flex items-center justify-between">
        <div className="text-base font-semibold text-zinc-800">{title ?? 'Filtros'}</div>
        {(isCollapsible ?? true) && (
          <button
            type="button"
            onClick={toggleOpen}
            className="text-sm px-3 py-1.5 rounded-lg border border-zinc-300"
            aria-expanded={open}
            aria-controls="filterbar-form"
          >
            {open ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
        )}
      </div>

      {/* Formulario de filtros */}
      {open && (
        <div
          id="filterbar-form"
          className={`${isInline ? 'flex flex-wrap items-end gap-3' : 'grid gap-3'} w-full`}
        >
          {fields.map((f) => {
            const id = String(f.id);
            const val = local[id] ?? f.defaultValue ?? '';
            return (
              <div key={id} className="min-w-[180px]">
                <label htmlFor={id} className={labelCls}>
                  {f.label}
                </label>
                {f.type === 'text' && (
                  <input
                    id={id}
                    type="text"
                    className={inputCls}
                    value={String(val ?? '')}
                    onChange={(e) => setValue(id, e.target.value)}
                    placeholder={`Filtrar por ${f.label.toLowerCase()}`}
                  />
                )}
                {f.type === 'number' && (
                  <input
                    id={id}
                    type="number"
                    className={inputCls}
                    value={val as number | ''}
                    onChange={(e) =>
                      setValue(id, e.target.value === '' ? '' : Number(e.target.value))
                    }
                    placeholder={`≥ ${f.label.toLowerCase()}`}
                  />
                )}
                {f.type === 'select' && (
                  <select
                    id={id}
                    className={inputCls}
                    value={String(val ?? '')}
                    onChange={(e) => setValue(id, e.target.value, true)}
                  >
                    <option value="">—</option>
                    {(f.options ?? []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
                {f.type === 'boolean' && (
                  <select
                    id={id}
                    className={inputCls}
                    value={val === '' ? '' : String(Boolean(val))}
                    onChange={(e) =>
                      setValue(id, e.target.value === '' ? '' : e.target.value === 'true', true)
                    }
                  >
                    <option value="">—</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                )}
                {f.type === 'date' && (
                  <input
                    id={id}
                    type="date"
                    className={inputCls}
                    value={val instanceof Date ? val.toISOString().slice(0, 10) : String(val ?? '')}
                    onChange={(e) => setValue(id, e.target.value, true)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilterBar;
