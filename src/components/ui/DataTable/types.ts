import { ReactNode } from 'react';

export type Align = 'left' | 'center' | 'right';
export type Density = 'compact' | 'normal';
export type DensityMode = 'detailed' | 'simple';

export interface SortState {
    columnId: string | null;
    direction: 'asc' | 'desc' | null;
}

type Bivariant<T> = { bivarianceHack: T }['bivarianceHack'];

export interface ColumnDef<Row = unknown, CellValue = unknown> {
    id?: keyof Row | string;
    header: ReactNode;
    accessor?: (row: Row) => CellValue;
    accessorKey?: string;
    cell?: Bivariant<(value: CellValue, row: Row) => ReactNode>;
    isSortable?: boolean;
    sortFn?: (leftRow: Row, rightRow: Row, direction: 'asc' | 'desc') => number;
    width?: number | string;
    align?: Align;

    /** Vista simple: mostrar solo estas + acciones */
    isSimpleKey?: boolean;

    /** Señaliza columna de acciones */
    role?: 'actions';
}

export interface DataTableProps<Row = unknown> {
    rows: Row[];
    columns: ColumnDef<Row, unknown>[];

    /** Header */
    showDensityToggle?: boolean;                    // si true, renderiza botón centro (detailed/simple)
    onCreate?: () => void;                          // botón derecha

    /** Ordenación */
    sort?: SortState;
    onSortChange?: (next: SortState) => void;

    /** Densidad visual de filas */
    density?: Density;
    isDense?: boolean; // compat

    /** Vista de columnas (simple/detallada). Si no se pasa, no se usa. */
    densityMode?: DensityMode;

    /** Filtro global (si lo usas fuera) */
    globalFilterValue?: string;
    onGlobalFilterChange?: (value: string) => void;

    /** Apariencia */
    className?: string;
    emptyState?: ReactNode;

    /** Paginación (si pasas onPageChange, se pagina client-side con rows) */
    page?: number;          // 1-based
    pageSize?: number;
    total?: number;         // si no se pasa, se usa rows.length
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;

    /** Acciones por fila */
    renderActions?: (row: Row) => ReactNode;

    /** Ocultar cabecera de columnas */
    hideHeader?: boolean;
}