import {ColumnMeta} from "./contracts";
import {gastosColumns} from "../gastos/schema.columns";
import {reservasColumns} from "../reservas/schema.columns";
import {preciosColumns} from "../precios/schema.columns";
import {
    comercialColumns,
    metodoPagoColumns,
    pagadorColumns,
    tiendaColumns,
    unidadColumns,
    tipoConsumoColumns,
    receptorColumns,
    puntoRecogidaColumns,
} from "../selectores/schemas.colums";

export type Entity =
    | "gastos"
    | "reservas"
    | "precios"
    | "comerciales"
    | "metodosPago"
    | "pagadores"
    | "tiendas"
    | "unidades"
    | "tipoConsumo"
    | "receptorCobrador"
    | "puntosRecogida";

const map: Record<Entity, ReadonlyArray<ColumnMeta>> = {
    gastos: gastosColumns,
    reservas: reservasColumns,
    precios: preciosColumns,
    comerciales: comercialColumns,
    metodosPago: metodoPagoColumns,
    pagadores: pagadorColumns,
    tiendas: tiendaColumns,
    unidades: unidadColumns,
    tipoConsumo: tipoConsumoColumns,
    // receptorCobrador usa el mismo shape base que receptor/cobrador
    receptorCobrador: receptorColumns,
    puntosRecogida: puntoRecogidaColumns,

};

export function getSchemaColumns(entity: Entity): ReadonlyArray<ColumnMeta> {
    const columns = map[entity];
    if (!columns) {
        throw new Error(
            `Registry error: no hay columnas registradas para la entidad "${entity}".`
        );
    }
    for (const [index, c] of columns.entries()) {
        if (!c.column || c.column.trim().length === 0) {
            throw new Error(
                `Registry error: columna sin "column" en ${entity}.schema.columns[${index}].`
            );
        }
    }
    return columns;
}

export function listEntities(): ReadonlyArray<Entity> {
    return Object.keys(map) as Entity[];
}