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
    const columns = map[entity];
    if (!columns) {
        throw new Error(`Registry error: no hay columnas registradas para la entidad "${entity}".`);
    }
    // Validación mínima: cada columna debe tener nombre
    for (const [index, c] of columns.entries()) {
        if (!c.column || c.column.trim().length === 0) {
            throw new Error(`Registry error: columna sin "column" en ${entity}.schema.columns[${index}].`);
        }
    }
    return columns;
}

export function listEntities(): ReadonlyArray<Entity> {
    return Object.keys(map) as Entity[];
}