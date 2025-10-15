// src/components/ui/DataTable/types.ts
import {ReactNode} from 'react';

export type Align = 'left' | 'center' | 'right';
export type Density = 'compact' | 'normal';
export type DensityMode = 'detailed' | 'simple';
export type CellValue = string | number | boolean | null | undefined | Date | ReactNode;

export interface SortState {
    columnId: string | null;
    direction: 'asc' | 'desc' | null;
}

// Bivarianza segura sin any
export type BivariantCallback<T> = { bivarianceHack: T }['bivarianceHack'];

export interface ColumnDef<Row extends Record<string, unknown> = Record<string, unknown>> {
    id?: keyof Row | string;
    header: ReactNode;
    accessor?: (row: Row) => CellValue;
    accessorKey?: string;
    cell?: BivariantCallback<(value: CellValue, row: Row) => ReactNode>;
    isSortable?: boolean;
    sortFn?: (leftRow: Row, rightRow: Row, direction: 'asc' | 'desc') => number;
    width?: number | string;
    align?: Align;

    /** Vista simple: mostrar solo estas + acciones */
    isSimpleKey?: boolean;

    /** Señaliza columna de acciones */
    role?: 'actions';
}

export interface DataTableProps<Row extends Record<string, unknown> = Record<string, unknown>> {
    rows: ReadonlyArray<Row>;
    columns: ReadonlyArray<ColumnDef<Row>>;

    /** Header */
    showDensityToggle?: boolean;
    onCreate?: () => void;

    /** Ordenación */
    sort?: SortState;
    onSortChange?: (next: SortState) => void;

    /** Densidad visual de filas */
    density?: Density;
    /** Compat: si llega, se traduce a Density */
    isDense?: boolean;

    /** Vista de columnas (simple/detallada). Si no se pasa, no se usa */
    densityMode?: DensityMode;

    /** Filtro global (si lo usas fuera) */
    globalFilterValue?: string;
    onGlobalFilterChange?: (value: string) => void;

    /** Apariencia */
    className?: string;
    emptyState?: ReactNode;

    /** Paginación (client-side por defecto) */
    page?: number; // 1-based
    pageSize?: number;
    total?: number; // si no se pasa, se usa rows.length
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (size: number) => void;

    /** Acciones por fila */
    renderActions?: (row: Row) => ReactNode;

    /** Ocultar cabecera de columnas */
    hideHeader?: boolean;
}
