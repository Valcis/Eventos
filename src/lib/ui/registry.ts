import {ColumnMeta} from "./contracts";

export type Entity = "gastos" | "reservas" | "precios"; // añade las que tengas

type MetaResolver = () => ReadonlyArray<ColumnMeta>;

const resolvers: Record<Entity, MetaResolver> = {
    gastos: () => {
        // IMPORTA de tus esquemas REALES de gastos (sin alias).
        // Ejemplo de cómo sería, sustituye la ruta por la tuya:
        // import { gastosColumns } from "../../lib/gastos/schemaColumns";
        // return gastosColumns;

        // Placeholder seguro: deja un array vacío para no romper compilación
        return [];
    },
    reservas: () => {
        return [];
    },
    precios: () => {
        return [];
    },
};

export function getSchemaColumns(entity: Entity): ReadonlyArray<ColumnMeta> {
    return resolvers[entity]();
}
