export interface BaseEntity {
    id: string;
    createdAt: string; // ISO
    updatedAt: string; // ISO
    isActive: boolean;
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
