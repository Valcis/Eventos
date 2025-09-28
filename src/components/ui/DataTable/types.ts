import {ReactNode} from 'react';

export type Align = 'left' | 'center' | 'right';

export interface SortState {
    columnId: string | null;
    direction: 'asc' | 'desc' | null;
}

/** Util para callbacks bivariantes (como hacen los handlers de React) */
type BivariantCallback<T extends (...args: any[]) => any> = {
    bivarianceHack: T;
}['bivarianceHack'];

/**
 * Definición de columna genérica:
 * - Row: tipo de fila
 * - CellValue: tipo de valor que devuelve el accessor de esta columna
 */
export interface ColumnDef<Row, CellValue = unknown> {
    /** Identificador único de columna (se recomienda string estable) */
    id?: keyof Row | string;

    /** Cabecera (texto o nodo) */
    header: ReactNode;

    /**
     * Función para obtener el valor de celda desde la fila.
     * Si se define, el tipo de `CellValue` será el de la celda y se propagará a `cell`.
     */
    accessor?: (row: Row) => CellValue;

    /**
     * Clave de acceso directa (opcional, útil cuando Row es un objeto plano).
     * Si se usa, `CellValue` se infiere como `unknown` en esta interfaz y
     * deberá especificarse en la página si se quiere tipado fuerte.
     */


    accessorKey?: string;

    /**
     * Bivariante: permite que `cell` acepte un subtipo/supertipo sin romper asignabilidad
     * Render de la celda con tipos fuertes:
     * - `value` es del tipo `CellValue` que devuelve `accessor`.
     * - `row` es la fila completa (tipo `Row`).
     */

    cell?: BivariantCallback<(value: CellValue, row: Row) => ReactNode>;


    /** Ordenable en UI (client-side) */
    isSortable?: boolean;

    /**
     * Comparador opcional específico de la columna.
     * Si no se proporciona, se usa un comparador genérico por tipo.
     */
    sortFn?: (leftRow: Row, rightRow: Row, direction: 'asc' | 'desc') => number;

    /** Presentación */
    width?: number | string;
    align?: Align;
}

export interface DataTableProps<Row> {
    rows: Row[];
    columns: Array<ColumnDef<Row, unknown>>;
    sort?: SortState;
    onSortChange?: (next: SortState) => void;
    emptyState?: ReactNode;
    className?: string;
    hideHeader?: boolean;
    /** Compat: placeholder del filtro si se renderiza fuera */
    globalFilterPlaceholder?: string;
    /** Filtro global controlado (opcional) */
    globalFilterValue?: string;
    onGlobalFilterChange?: (value: string) => void;
    /** Densidad visual */
    density?: 'compact' | 'normal';
}
