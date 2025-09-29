import React, {useEffect, useMemo, useRef, useState} from 'react';
import type {FilterField, FilterValues, Primitive} from './types';

export type DensityMode = 'detailed' | 'simple';

export interface FilterBarProps<T = unknown> {
    /** Definición de campos (se alimenta desde presets por pestaña) */
    fields: Array<FilterField<T>>;
    /** Estado controlado de filtros */
    values: FilterValues;
    onChange: (values: FilterValues) => void;

    /** Acciones */
    onSearch?: () => void;   // Enter o botón Buscar
    onClear?: () => void;    // Esc o botón Borrar

    /** Vista (si procede en la tabla) */
    densityMode?: DensityMode;
    onDensityModeChange?: (d: DensityMode) => void;

    /** Apariencia/comportamiento */
    isInline?: boolean;
    debounceMs?: number;
    className?: string;

    /** Colapsable */
    isCollapsible?: boolean;
    isOpen?: boolean;
    onToggle?: (open: boolean) => void;
}

const DEFAULT_DEBOUNCE = 250;

export default function FilterBar<T>({
                                         fields,
                                         values,
                                         onChange,
                                         onSearch,
                                         onClear,
                                         densityMode,
                                         onDensityModeChange,
                                         isInline = true,
                                         debounceMs = DEFAULT_DEBOUNCE,
                                         className,
                                         isCollapsible = true,
                                         isOpen,
                                         onToggle,
                                     }: FilterBarProps<T>) {
    const [local, setLocal] = useState(values);
    const [openInternal, setOpenInternal] = useState(true);
    const open = typeof isOpen === 'boolean' ? isOpen : openInternal;
    const inputRef = useRef<HTMLInputElement | null>(null);

    function toggleOpen() {
        const next = !open;
        onToggle ? onToggle(next) : setOpenInternal(next);
    }

    // Sincroniza si el padre resetea filtros
    useEffect(() => setLocal(values), [values]);

    // Commit con debounce para text/number; instantáneo para select/boolean/date
    useEffect(() => {
        const h = setTimeout(() => {
            if (JSON.stringify(local) !== JSON.stringify(values)) {
                onChange(local);
            }
        }, debounceMs);
        return () => clearTimeout(h);
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
            onChange({...local, [id]: value});
            setLocal((prev) => ({...prev, [id]: value}));
            return;
        }
        setLocal((prev) => ({...prev, [id]: value}));
    }

    // Accesos rápidos
    function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.key === 'Enter' && onSearch) onSearch();
        if (e.key === 'Escape' && onClear) {
            onClear();
            inputRef.current?.focus();
        }
    }

    return (
        <div className="card p-4 gap-3" onKeyDown={onKeyDown} role="group" aria-label="Filtro de Busqueda">
            {/* Header: título izquierda + toggle derecha (y opcionalmente selector de vista si quieres aquí) */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">Filtro de Busqueda</h3>

                <div className="flex items-center gap-3">
                    {/* Si quisieras mover el selector de vista aquí, descomenta: */}
                    {/* {typeof densityMode !== 'undefined' && onDensityModeChange && (
            <>
              <label className="text-sm" htmlFor="density-mode">Vista:</label>
              <select
                id="density-mode"
                className="select"
                value={densityMode}
                onChange={(e) => onDensityModeChange(e.target.value as DensityMode)}
                aria-label="Cambiar vista de columnas"
              >
                <option value="detailed">Detallada</option>
                <option value="simple">Simple</option>
              </select>
            </>
          )} */}

                    {isCollapsible && (
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={toggleOpen}
                            aria-expanded={open}
                            aria-controls="filterbar-content"
                        >
                            {open ? 'Ocultar' : 'Mostrar'}
                        </button>
                    )}
                </div>
            </div>

            {/* Formulario de filtros */}
            {open && (
                <div id="filterbar-content" className={containerCls}>
                    {fields.map((f, idx) => {
                        const id = String(f.id);
                        const val = local[id] ?? f.defaultValue ?? '';
                        const key = `${id}_${idx}`;

                        return (
                            <div key={key} className="min-w-[220px]">
                                <label className={labelCls} htmlFor={key}>
                                    {f.label}
                                </label>

                                {f.type === 'text' && (
                                    <input
                                        ref={idx === 0 ? inputRef : undefined}
                                        id={key}
                                        className={inputCls}
                                        value={String(val ?? '')}
                                        onChange={(e) => setValue(id, e.target.value)}
                                        placeholder={`Filtrar por ${f.label.toLowerCase()}`}
                                    />
                                )}

                                {f.type === 'number' && (
                                    <input
                                        id={key}
                                        className={inputCls}
                                        type="number"
                                        value={val === '' || val == null ? '' : Number(val)}
                                        onChange={(e) => setValue(id, e.target.value === '' ? '' : Number(e.target.value))}
                                        placeholder={`≥ ${f.label.toLowerCase()}`}
                                    />
                                )}

                                {f.type === 'select' && (
                                    <select
                                        id={key}
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
                                        id={key}
                                        className={inputCls}
                                        value={val === '' || val == null ? '' : String(Boolean(val))}
                                        onChange={(e) => setValue(id, e.target.value === '' ? '' : e.target.value === 'true', true)}
                                    >
                                        <option value="">—</option>
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                )}

                                {f.type === 'date' && (
                                    <input
                                        id={key}
                                        className={inputCls}
                                        type="date"
                                        value={val ? String(val).slice(0, 10) : ''}
                                        onChange={(e) => setValue(id, e.target.value, true)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Acciones */}
            {(onSearch || onClear) && (
                <div className="flex justify-end gap-2 mt-3">
                    {onClear && (
                        <button className="btn btn-secondary" type="button" onClick={onClear}
                                aria-label="Borrar filtros">
                            Borrar
                        </button>
                    )}
                    {onSearch && (
                        <button className="btn" type="button" onClick={onSearch} aria-label="Buscar">
                            Buscar
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
