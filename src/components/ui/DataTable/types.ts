export type Align = 'left' | 'center' | 'right';


export interface SortState {
    columnId: string | null;
    direction: 'asc' | 'desc' | null;
}


export interface ColumnDef<T> {
    id: keyof T | string;
    header: string | JSX.Element;
    /** If provided, used for sorting and default cell value. */
    accessor?: (row: T) => unknown;
    /** Custom cell renderer; receives `value` (from accessor or key) and the whole row. */
    cell?: (value: unknown, row: T) => JSX.Element | string | number | null;
    isSortable?: boolean;
    /** Optional custom comparator when sorting this column. */
    sortFn?: (a: T, b: T, direction: 'asc' | 'desc') => number;
    width?: number | string;
    align?: Align;
}