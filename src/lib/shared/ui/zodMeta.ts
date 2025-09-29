import {z} from 'zod';

export type FieldKind = 'text' | 'number' | 'checkbox' | 'select' | 'textarea' | 'datetime' | 'hidden';

export interface FieldMeta {
    key: string;
    label: string;
    kind: FieldKind;
    optional: boolean;
    enumValues?: ReadonlyArray<string>;
}

function guessKind(schema: z.ZodTypeAny): FieldKind {
    // NOTA: no usamos estilos ni libs externas
    const def: unknown = (schema as unknown as { _def?: { typeName?: string } })._def;
    if (schema instanceof z.ZodBoolean) return 'checkbox';
    if (schema instanceof z.ZodNumber) return 'number';
    if (schema instanceof z.ZodEnum) return 'select';
    if (schema instanceof z.ZodNativeEnum) return 'select';
    if (schema instanceof z.ZodString) return 'text';
    if ((def as { typeName?: string } | undefined)?.typeName === 'ZodDate') return 'datetime';
    return 'text';
}

function unwrap(schema: z.ZodTypeAny): { base: z.ZodTypeAny; optional: boolean } {
    let s = schema;
    let optional = false;
    while (s instanceof z.ZodOptional || s instanceof z.ZodNullable) {

        s = (s as any)._def.innerType ?? (s as any)._def.schema ?? s;
        optional = true;
    }
    return {base: s, optional};
}

export function getFieldsFromZodObject(schema: z.ZodObject<any>): FieldMeta[] {
    const shape: Record<string, z.ZodTypeAny> = (schema as unknown as { shape: Record<string, z.ZodTypeAny> }).shape;
    const out: FieldMeta[] = [];
    for (const key of Object.keys(shape)) {
        if (['id', 'createdAt', 'updatedAt', 'isActive'].includes(key)) continue; // base fields fuera por defecto
        const {base, optional} = unwrap(shape[key]);
        const kind = guessKind(base);
        const meta: FieldMeta = {key, label: key, kind, optional};
        if (base instanceof z.ZodEnum) meta.enumValues = [...(base as z.ZodEnum<[string, ...string[]]>)._def.values];
        if (base instanceof z.ZodNativeEnum) meta.enumValues = Object
            .values((base as z.ZodNativeEnum<any>)._def.values)
            .filter((v): v is string => typeof v === 'string');
        out.push(meta);
    }
    return out;
}
