import React, {ReactNode, useMemo} from 'react';
import type {DataTableProps, ColumnDef, SortState} from './types';
import Pagination from './Pagination';

type Row = Record<string, unknown>;

function DataTable({
                       rows,
                       columns,
                       showDensityToggle = false,
                       onCreate,

                       sort = {columnId: null, direction: null},
                       onSortChange,

                       density = 'compact',
                       isDense,

                       densityMode, // 'detailed' | 'simple' | undefined

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
    const safeRows: Row[] = rows ?? [];

    // Normaliza columnas + añade columna "acciones" si hace falta
    const safeColumns: ColumnDef[] = (columns ?? []).map((column, index) => {
        const columnId =
            (column.id as string | undefined) ??
            (typeof column.accessorKey === 'string' ? column.accessorKey : undefined) ??
            `col_${index}`;
        return {...column, id: columnId};
    });
    const actionsCol: ColumnDef | undefined = renderActions ? {
        id: '__actions__',
        header: 'Acciones',
        role: 'actions' as const
    } : undefined;

    // Filtrado global (compat)
    const filteredRows: Row[] = useMemo(() => {
        if (!globalFilterValue) return safeRows;
        const q = globalFilterValue.toLowerCase().trim();
        return safeRows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
    }, [safeRows, globalFilterValue]);

    // Ordenación (compat)
    function getCellValue(column: ColumnDef, row: Row): unknown {
        if (column.accessor) return column.accessor(row as never);
        if (column.accessorKey) return (row as Record<string, unknown>)[column.accessorKey];
        if (typeof column.id === 'string') return (row as Record<string, unknown>)[column.id];
        return undefined;
    }

    const sortedRows: Row[] = useMemo(() => {
        const {columnId, direction} = sort;
        if (!columnId || !direction) return filteredRows;
        const column = safeColumns.find((c) => String(c.id) === String(columnId)) as ColumnDef | undefined;
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
                const l = String(left);
                const r = String(right);
                return direction === 'asc' ? l.localeCompare(r) : r.localeCompare(l);
            };
        return [...filteredRows].sort(compare);
    }, [filteredRows, safeColumns, sort]);

    // Columnas visibles por densityMode
    const visibleColumns: ColumnDef[] = useMemo(() => {
        const base = densityMode === 'simple'
            ? safeColumns.filter((c) => c.isSimpleKey === true)
            : safeColumns;
        return actionsCol ? [...base, actionsCol] : base;
    }, [safeColumns, actionsCol, densityMode]);

    // Densidad de filas (visual)
    const effectiveDensity = typeof isDense === 'boolean' ? (isDense ? 'compact' : 'normal') : density;
    const headPaddingY = effectiveDensity === 'compact' ? 'py-1' : 'py-2';
    const cellPaddingY = effectiveDensity === 'compact' ? 'py-1' : 'py-2.5';

    // Paginación (client-side por defecto)
    const totalItems = typeof total === 'number' ? total : sortedRows.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageRows = onPageChange ? sortedRows.slice(start, end) : sortedRows;

    // REGLA NUEVA: el paginador se monta SIEMPRE pero se oculta si <= 5 filas.
    const hidePaginator = totalItems <= 5;

    // Header: "{n} elementos encontrados" | toggle centro | crear derecha
    return (
        <div className={`relative overflow-hidden rounded-2xl bg-white shadow-sm ${className ?? ''}`}>
            <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2">
                <div className="text-sm font-medium text-zinc-700">
                    {totalItems} elementos encontrados
                </div>

                <div className="flex items-center justify-center">
                    {showDensityToggle && typeof densityMode !== 'undefined' && (
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                                // el padre controla densityMode; aquí solo disparamos el cambio (si el padre la gestiona)
                                // (se deja decisión al padre; este botón es puramente de UI central)
                                // Si prefieres control interno, muévelo al padre (página) como hasta ahora.
                                const next = densityMode === 'detailed' ? 'simple' : 'detailed';
                                // No tenemos handler aquí por diseño del tipo; el toggling se hace en la página.
                                // Si quieres que DataTable lo gestione: agrega onDensityModeChange al DataTableProps.
                                console.warn('Toggle de vista pulsado: implementa en la página el cambio de densityMode ->', next);
                            }}
                            aria-label="Cambiar vista (detallada/simple)"
                            title="Cambiar vista (detallada/simple)"
                        >
                            {densityMode === 'detailed' ? 'Vista: Detallada' : 'Vista: Simple'}
                        </button>
                    )}
                </div>

                <div>
                    {onCreate && (
                        <button className="btn" onClick={onCreate} aria-label="Crear">Crear</button>
                    )}
                </div>
            </div>

            {/* Tabla */}
            {!hideHeader && (
                <div className="overflow-auto">
                    <table className="min-w-full">
                        <thead>
                        <tr>
                            {visibleColumns.map((column) => {
                                const isSorted = sort.columnId === column.id && sort.direction;
                                const ariaSort = isSorted ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none';
                                return (
                                    <th
                                        key={String(column.id)}
                                        className={`text-left text-sm font-semibold text-zinc-700 ${headPaddingY} px-3 select-none`}
                                        style={{width: column.width}}
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
                                            onSortChange?.({
                                                columnId: next ? String(column.id) : null,
                                                direction: next
                                            });
                                        }}
                                        role="columnheader"
                                        aria-sort={ariaSort as React.AriaAttributes['aria-sort']}
                                    >
                                        <div className="flex items-center gap-1">
                                            {column.header}
                                            {isSorted && sort.direction && (
                                                <span aria-hidden>{sort.direction === 'asc' ? '▲' : '▼'}</span>
                                            )}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                        </thead>
                    </table>
                </div>
            )}

            <div className="overflow-auto">
                {pageRows.length === 0 ? (
                    <div className="p-6 text-center text-zinc-500">{emptyState ?? 'Sin datos'}</div>
                ) : (
                    <table className="min-w-full">
                        <tbody>
                        {pageRows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-zinc-100">
                                {visibleColumns.map((column, columnIndex) => (
                                    <td
                                        key={`${String(column.id)}_${columnIndex}`}
                                        className={`px-3 ${cellPaddingY} text-sm`}
                                        style={{width: column.width, textAlign: column.align ?? 'left'}}
                                    >
                                        {column.role === 'actions'
                                            ? (renderActions ? renderActions(row) : null)
                                            : (() => {
                                                const val = getCellValue(column as ColumnDef, row);
                                                return column.cell ? (column.cell as (v: unknown, r: Row) => ReactNode)(val, row) : (val as ReactNode);
                                            })()}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Paginación SIEMPRE montada; oculta si <= 5 filas */}
            <div className={hidePaginator ? 'hidden' : 'block border-t border-zinc-200'}>
                <Pagination
                    page={page}
                    pageSize={pageSize}
                    total={totalItems}
                    onPageChange={onPageChange ?? (() => {
                    })}
                    onPageSizeChange={onPageSizeChange}
                    isCompact={effectiveDensity === 'compact'}
                />
            </div>
        </div>
    );
}

export default DataTable;
