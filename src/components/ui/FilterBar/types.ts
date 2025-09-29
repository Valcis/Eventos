export type Primitive = string | number | boolean | null | undefined | Date;

export type FilterOperator =
    | 'contains' | 'equals' | 'startsWith' | 'endsWith'
    | 'gt' | 'gte' | 'lt' | 'lte' | 'in';

export type FilterFieldType = 'text' | 'number' | 'select' | 'date' | 'boolean';

export interface SelectOption {
    label: string;
    value: string;
}

export interface FilterField<T = unknown> {
    /** Key de la columna o campo semántico del recurso */
    id: keyof T | string;
    label: string;
    type: FilterFieldType;
    /** Predicado custom (opcional) si filtras client-side */
    predicate?: (row: T, value: Primitive) => boolean;
    /** Para selects */
    options?: SelectOption[];
    /** Valor por defecto visual */
    defaultValue?: Primitive;
}

export type FilterValues = Record<string, Primitive>;
