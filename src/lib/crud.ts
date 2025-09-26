import {useState} from 'react'
import {z} from 'zod'
import * as db from '../store/localdb'
import type {BaseEntity} from '../types'

type TableName =
    | 'eventos'
    | 'reservas'
    | 'ubicaciones'
    | 'gastos'
    | 'proveedores'
    | 'precios'
    | 'selectores';

type WithoutBase<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

export function useCrud<T extends BaseEntity>(name: TableName) {
    const [items, setItems] = useState<T[]>(() => db.list<T>(name));
    const refresh = () => setItems(db.list<T>(name));

    const create = (data: WithoutBase<T>): T => {
        const entity = db.create<T>(name, data); // db.create añade id/timestamps
        refresh();
        return entity;
    };

    const update = (id: string, patch: Partial<T>) => {
        db.update<T>(name, id, patch);
        refresh();
    };

    const remove = (id: string) => {
        db.remove(name, id);
        refresh();
    };

    return {items, create, update, remove, refresh};
}

export const schemas = {
    evento: z.object({
        nombre: z.string().min(1),
        fecha: z.string().min(1),
        ubicacionId: z.string().optional(),
        presupuesto: z.coerce.number().nonnegative()
    }),
    asistente: z.object({
        nombre: z.string().min(1),
        email: z.string().email(),
        telefono: z.string().optional(),
        eventoId: z.string().optional(),
        checkedIn: z.coerce.boolean().optional()
    }),
    ubicacion: z.object({
        nombre: z.string().min(1),
        direccion: z.string().min(1),
        capacidad: z.coerce.number().int().nonnegative()
    }),
    proveedor: z.object({nombre: z.string().min(1), categoria: z.string().min(1), contacto: z.string().optional()}),
    entrada: z.object({
        eventoId: z.string().min(1),
        tipo: z.string().min(1),
        precio: z.coerce.number().nonnegative(),
        disponibles: z.coerce.number().int().nonnegative()
    }),
    gasto: z.object({
        eventoId: z.string().min(1),
        categoria: z.string().min(1),
        monto: z.coerce.number().nonnegative(),
        notas: z.string().optional()
    }),
    precio: z.object({
        eventoId: z.string().min(1),
        concepto: z.string().min(1),
        importe: z.coerce.number().nonnegative()
    }),
}