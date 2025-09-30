// lib/ui/registry.ts
import {ColumnMeta} from "./contracts";
import {gastosColumns} from "../gastos/schema.columns";
import {reservasColumns} from "../reservas/schema.columns";
import {preciosColumns} from "../precios/schema.columns";

export type Entity = "gastos" | "reservas" | "precios";

const map: Record<Entity, ReadonlyArray<ColumnMeta>> = {
    gastos: gastosColumns,
    reservas: reservasColumns,
    precios: preciosColumns,
};

export function getSchemaColumns(entity: Entity): ReadonlyArray<ColumnMeta> {
    const cols = map[entity];
    if (!cols) throw new Error(`Sin columnas de esquema para entidad: ${entity}`);
    return cols;
}
