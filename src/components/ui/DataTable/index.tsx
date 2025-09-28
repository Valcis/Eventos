import React, {ReactNode, useMemo} from 'react';
import type {DataTableProps, ColumnDef, SortState} from './types';

function DataTable<Row>({
                            rows,
                            columns,
                            sort = {columnId: null, direction: null},
                            onSortChange,
                            emptyState,
                            className,
                            hideHeader = false,
                            globalFilterValue,
                            onGlobalFilterChange, // reservado para uso externo
                            density = 'compact',
                        }: DataTableProps<Row>): JSX.Element {
    const safeRows: Row[] = rows ?? [];
    const safeColumns: Array<ColumnDef<Row, unknown>> = (columns ?? []).map((column, index) => {
        const columnId =
            column.id ??
            (typeof column.accessorKey === 'string' ? column.accessorKey : undefined) ??
            `col_${index}`;
        return {...column, id: columnId};
    });

    function toggleSort(columnId: string, isSortable?: boolean): void {
        if (!isSortable) return;
        const isSame = sort.columnId === columnId;
        const next: SortState['direction'] =
            !isSame ? 'asc' : sort.direction === 'asc' ? 'desc' : sort.direction === 'desc' ? null : 'asc';
        onSortChange?.({columnId: next ? columnId : null, direction: next});
    }

    function getCellValue(column: ColumnDef<Row, unknown>, row: Row): unknown {
        if (column.accessor) return column.accessor(row);
        if (column.accessorKey) return (row as unknown as Record<string, unknown>)[column.accessorKey];
        if (typeof column.id === 'string') return (row as unknown as Record<string, unknown>)[column.id];
        return undefined;
    }

    function renderCell(column: ColumnDef<Row, unknown>, row: Row): ReactNode {
        const value = getCellValue(column, row);
        if (column.cell) {
            // bivariante: podemos pasar unknown sin romper tipos
            return (column.cell as (v: unknown, r: Row) => ReactNode)(value, row);
        }
        return value as ReactNode;
    }

    const filteredRows: Row[] = useMemo(() => {
        if (!globalFilterValue) return safeRows;
        const query = globalFilterValue.toLowerCase().trim();
        return safeRows.filter((row) => JSON.stringify(row).toLowerCase().includes(query));
    }, [safeRows, globalFilterValue]);

    const sortedRows: Row[] = useMemo(() => {
        const {columnId, direction} = sort;
        if (!columnId || !direction) return filteredRows;

        const column = safeColumns.find((c) => String(c.id) === String(columnId)) as
            | ColumnDef<Row, unknown>
            | undefined;
        if (!column) return filteredRows;

        const compare: (a: Row, b: Row) => number = column.sortFn
            ? (a, b) => (column.sortFn as (a: Row, b: Row, d: 'asc' | 'desc') => number)(a, b, direction)
            : (a, b) => {
                const left = getCellValue(column, a);
                const right = getCellValue(column, b);

                if (left == null && right == null) return 0;
                if (left == null) return direction === 'asc' ? -1 : 1;
                if (right == null) return direction === 'asc' ? 1 : -1;

                if (typeof left === 'number' && typeof right === 'number') {
                    return direction === 'asc' ? left - right : right - left;
                }
                if (typeof left === 'boolean' && typeof right === 'boolean') {
                    return direction === 'asc' ? Number(left) - Number(right) : Number(right) - Number(left);
                }
                const leftStr = String(left);
                const rightStr = String(right);
                return direction === 'asc' ? leftStr.localeCompare(rightStr) : rightStr.localeCompare(leftStr);
            };

        return [...filteredRows].sort(compare);
    }, [filteredRows, safeColumns, sort]);

    const headPaddingY = density === 'compact' ? 'py-1' : 'py-2';
    const cellPaddingY = density === 'compact' ? 'py-1' : 'py-2.5';

    return (
        <div className={className}>
            <div className="overflow-auto rounded-xl border border-zinc-200">
                <table className="min-w-full text-sm">
                    {!hideHeader && (
                        <thead className="bg-zinc-50">
                        <tr>
                            {safeColumns.map((column) => (
                                <th
                                    key={String(column.id)}
                                    className={`text-left ${headPaddingY} px-3 font-medium text-zinc-700 select-none`}
                                    style={{width: column.width}}
                                    onClick={() => toggleSort(String(column.id), column.isSortable)}
                                >
                                    <div
                                        className={`inline-flex items-center gap-1 ${
                                            (column.align ?? 'left') === 'right'
                                                ? 'justify-end w-full'
                                                : (column.align ?? 'left') === 'center'
                                                    ? 'justify-center w-full'
                                                    : ''
                                        }`}
                                        role={column.isSortable ? 'button' : undefined}
                                    >
                                        {column.header}
                                        {sort.columnId === column.id && sort.direction && (
                                            <span aria-hidden>{sort.direction === 'asc' ? '▲' : '▼'}</span>
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
                            <td className="px-3 py-6 text-center text-zinc-500" colSpan={safeColumns.length}>
                                {emptyState ?? 'Sin datos'}
                            </td>
                        </tr>
                    ) : (
                        sortedRows.map((row, rowIndex) => (
                            <tr
                                key={(row as unknown as { id?: string })?.id ?? rowIndex}
                                className="border-t border-zinc-100"
                            >
                                {safeColumns.map((column, columnIndex) => (
                                    <td
                                        key={`${String(column.id)}_${rowIndex}_${columnIndex}`}
                                        className={`${cellPaddingY} px-3 text-zinc-800 ${
                                            (column.align ?? 'left') === 'right'
                                                ? 'text-right'
                                                : (column.align ?? 'left') === 'center'
                                                    ? 'text-center'
                                                    : 'text-left'
                                        }`}
                                        style={{width: column.width}}
                                    >
                                        {renderCell(column as ColumnDef<Row, unknown>, row)}
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
