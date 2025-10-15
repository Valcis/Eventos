// lib/ui/zod-to-columns.ts
import { z } from "zod";
import { ColumnMeta, FieldKind } from "./contracts";

type ZodUnknownObject = z.ZodTypeAny;

function unwrap(inner: ZodUnknownObject): ZodUnknownObject {
    // Desenvuelve opcionales, defaults, efectos, readonly, pipelines, branded, catch...
    // hasta llegar al tipo base.
    // El orden importa: effects/coerce suelen envolver al resto.
    // NOTA: z.ZodReadonly existe desde zod 3.23+, si no la usas elimina ese bloque.
    const typeName: string = inner._def?.typeName ?? "";

    if (typeName === z.ZodFirstPartyTypeKind.ZodOptional) return unwrap((inner as z.ZodOptional<ZodUnknownObject>)._def.innerType);
    if (typeName === z.ZodFirstPartyTypeKind.ZodNullable) return unwrap((inner as z.ZodNullable<ZodUnknownObject>)._def.innerType);
    if (typeName === z.ZodFirstPartyTypeKind.ZodDefault)  return unwrap((inner as z.ZodDefault<ZodUnknownObject>)._def.innerType);
    if (typeName === z.ZodFirstPartyTypeKind.ZodEffects)  return unwrap((inner as z.ZodEffects<ZodUnknownObject>)._def.schema);
    if (typeName === z.ZodFirstPartyTypeKind.ZodReadonly) return unwrap((inner as unknown as { _def: { innerType: ZodUnknownObject } })._def.innerType);
    if (typeName === z.ZodFirstPartyTypeKind.ZodCatch)    return unwrap((inner as unknown as { _def: { innerType: ZodUnknownObject } })._def.innerType);
    if (typeName === z.ZodFirstPartyTypeKind.ZodPipeline) return unwrap((inner as unknown as { _def: { out: ZodUnknownObject } })._def.out);
    if (typeName === z.ZodFirstPartyTypeKind.ZodBranded)  return unwrap((inner as unknown as { _def: { type: ZodUnknownObject } })._def.type);

    return inner;
}

function kindFromZod(base: ZodUnknownObject, forceDate: boolean): FieldKind {
    if (base instanceof z.ZodBoolean) return "boolean";
    if (base instanceof z.ZodNumber)  return "number";
    if (base instanceof z.ZodEnum)    return "select";
    if (base instanceof z.ZodString) {
        // Detecta string datetime oficial
        const def = (base as z.ZodString)._def;
        const hasDatetime = def.checks?.some((c) => (c as unknown as { kind?: string }).kind === "datetime") ?? false;
        return (hasDatetime || forceDate) ? "date" : "text";
    }
    // Fallback seguro
    return forceDate ? "date" : "text";
}

function enumOptions(base: ZodUnknownObject): ReadonlyArray<{ value: string; label: string }> | undefined {
    if (base instanceof z.ZodEnum) {
        const opts = base._def.values as ReadonlyArray<string>;
        return opts.map((v) => ({ value: v, label: v }));
    }
    return undefined;
}

export interface ZodToColumnsOptions {
    /**
     * IDs que deben tratarse como fechas aunque el esquema no tenga .datetime()
     * (p. ej. createdAt/updatedAt como strings ISO).
     */
    forceDateIds?: ReadonlyArray<string>;
    /**
     * IDs a excluir de salida (técnicos, internos, etc.).
     */
    excludeIds?: ReadonlyArray<string>;
}

/**
 * Convierte un z.object(...) en ColumnMeta[] (id, kind, options).
 * No añade labels; eso vive en los presets.
 */
export function zodObjectToColumnMeta(
    schemaObject: z.ZodObject<z.ZodRawShape>,
    options?: ZodToColumnsOptions
): ReadonlyArray<ColumnMeta> {
    const raw = schemaObject.shape;
    const forceDate = new Set(options?.forceDateIds ?? []);
    const exclude = new Set(options?.excludeIds ?? []);

    const out: ColumnMeta[] = [];

    for (const key of Object.keys(raw)) {
        if (exclude.has(key)) continue;

        const inner = raw[key] as z.ZodTypeAny;
        const base = unwrap(inner);

        const isForcedDate = forceDate.has(key);
        const typeKind = kindFromZod(base, isForcedDate);
        const opts = enumOptions(base);

        const meta: ColumnMeta = {
            column: key,
            kind: typeKind,
            ...(opts && opts.length > 0 ? { options: opts } : {}),
        };

        out.push(meta);
    }

    return out;
}
