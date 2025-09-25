import { z } from 'zod';
import type { MetodoPago, SelectorCategoria, TipoConsumo } from '../../types';

export const eventoSchema = z.object({
  nombre: z.string().min(1),
  fecha: z.string().min(1),
  ubicacionId: z.string().optional(),
  presupuesto: z.coerce.number().nonnegative(),
});

export const reservaSchema = z.object({
  eventoId: z.string().min(1),
  cliente: z.string().min(1),
  parrilladas: z.coerce.number().int().nonnegative(),
  picarones: z.coerce.number().int().nonnegative(),
  tipoConsumo: z.custom<TipoConsumo>((v) => v === 'comer_aqui' || v === 'para_llevar' || v === 'domicilio'),
  puntoRecogidaId: z.string().optional(),
  metodoPago: z.custom<MetodoPago>((v) => v === 'efectivo' || v === 'tarjeta' || v === 'bizum'),
  receptor: z.string().optional(),
  totalPedido: z.coerce.number().nonnegative(),
  pagado: z.coerce.boolean(),
  comprobado: z.coerce.boolean(),
  locked: z.coerce.boolean().default(false),
});

export const ubicacionSchema = z.object({
  eventoId: z.string().min(1),
  nombre: z.string().min(1),
  direccion: z.string().min(1),
  telefono: z.string().optional(),
  horario: z.string().optional(),
  comentarios: z.string().optional(),
  habilitado: z.coerce.boolean().default(true),
  capacidad: z.coerce.number().int().nonnegative().optional(),
});

export const gastoSchema = z.object({
  eventoId: z.string().min(1),
  producto: z.string().min(1),
  unidad: z.string().min(1),
  cantidad: z.coerce.number().positive(),
  tipoPrecio: z.enum(['bruto', 'neto']),
  tipoIVA: z.coerce.number().min(0).max(100),
  base: z.coerce.number().min(0),
  iva: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
  isPack: z.coerce.boolean(),
  unidadesPack: z.coerce.number().int().positive().optional(),
  precioUnidad: z.coerce.number().positive().optional(),
  pagador: z.string().optional(),
  tienda: z.string().optional(),
  notas: z.string().optional(),
  comprobado: z.coerce.boolean().default(false),
  locked: z.coerce.boolean().default(false),
});

export const precioSchema = z.object({
  eventoId: z.string().min(1),
  concepto: z.string().min(1),
  importe: z.coerce.number().nonnegative(),
});

export const selectorSchema = z.object({
  eventoId: z.string().min(1),
  categoria: z.custom<SelectorCategoria>((v) => v === 'tipoConsumo' || v === 'metodoPago' || v === 'receptor' || v === 'puntoRecogida'),
  valor: z.string().min(1),
  habilitado: z.coerce.boolean().default(true),
  orden: z.coerce.number().int().nonnegative(),
});
