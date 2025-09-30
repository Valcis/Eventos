import {z} from "zod";
import {GastoUpsertSchema} from "./schema.zod";
import {ColumnMeta} from "../ui/contracts";
import {zodObjectToColumnMeta} from "../ui/zod-to-columns";

const gastoObject = ((): z.ZodObject<z.ZodRawShape> => {
    const inner = GastoUpsertSchema;
    if (!(inner instanceof z.ZodObject)) {
        throw new Error("[gastos] El esquema no es un ZodObject");
    }
    return inner;
})();

// Forzamos createdAt/updatedAt como 'date' si no usas .datetime()
const forceDateIds = ["createdAt", "updatedAt"] as const;

// Excluye campos que no quieres en la UI por defecto (opcional)
const excludeIds: ReadonlyArray<string> = [];

export const gastosColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(gastoObject, {
    forceDateIds: [...forceDateIds],
    excludeIds,
});

// Comprobación dev: ids duplicados (no debería ocurrir)
if (process.env.NODE_ENV !== "production") {
    const seen = new Set<string>();
    for (const c of gastosColumns) {
        if (seen.has(c.column)) {
            console.error(`[gastos] ID de columna duplicado: ${c.column}`);
        }
        seen.add(c.column);
    }
}
