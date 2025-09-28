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
    globalFilterPlaceholder?: string;
}


/**
 * Presentational generic table. Sorting is handled by parent; headers just emit `onSortChange`.
 */
export function DataTable<T>({
                                 rows,
                                 columns,
                                 sort = {columnId: null, direction: null},
                                 onSortChange,
                                 emptyState,
                                 className,
                                 hideHeader = false,
                                 globalFilterPlaceholder: _globalFilterPlaceholder,
                             }: DataTableProps<T>) {
    const safeRows = (rows ?? []) as T[];
    const safeCols = (columns ?? []).map((col, index) => {
        const id =
            col.id ?? (typeof col.accessorKey === 'string' ? col.accessorKey : undefined) ?? `col_${index}`;
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
        // 1) Valor base: accessor > accessorKey > id
        const rowObj = row as unknown as Record<string, unknown>;
        const value =
            col.accessor?.(row) ??
            (col.accessorKey ? rowObj[col.accessorKey] : undefined) ??
            (typeof col.id === 'string' ? rowObj[col.id] : undefined);

        // 2) Render de celda
        if (col.cell) {
            if (!col.accessor && col.accessorKey) {
                const fn = col.cell as (ctx: { row: { original: T } }) => React.ReactNode;
                return fn({row: {original: row}});
            }
            const fn = col.cell as (value: unknown, row: T) => React.ReactNode;
            return fn(value, row);
        }
        return value as React.ReactNode;
    }

    return (
        <div className={className}>
            {!hideHeader && (
                <div className="dt-header">
                    {safeCols.map((c) => (
                        <div key={String(c.id)} className="dt-th">
                            {c.header}
                        </div>
                    ))}
                </div>
            )}

            <div className="dt-body">
                {safeRows.length === 0
                    ? (emptyState ?? <div className="dt-empty">Sin datos</div>)
                    : safeRows.map((row, rIdx) => (
                        <div key={rIdx} className="dt-tr">
                            {safeCols.map((c) => (
                                <div key={String(c.id)} className="dt-td">
                                    {renderCell(c, row)}
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default DataTable;
