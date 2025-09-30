import {z} from "zod";
import {ReservaUpsertSchema} from "./schema.zod";
import {ColumnMeta} from "../ui/contracts";
import {zodObjectToColumnMeta} from "../ui/zod-to-columns";

const reservasObject = ((): z.ZodObject<z.ZodRawShape> => {
    const inner = ReservaUpsertSchema;
    if (!(inner instanceof z.ZodObject)) {
        throw new Error("[reservas] El esquema no es un ZodObject");
    }
    return inner;
})();

// Forzar ciertos IDs como fecha si son strings ISO sin .datetime()
const forceDateIds: ReadonlyArray<string> = ["createdAt", "updatedAt"];

// Excluir campos técnicos que no quieras en UI (opcional)
const excludeIds: ReadonlyArray<string> = [];

export const reservasColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(reservasObject, {
    forceDateIds,
    excludeIds,
});

if (process.env.NODE_ENV !== "production") {
    const seen = new Set<string>();
    for (const c of reservasColumns) {
        if (seen.has(c.id)) {
            // eslint-disable-next-line no-console
            console.error(`[reservas] ID de columna duplicado en schema: ${c.id}`);
        }
        seen.add(c.id);
    }
}
