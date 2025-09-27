import React from 'react';
import type {ColumnDef, SortState} from './types';


export interface DataTableProps<T> {
    rows?: T[];
    columns?: ColumnDef<T>[];
    sort?: SortState;
    onSortChange?: (next: SortState) => void;
    emptyState?: React.ReactNode;
    className?: string;
    hideHeader?: boolean;
}

/**
 * Presentational generic table. Sorting is handled by parent; headers just emit `onSortChange`.
 */
export function DataTable<T>({
                                 rows, columns, sort = {columnId: null, direction: null},
                                 onSortChange, emptyState, className, hideHeader = false,
                             }: DataTableProps<T>) {

    const safeRows = rows ?? [];
    const safeCols = columns ?? [];
    const headerCellCls = 'px-4 py-3 text-sm font-semibold text-zinc-700 select-none';
    const cellBase = 'px-4 py-3 text-sm text-zinc-800';
    const tableCls = 'w-full border border-zinc-200 rounded-2xl overflow-hidden bg-white';

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

    return (
        <div className={className}>
            <div className="overflow-x-auto">
                <table className={tableCls}>
                    {!hideHeader && (
                        <thead className="bg-zinc-50">
                        <tr>
                            {safeCols.map((c) => {      // <- usar safeCols
                                const id = String(c.id);
                                const isActive = sort.columnId === id && !!sort.direction;
                                const ariaSort = isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';
                                return (
                                    <th
                                        key={id}
                                        // ...
                                        onClick={() => toggleSort(id, c.isSortable)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{c.header}</span>
                                            {c.isSortable && (
                                                <span className="text-xs text-zinc-500" aria-hidden>
                            {isActive ? (sort.direction === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                        </thead>
                    )}
                    <tbody>
                    {safeRows.length === 0 && (
                        <tr>
                            <td colSpan={safeCols.length || 1} className={`${cellBase} text-center`}>
                                {emptyState ?? 'No hay resultados'}
                            </td>
                        </tr>
                    )}
                    {safeRows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/60'}>
                            {safeCols.map((c) => {
                                const id = String(c.id);
                                const rawValue = c.accessor ? c.accessor(row) : (row as any)[c.id as keyof T];
                                const content = c.cell ? c.cell(rawValue, row) : (rawValue as React.ReactNode);
                                return (
                                    <td key={id}
                                        className={`${cellBase} ${c.align === 'center' ? 'text-center' : c.align === 'right' ? 'text-right' : 'text-left'}`}
                                        style={{width: c.width}}>
                                        {content}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default DataTable;