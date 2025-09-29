import {z} from 'zod';

type TableName = string;
const schemas = new Map<TableName, z.ZodObject<any>>();

export function registerSchema(table: TableName, schema: z.ZodObject<any>): void {
    schemas.set(table, schema);
}

export function getSchema(table: TableName): z.ZodObject<any> {
    const s = schemas.get(table);
    if (!s) throw new Error(`Schema no registrado para tabla: ${table}`);
    return s;
}
