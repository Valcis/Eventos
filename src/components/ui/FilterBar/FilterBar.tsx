// src/components/ui/FilterBar/FilterBar.tsx
import React, { useEffect, useMemo, useState } from 'react';
import type { FilterField, FilterValues, Primitive } from './types';

export interface FilterBarProps<T = unknown> {
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

    // Añadidos (las páginas los usan)
    onSearch?: () => void;
    onClear?: () => void;
}

const DEFAULT_DEBOUNCE = 250;

/** Generic, reusable filter bar. Controlled via `values` + `onChange`. */
export function FilterBar<T>({
                                 fields,
                                 values,
                                 onChange,
                                 isInline = true,
                                 debounceMs = DEFAULT_DEBOUNCE,
                                 className,
                                 title,
                                 isCollapsible = true,
                                 isOpen,
                                 onToggle,
                                 onSearch,
                                 onClear,
                             }: FilterBarProps<T>) {
    const [local, setLocal] = useState(values);
    const [openInternal, setOpenInternal] = useState(true);
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
            `${isInline ? 'flex flex-wrap items-end gap-3' : 'grid gap-3'} bg-white p-3 rounded-2xl shadow-sm ${
                className ?? ''
            }`,
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
            <div className="flex items-center justify-between w-full">
                <div className="text-base font-semibold">{title ?? 'Filtros'}</div>
                {isCollapsible && (
                    <button type="button" className="text-sm underline" onClick={toggleOpen}>
                        {open ? 'Ocultar filtros' : 'Mostrar filtros'}
                    </button>
                )}
            </div>

            {/* Formulario de filtros */}
            {open && (
                <div className={`w-full grid grid-cols-1 md:grid-cols-4 gap-3`}>
                    {fields.map((f) => {
                        const id = String(f.id);
                        const val = (local as Record<string, Primitive>)[id] ?? f.defaultValue ?? '';

                        return (
                            <label key={id} className="grid gap-1">
                                <span className={labelCls}>{f.label}</span>

                                {f.type === 'text' && (
                                    <input
                                        className={inputCls}
                                        value={String(val)}
                                        onChange={(e) => setValue(id, e.target.value)}
                                        placeholder={`Filtrar por ${f.label.toLowerCase()}`}
                                    />
                                )}

                                {f.type === 'number' && (
                                    <input
                                        className={inputCls}
                                        type="number"
                                        value={val === '' ? '' : Number(val)}
                                        onChange={(e) => setValue(id, e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder={`≥ ${f.label.toLowerCase()}`}
                                    />
                                )}

                                {f.type === 'select' && (
                                    <select
                                        className={inputCls}
                                        value={String(val)}
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
                                        className={inputCls}
                                        value={val === '' ? '' : val ? 'true' : 'false'}
                                        onChange={(e) => setValue(id, e.target.value === '' ? '' : e.target.value === 'true', true)}
                                    >
                                        <option value="">—</option>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                )}

                                {f.type === 'date' && (
                                    <input
                                        className={inputCls}
                                        type="date"
                                        value={typeof val === 'string' ? val : ''}
                                        onChange={(e) => setValue(id, e.target.value, true)}
                                    />
                                )}
                            </label>
                        );
                    })}
                </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 mt-2">
                {onSearch && (
                    <button type="button" className="px-3 py-1 rounded-lg bg-indigo-600 text-white" onClick={onSearch}>
                        Buscar
                    </button>
                )}
                {onClear && (
                    <button type="button" className="px-3 py-1 rounded-lg border" onClick={onClear}>
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    );
}

export default FilterBar;
