import { useState } from 'react';
import { z } from 'zod';
import * as db from '../store/localdb';
import type { BaseEntity } from '../types';

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

  return { items, create, update, remove, refresh };
}

export const schemas = {
  evento: z.object({
    nombre: z.string().trim().min(1).max(120),
    fecha: z.string().trim().min(1),
    ubicacionId: z
      .string()
      .trim()
      .min(1)
      .optional()
      .transform((v) => (v === '' ? undefined : v)),
    presupuesto: z.coerce.number().nonnegative(),
  }),
  asistente: z.object({
    nombre: z.string().trim().min(1).max(60),
    email: z
      .string()
      .trim()
      .email()
      .optional()
      .transform((v) => (v === '' ? undefined : v)),
    telefono: z
      .string()
      .trim()
      .max(30)
      .optional()
      .transform((v) => (v === '' ? undefined : v)),
    eventoId: z.string().trim().min(1).optional(),
    // flags are handled elsewhere; keep schema minimal and normalized
  }),
  ubicacion: z.object({
    nombre: z.string().trim().min(1).max(120),
    direccion: z.string().trim().min(1).max(200),
    capacidad: z.coerce.number().int().nonnegative(),
  }),
  proveedor: z.object({
    nombre: z.string().trim().min(1).max(120),
    categoria: z.string().trim().min(1).max(80),
    contacto: z
      .string()
      .trim()
      .max(120)
      .optional()
      .transform((v) => (v === '' ? undefined : v)),
  }),
  entrada: z.object({
    eventoId: z.string().min(1),
    tipo: z.string().trim().min(1).max(60),
    precio: z.coerce.number().nonnegative(),
    disponibles: z.coerce.number().int().nonnegative(),
  }),
  gasto: z.object({
    eventoId: z.string().min(1),
    categoria: z.string().trim().min(1).max(60),
    monto: z.coerce.number().nonnegative(),
    notas: z
      .string()
      .trim()
      .max(500)
      .optional()
      .transform((v) => (v === '' ? undefined : v)),
  }),
  precio: z.object({
    eventoId: z.string().min(1),
    concepto: z.string().trim().min(1).max(120),
    importe: z.coerce.number().nonnegative(),
  }),
};
