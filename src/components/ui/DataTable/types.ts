import { ReactNode } from 'react';

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
  /** Optional custom comparator when sorting this column. */
  sortFn?: (a: T, b: T, direction: 'asc' | 'desc') => number;
  width?: number | string;
  align?: Align;
}
