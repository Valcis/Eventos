import React from 'react';
import type {Table} from '@tanstack/react-table';

interface Props<TData> {
    table: Table<TData>;
    placeholder?: string;
}

export default function Toolbar<TData>({table, placeholder = 'Buscar…'}: Props<TData>) {
    const {globalFilter} = table.getState();

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <input
                className="input max-w-xs"
                placeholder={placeholder}
                value={(globalFilter as string) ?? ''}
                onChange={e => table.setGlobalFilter(e.target.value)}
            />
            <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                    table.resetGlobalFilter();
                    table.resetColumnFilters();
                }}
            >
                Limpiar filtros
            </button>
            {/* Filtros por columna: si alguna columna tiene getCanFilter, renderizar input/select */}
            <div className="flex items-center gap-2 flex-wrap ml-auto">
                {table.getHeaderGroups().map(hg =>
                    hg.headers.map(h => {
                        const column = h.column;
                        if (!column.getCanFilter()) return null;
                        const id = column.id;
                        const value = column.getFilterValue();
                        // Render simple input de texto por defecto
                        return (
                            <label key={id} className="flex items-center gap-1 text-sm">
                                {typeof h.column.columnDef.header === 'string' ? h.column.columnDef.header : id}
                                <input
                                    className="input h-8"
                                    value={(value as string) ?? ''}
                                    onChange={e => column.setFilterValue(e.target.value)}
                                />
                            </label>
                        );
                    })
                )}
            </div>
        </div>
    );
}
