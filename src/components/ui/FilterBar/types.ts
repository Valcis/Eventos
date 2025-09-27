export type Primitive = string | number | boolean | null | undefined | Date;


/**
 * Operators supported by the generic FilterBar.
 */
export type FilterOperator =
    | 'contains'
    | 'equals'
    | 'startsWith'
    | 'endsWith'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in';


export type FilterFieldType = 'text' | 'number' | 'select' | 'date' | 'boolean';


export interface SelectOption {
    label: string;
    value: string;
}


export interface FilterField<T> {
    /** Column id or key in the row. */
    id: keyof T | string;
    label: string;
    type: FilterFieldType;
    /** Custom predicate overrides default behavior for type+operator. */
    predicate?: (row: T, value: Primitive) => boolean;
    /** For select fields. */
    options?: SelectOption[];
    /** Default value shown when mounting. */
    defaultValue?: Primitive;
}


export type FilterValues = Record<string, Primitive>;