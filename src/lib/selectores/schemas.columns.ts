import { z } from "zod";
import { ColumnMeta } from "../ui/contracts";
import { zodObjectToColumnMeta } from "../ui/zod-to-columns";

import {
    ComercialSchema,
    MetodoPagoSchema,
    PuntoRecogidaSchema,
    TipoConsumoSchema,
    ReceptorSchema,
    CobradorSchema,
    UnidadSchema,
    PagadorSchema,
    TiendaSchema,
} from "./schemas.zod";

function asObject(schema: z.ZodTypeAny, who: string): z.ZodObject<any> {
    if (!(schema instanceof z.ZodObject)) {
        throw new Error(`[selectores] El esquema de ${who} no es un ZodObject`);
    }
    return schema;
}

// Puedes ajustar estos arrays si necesitas forzar fechas o excluir campos técnicos:
const forceDateIds: ReadonlyArray<string> = [];
const excludeIds: ReadonlyArray<string> = [];

// ── Exports uno por mini-tabla (igual que hacéis en reservas/gastos/precios):
export const comercialColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(
    asObject(ComercialSchema, "comercial"),
    { forceDateIds, excludeIds }
);

export const metodoPagoColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(
    asObject(MetodoPagoSchema, "metodoPago"),
    { forceDateIds, excludeIds }
);

export const puntoRecogidaColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(
    asObject(PuntoRecogidaSchema, "puntoRecogida"),
    { forceDateIds, excludeIds }
);

export const tipoConsumoColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(
    asObject(TipoConsumoSchema, "tipoConsumo"),
    { forceDateIds, excludeIds }
);

export const receptorColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(
    asObject(ReceptorSchema, "receptor"),
    { forceDateIds, excludeIds }
);

export const cobradorColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(
    asObject(CobradorSchema, "cobrador"),
    { forceDateIds, excludeIds }
);

export const unidadColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(
    asObject(UnidadSchema, "unidad"),
    { forceDateIds, excludeIds }
);

export const pagadorColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(
    asObject(PagadorSchema, "pagador"),
    { forceDateIds, excludeIds }
);

export const tiendaColumns: ReadonlyArray<ColumnMeta> = zodObjectToColumnMeta(
    asObject(TiendaSchema, "tienda"),
    { forceDateIds, excludeIds }
);
