// strict, sin any, preparado para exactOptionalPropertyTypes
export interface FilterOption {
    readonly value: string;
    readonly label: string;
}

export type FilterKind = 'text' | 'number' | 'select' | 'date' | 'boolean';

export interface FilterField {
    id: string;           // clave en tu dataset/estado
    label: string;        // etiqueta visible
    type: FilterKind;
    // OJO: con exactOptionalPropertyTypes, hay que declarar | undefined explícitamente
    options?: ReadonlyArray<FilterOption> | undefined; // solo para type='select'
}

export type FilterScalar = string | number | boolean | null | undefined | Date;
export type FilterValues = Readonly<Record<string, FilterScalar>>;
