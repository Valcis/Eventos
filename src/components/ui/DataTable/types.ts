import {ReactNode} from 'react';

export type Align = 'left' | 'center' | 'right';

export interface SortState {
    columnId: string | null;
    direction: 'asc' | 'desc' | null;
}

export interface ColumnDef<T = unknown> {
    id?: keyof T | string;
    header: ReactNode;
    /** Forma nativa */
    accessor?: (row: T) => unknown;
    cell?:
        | ((value: unknown, row: T) => ReactNode) // forma nativa
        | ((ctx: { row: { original: T } }) => ReactNode); // forma tanstack-like
    accessorKey?: string;
    isSortable?: boolean;
    /** comparator opcional cuando la columna es ordenable */
    sortFn?: (a: T, b: T, direction: 'asc' | 'desc') => number;
    width?: number | string;
    align?: Align;
}

export interface DataTableExtraProps {
    /** Filtro global controlado (opcional) */
    globalFilterValue?: string;
    onGlobalFilterChange?: (value: string) => void;
    /** Densidad visual */
    density?: 'compact' | 'normal';
}
