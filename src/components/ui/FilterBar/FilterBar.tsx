import {useMemo, useState} from 'react';
import type {FilterField, FilterValues, FilterKind} from './types';

type Props = {
    fields: ReadonlyArray<FilterField>;
    values: FilterValues; // controlado desde fuera
    onChange: (next: FilterValues) => void;
    title?: string;
    className?: string;
    isCollapsible?: boolean;
    isOpen?: boolean;
    onClear?: () => void;
};

function classNames(...xs: Array<string | false | null | undefined>): string {
    return xs.filter(Boolean).join(' ');
}

// Normaliza lo que pueda venir indefinido en values
function readValue(values: FilterValues, id: string): string | number | boolean | '' {
    const v = values[id];
    if (v === null || v === undefined) return '';
    if (v instanceof Date) return v.toISOString().slice(0, 10); // yyyy-mm-dd
    return v as string | number | boolean;
}

function coerce(kind: FilterKind, raw: string | boolean): string | number | boolean | null {
    if (kind === 'boolean') return Boolean(raw);
    if (kind === 'number') {
        const n = typeof raw === 'string' ? Number(raw) : NaN;
        return Number.isFinite(n) ? n : null;
    }
    if (kind === 'date') {
        // guardamos como string ISO yyyy-mm-dd para no mezclar zonas horarias
        return typeof raw === 'string' && raw.length > 0 ? raw : '';
    }
    // text / select
    return typeof raw === 'string' ? raw : '';
}

export default function FilterBar({
                                      fields,
                                      values,
                                      onChange,
                                      title = 'Filtros',
                                      className,
                                      isCollapsible = false,
                                      isOpen: isOpenProp,
                                      onClear,
                                  }: Props): JSX.Element | null {
    // Guard: sin campos no renderizamos nada (mejor UX que crashear)
    if (!fields || fields.length === 0) return null;

    // estado de colapso controlado/semicontrolado
    const [internalOpen, setInternalOpen] = useState<boolean>(true);
    const isOpen = isCollapsible ? (isOpenProp ?? internalOpen) : true;

    const safeFields = useMemo(() => {
        // filtramos cosas raras y evitamos ids vacíos
        const unique = new Set<string>();
        return fields.filter(f => {
            const ok = !!f && typeof f.id === 'string' && f.id.trim().length > 0 && typeof f.label === 'string';
            if (!ok) return false;
            if (unique.has(f.id)) return false;
            unique.add(f.id);
            return true;
        });
    }, [fields]);

    function update(id: string, kind: FilterKind, raw: string | boolean): void {
        const nextVal = coerce(kind, raw);
        const next: Record<string, unknown> = {...values};
        // no metemos undefined explícito; borramos si está vacío
        if (nextVal === '' || nextVal === null) {
            delete next[id];
        } else {
            next[id] = nextVal;
        }
        onChange(next);
    }

    function renderField(f: FilterField): JSX.Element {
        const v = readValue(values, f.id);

        if (f.type === 'select') {
            const hasOptions = Array.isArray(f.options) && f.options.length > 0;
            return (
                <label key={f.id} className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{f.label}</span>
                    <select
                        value={typeof v === 'string' ? v : ''}
                        onChange={(e) => update(f.id, f.type, e.target.value)}
                        className="border rounded-lg px-3 py-2"
                        disabled={!hasOptions}
                    >
                        <option value="">{hasOptions ? '— Selecciona —' : 'Sin opciones'}</option>
                        {hasOptions &&
                            f.options!.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                    </select>
                </label>
            );
        }

        if (f.type === 'boolean') {
            return (
                <label key={f.id} className="inline-flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={Boolean(v)}
                        onChange={(e) => update(f.id, f.type, e.target.checked)}
                        className="h-4 w-4"
                    />
                    <span className="text-sm">{f.label}</span>
                </label>
            );
        }

        if (f.type === 'number') {
            return (
                <label key={f.id} className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{f.label}</span>
                    <input
                        inputMode="decimal"
                        type="number"
                        value={typeof v === 'number' || typeof v === 'string' ? String(v) : ''}
                        onChange={(e) => update(f.id, f.type, e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    />
                </label>
            );
        }

        if (f.type === 'date') {
            return (
                <label key={f.id} className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{f.label}</span>
                    <input
                        type="date"
                        value={typeof v === 'string' ? v : ''}
                        onChange={(e) => update(f.id, f.type, e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    />
                </label>
            );
        }

        // text (por defecto)
        return (
            <label key={f.id} className="flex flex-col gap-1">
                <span className="text-sm font-medium">{f.label}</span>
                <input
                    type="text"
                    value={typeof v === 'string' || typeof v === 'number' ? String(v) : ''}
                    onChange={(e) => update(f.id, f.type, e.target.value)}
                    className="border rounded-lg px-3 py-2"
                />
            </label>
        );
    }

    return (
        <section className={classNames('w-full border rounded-2xl p-3 md:p-4 bg-white', className)}>
            <header className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{title}</h3>
                {isCollapsible && (
                    <button
                        type="button"
                        onClick={() => setInternalOpen(o => !o)}
                        className="text-sm underline"
                    >
                        {isOpen ? 'Ocultar' : 'Mostrar'}
                    </button>
                )}
            </header>

            {isOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {safeFields.map(renderField)}
                </div>
            )}

            <footer className="mt-3 flex gap-2">
                <button
                    type="button"
                    onClick={() => onChange({})}
                    className="text-sm px-3 py-1 border rounded-lg"
                >
                    Limpiar
                </button>
                {onClear && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-sm px-3 py-1 border rounded-lg"
                    >
                        Reset preset
                    </button>
                )}
            </footer>
        </section>
    );
}
