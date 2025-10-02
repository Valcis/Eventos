// src/components/ui/DataTable/index.tsx
import React, {ReactNode, useMemo} from 'react';
import type {DataTableProps, ColumnDef, SortState, CellValue} from './types';
import Pagination from './Pagination';

function DataTable<Row extends Record<string, unknown>>({
                                                            rows,
                                                            columns,
                                                            showDensityToggle = false,
                                                            onCreate,
                                                            sort = {columnId: null, direction: null},
                                                            onSortChange,
                                                            density = 'compact',
                                                            isDense,
                                                            densityMode,
                                                            globalFilterValue,
                                                            onGlobalFilterChange,
                                                            className,
                                                            emptyState,
                                                            page = 1,
                                                            pageSize = 10,
                                                            total,
                                                            onPageChange,
                                                            onPageSizeChange,
                                                            renderActions,
                                                            hideHeader = false,
                                                        }: DataTableProps<Row>): JSX.Element {
    const safeRows: Row[] = rows ? [...rows] as Row[] : [];
    const safeColumns: ColumnDef<Row>[] = (columns ? [...columns] : []).map((column, index) => {
        const columnId =
            (column.id as string | undefined) ??
            (typeof column.accessorKey === 'string' ? column.accessorKey : undefined) ??
            `col_${index}`;
        return {...column, id: columnId};
    });

    const actionsCol: ColumnDef<Row> | undefined = renderActions
        ? {id: '__actions__', header: 'Acciones', role: 'actions'}
        : undefined;

    const filteredRows: Row[] = useMemo(() => {
        if (!globalFilterValue) return safeRows;
        const q = globalFilterValue.toLowerCase().trim();
        return safeRows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
    }, [safeRows, globalFilterValue]);

    function getCellValue(column: ColumnDef<Row>, row: Row): unknown {
        if (column.accessor) return column.accessor(row);
        if (column.accessorKey) return (row as Record<string, unknown>)[column.accessorKey];
        if (typeof column.id === 'string') return (row as Record<string, unknown>)[column.id];
        return undefined;
    }

    const sortedRows: Row[] = useMemo(() => {
        const {columnId, direction} = sort;
        if (!columnId || !direction) return filteredRows;
        const column = safeColumns.find((c) => String(c.id) === String(columnId));
        if (!column) return filteredRows;

        const compare: (a: Row, b: Row) => number = column.sortFn
            ? (a, b) => column.sortFn!(a, b, direction)
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
                const l = String(left);
                const r = String(right);
                return direction === 'asc' ? l.localeCompare(r) : r.localeCompare(l);
            };
        return [...filteredRows].sort(compare);
    }, [filteredRows, safeColumns, sort]);

    const baseColumns: ColumnDef<Row>[] =
        densityMode === 'simple'
            ? safeColumns.filter((c) => c.isSimpleKey === true)
            : safeColumns;
    const visibleColumns: ColumnDef<Row>[] = actionsCol ? [...baseColumns, actionsCol] : baseColumns;

    // 🔧 CLAVE: definir columnas de grid dinámicamente
    const gridStyle: React.CSSProperties = useMemo(
        () => ({gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(0, 1fr))`}),
        [visibleColumns.length],
    );

    const effectiveDensity = typeof isDense === 'boolean' ? (isDense ? 'compact' : 'normal') : density;
    const headPaddingY = effectiveDensity === 'compact' ? 'py-1' : 'py-2';
    const cellPaddingY = effectiveDensity === 'compact' ? 'py-1' : 'py-2.5';

    const totalItems = typeof total === 'number' ? total : sortedRows.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageRows = onPageChange ? sortedRows.slice(start, end) : sortedRows;
    const hidePaginator = totalItems <= 5;

    return (
        <div className={className}>
            {/* Header: contador + toggles + crear */}
            <div className="flex items-center justify-between mb-2">
                <div className="text-sm">{totalItems} elementos encontrados</div>
                {showDensityToggle && typeof densityMode !== 'undefined' && (
                    <button
                        type="button"
                        className="px-3 py-1 rounded-lg border"
                        onClick={() => {
                            const next = densityMode === 'detailed' ? 'simple' : 'detailed';
                            // Deja el control del toggle a la página (no mutamos state aquí)
                            console.warn('Toggle de vista pulsado. Cambia densityMode en la página ->', next);
                        }}
                        aria-label="Cambiar vista (detallada/simple)"
                        title="Cambiar vista (detallada/simple)"
                    >
                        {densityMode === 'detailed' ? 'Vista: Detallada' : 'Vista: Simple'}
                    </button>
                )}
                {onCreate && (
                    <button type="button" className="px-3 py-1 rounded-lg bg-indigo-600 text-white" onClick={onCreate}>
                        Crear
                    </button>
                )}
            </div>

            {/* Cabecera de tabla */}
            {!hideHeader && (
                <div
                    className={`grid ${headPaddingY} border-b text-sm font-medium`}
                    role="row"
                    style={gridStyle}
                >
                    {visibleColumns.map((column) => {
                        const isSorted = sort.columnId === column.id && sort.direction;
                        const ariaSort = (isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none') as React.AriaAttributes['aria-sort'];
                        return (
                            <div
                                key={String(column.id)}
                                role="columnheader"
                                aria-sort={ariaSort}
                                className={`px-3 ${headPaddingY} font-semibold cursor-pointer`}
                                onClick={() => {
                                    if (!column.isSortable) return;
                                    const isSame = sort.columnId === column.id;
                                    const next: SortState['direction'] = !isSame
                                        ? 'asc'
                                        : sort.direction === 'asc'
                                            ? 'desc'
                                            : sort.direction === 'desc'
                                                ? null
                                                : 'asc';
                                    onSortChange?.({columnId: next ? String(column.id) : null, direction: next});
                                }}
                            >
                                {column.header}{' '}
                                {isSorted && sort.direction && <span>{sort.direction === 'asc' ? '▲' : '▼'}</span>}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Filas */}
            {pageRows.length === 0 ? (
                <div className="p-6 text-center text-zinc-500">{emptyState ?? 'Sin datos'}</div>
            ) : (
                <div className="divide-y">
                    {pageRows.map((row, rowIndex) => (
                        <div key={rowIndex} className={`grid ${cellPaddingY}`} role="row" style={gridStyle}>
                            {visibleColumns.map((column, columnIndex) => {
                                const val = column.role === 'actions'
                                    ? null
                                    : (getCellValue(column, row) as CellValue);
                                return (
                                    <div key={`${rowIndex}_${columnIndex}`} className={`px-3 ${cellPaddingY}`}>
                                        {column.role === 'actions'
                                            ? renderActions
                                                ? renderActions(row)
                                                : null
                                            : column.cell
                                                ? (column.cell as (v: CellValue, r: Row) => ReactNode)(val, row)
                                                : (val as ReactNode)}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}

            {/* Paginación */}
            <div className={hidePaginator ? 'hidden' : 'block'}>
                <Pagination
                    page={page}
                    pageSize={pageSize}
                    total={totalItems}
                    onPageChange={onPageChange ?? (() => {})}
                    onPageSizeChange={onPageSizeChange ?? (() => {})}
                    isCompact={effectiveDensity === 'compact'}
                />
            </div>
        </div>
    );
}

export default DataTable;
