import {z} from 'zod';
import {getFieldsFromZodObject, FieldMeta} from '../zodMeta';
import {SearchPreset} from '../presets/types';

/** Ajusta si tu FilterBar usa otra firma */
export interface FilterField {
    key: string;
    label: string;
    kind: 'text' | 'number' | 'checkbox' | 'select' | 'datetime';
    options?: ReadonlyArray<{ value: string; label: string }>;
}

export function buildFilterFields(
    schema: z.ZodObject<any>,
    preset?: SearchPreset
): FilterField[] {
    let metas: FieldMeta[] = getFieldsFromZodObject(schema).filter(f => f.kind !== 'hidden');

    // por defecto: TODOS los campos del schema; si hay preset, reducimos
    if (preset?.fields && preset.fields.length > 0) {
        const allow = new Set(preset.fields);
        metas = metas.filter(m => allow.has(m.key));
    }

    return metas.map(m => ({
        key: m.key,
        label: m.label,
        kind: (m.kind === 'textarea' ? 'text' : m.kind),
        options: m.enumValues?.map(v => ({value: v, label: v})),
    }));
}
