import {z} from "zod";
import {PrecioUpsertSchema} from "./schema.zod";
import {ColumnMeta} from "../ui/contracts";
import {zodObjectToColumnMeta} from "../ui/zod-to-columns";

const preciosObject = ((): z.ZodObject<z.ZodRawShape> => {
    const inner = PrecioUpsertSchema;
    if (!(inner instanceof z.ZodObject)) {
        throw new Error("[precios] El esquema no es un ZodObject");
    }
    return inner;
})();

// Forzar ciertos IDs como fecha si son strings ISO sin .datetime()
const forceDateIds: ReadonlyArray<string> = ["createdAt", "updatedAt"];

// Excluir campos técnicos que no quieras en UI (opcional)
const excludeIds: ReadonlyArray<string> = [];

export const preciosColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(preciosObject, {
    forceDateIds,
    excludeIds,
});

if (process.env.NODE_ENV !== "production") {
    const seen = new Set<string>();
    for (const c of preciosColumns) {
        if (seen.has(c.column)) {
            // eslint-disable-next-line no-console
            console.error(`[precios] ID de columna duplicado en schema: ${c.column}`);
        }
        seen.add(c.column);
    }
}
