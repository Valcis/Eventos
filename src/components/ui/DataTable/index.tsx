import React, {useMemo} from 'react';
import type {ColumnDef, SortState, DataTableExtraProps} from './types';

export interface DataTableProps<T = unknown> extends DataTableExtraProps {
    rows?: T[];
    columns?: ColumnDef<T>[];
    sort?: SortState;
    onSortChange?: (next: SortState) => void;
    emptyState?: React.ReactNode;
    className?: string;
    hideHeader?: boolean;
    /** compat: placeholder del filtro (si usas el control externo arriba o en el padre) */
    globalFilterPlaceholder?: string;
}

/**
 * Presentational generic table. Ordenación y filtro global client-side, simples.
 */
export function DataTable<T>({
                                 rows,
                                 columns,
                                 sort = {columnId: null, direction: null},
                                 onSortChange,
                                 emptyState,
                                 className,
                                 hideHeader = false,
                                 globalFilterPlaceholder: _placeholder, // compat (renderízalo fuera)
                                 globalFilterValue,
                                 onGlobalFilterChange,
                                 density = 'compact',
                             }: DataTableProps<T>) {
    const safeRows = (rows ?? []) as T[];
    const safeCols = (columns ?? []).map((col, index) => {
        const id =
            col.id ??
            (typeof col.accessorKey === 'string' ? col.accessorKey : undefined) ??
            `col_${index}`;
        return {...col, id} as ColumnDef<T>;
    });

    function toggleSort(colId: string, isSortable?: boolean) {
        if (!isSortable) return;
        const isSame = sort.columnId === colId;
        const nextDirection: SortState['direction'] = !isSame
            ? 'asc'
            : sort.direction === 'asc'
                ? 'desc'
                : sort.direction === 'desc'
                    ? null
                    : 'asc';
        onSortChange?.({columnId: nextDirection ? colId : null, direction: nextDirection});
    }

    function renderCell(col: ColumnDef<T>, row: T) {
        // 1) Valor base: accessor > accessorKey > id (si es string)
        const rowObj = row as unknown as Record<string, unknown>;
        const value =
            col.accessor?.(row) ??
            (col.accessorKey ? rowObj[col.accessorKey] : undefined) ??
            (typeof col.id === 'string' ? rowObj[col.id] : undefined);

        // 2) Render de celda
        if (col.cell) {
            // Soporte tanstack-like cell({ row })
            if (!col.accessor && col.accessorKey) {
                const fn = col.cell as (ctx: { row: { original: T } }) => React.ReactNode;
                return fn({row: {original: row}});
            }
            const fn = col.cell as (value: unknown, row: T) => React.ReactNode;
            return fn(value, row);
        }
        return value as React.ReactNode;
    }

    // Filtro global simple (client-side)
    const filteredRows = useMemo(() => {
        if (!globalFilterValue) return safeRows;
        const q = globalFilterValue.toLowerCase().trim();
        return safeRows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
    }, [safeRows, globalFilterValue]);

    // Ordenación client-side simple
    const sortedRows = useMemo(() => {
        const {columnId, direction} = sort;
        if (!columnId || !direction) return filteredRows;
        const col = safeCols.find((c) => String(c.id) === String(columnId));
        if (!col) return filteredRows;
        const dir = direction;
        const cmp =
            col.sortFn ??
            ((a: T, b: T, d: 'asc' | 'desc') => {
                const ao = a as unknown as Record<string, unknown>;
                const bo = b as unknown as Record<string, unknown>;
                const av =
                    col.accessor?.(a) ??
                    (col.accessorKey ? ao[col.accessorKey] : undefined) ??
                    (typeof col.id === 'string' ? ao[col.id] : undefined);
                const bv =
                    col.accessor?.(b) ??
                    (col.accessorKey ? bo[col.accessorKey] : undefined) ??
                    (typeof col.id === 'string' ? bo[col.id] : undefined);
                if (av == null && bv == null) return 0;
                if (av == null) return d === 'asc' ? -1 : 1;
                if (bv == null) return d === 'asc' ? 1 : -1;
                if (typeof av === 'number' && typeof bv === 'number') {
                    return d === 'asc' ? av - bv : bv - av;
                }
                const sa = String(av);
                const sb = String(bv);
                return d === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
            });
        return [...filteredRows].sort((a, b) => cmp(a, b, dir));
    }, [filteredRows, safeCols, sort]);

    const headPy = density === 'compact' ? 'py-1' : 'py-2';
    const cellPy = density === 'compact' ? 'py-1' : 'py-2.5';

    return (
        <div className={className}>
            {/* Si quieres, renderiza un control de filtro externo y pásalo vía props */}
            {/* Tabla */}
            <div className="overflow-auto rounded-xl border border-zinc-200">
                <table className="min-w-full text-sm">
                    {!hideHeader && (
                        <thead className="bg-zinc-50">
                        <tr>
                            {safeCols.map((c) => (
                                <th
                                    key={String(c.id)}
                                    className={`text-left ${headPy} px-3 font-medium text-zinc-700 select-none`}
                                    style={{width: c.width}}
                                    onClick={() => toggleSort(String(c.id), c.isSortable)}
                                >
                                    <div
                                        className={`inline-flex items-center gap-1 ${
                                            (c.align ?? 'left') === 'right'
                                                ? 'justify-end w-full'
                                                : (c.align ?? 'left') === 'center'
                                                    ? 'justify-center w-full'
                                                    : ''
                                        }`}
                                        role={c.isSortable ? 'button' : undefined}
                                        aria-label={c.isSortable ? 'Ordenar' : undefined}
                                    >
                                        {c.header}
                                        {sort.columnId === c.id && sort.direction && (
                                            <span aria-hidden> {sort.direction === 'asc' ? '▲' : '▼'} </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                    )}
                    <tbody>
                    {sortedRows.length === 0 ? (
                        <tr>
                            <td className="px-3 py-6 text-center text-zinc-500" colSpan={safeCols.length}>
                                {emptyState ?? 'Sin datos'}
                            </td>
                        </tr>
                    ) : (
                        sortedRows.map((row, rIdx) => (
                            <tr key={(row as any)?.id ?? rIdx} className="border-t border-zinc-100">
                                {safeCols.map((c, cIdx) => (
                                    <td
                                        key={`${String(c.id)}_${rIdx}_${cIdx}`}
                                        className={`${cellPy} px-3 text-zinc-800 ${
                                            (c.align ?? 'left') === 'right'
                                                ? 'text-right'
                                                : (c.align ?? 'left') === 'center'
                                                    ? 'text-center'
                                                    : 'text-left'
                                        }`}
                                        style={{width: c.width}}
                                    >
                                        {renderCell(c, row)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;
