export interface BaseEntity {
    id: string;
    createdAt: string; // ISO
    updatedAt: string; // ISO
    isActive: boolean;
}

export interface BaseItem {
    id: string;
    nombre: string;
    isActive: boolean;
    notas?: string;
}

/** Nombres de tablas soportadas. Ajusta si añades nuevas. */
export const TABLES = [
    "eventos",
    "reservas",
    "gastos",
    "precios",
    "selectores",
] as const;

export type TableName = typeof TABLES[number];

// Tipos atómicos reutilizables por el dominio y la UI
export type ColumnId = string;
export type ColumnList = ReadonlyArray<ColumnId>;

export type FieldKind =
    | "text"
    | "number"
    | "select"
    | "date"
    | "boolean";

export interface SelectOption {
    value: string;
    label: string;
}

export type ValueFormat = "currency" | "percent" | "datetime" | "date" | "time";
export type ValidatorTag = "required" | "positive" | "nonEmpty" | "email" | "url";