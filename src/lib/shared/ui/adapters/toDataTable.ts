import {z} from 'zod';
import {getFieldsFromZodObject} from "../zodMeta";
import {TablePreset} from '../presets/types';


/** Ajusta si tu DataTable usa otra firma */
export interface DataTableColumn<T = Record<string, unknown>> {
    key: string;
    header: string;
    accessor: (row: T) => unknown;
}

export function buildDataTableColumns<T extends Record<string, unknown>>(
    schema: z.ZodObject<any>,
    preset?: TablePreset
): DataTableColumn<T>[] {
    const fields = getFieldsFromZodObject(schema);
    let keys = fields.map(f => f.key); // por defecto: todas las columnas del schema

    if (preset?.columns && preset.columns.length > 0) keys = preset.columns.slice();
    if (preset?.hidden && preset.hidden.length > 0) {
        const hide = new Set(preset.hidden);
        keys = keys.filter(k => !hide.has(k));
    }

    const labelByKey = new Map(fields.map(f => [f.key, f.label]));
    return keys.map(k => ({
        key: k,
        header: labelByKey.get(k) ?? k,
        accessor: (row: T) => row[k],
    }));
}
