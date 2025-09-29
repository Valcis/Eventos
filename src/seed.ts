import { seed } from './store/localdb';
import type { Precio, Selector, Ubicacion, Reserva, Evento } from './lib/shared/types';

const now = (d: string) => d;

const eventos: Evento[] = [
  {
    id: 'e1',
    nombre: 'Congreso Tech',
    fecha: '2025-10-20',
    ubicacionId: 'u1',
    presupuesto: 20000,
    createdAt: now('2025-01-05'),
    updatedAt: now('2025-01-05'),
    isActive: true,
  },
];

const ubicaciones: Ubicacion[] = [
  {
    id: 'u1',
    eventoId: 'e1',
    nombre: 'Auditorio Central',
    direccion: 'C/ Mayor 1',
    habilitado: true,
    capacidad: 500,
    locked: false,
    createdAt: now('2025-01-01'),
    updatedAt: now('2025-01-01'),
    isActive: true,
  },
];

const precios: Precio[] = [
  {
    id: 'p1',
    eventoId: 'e1',
    concepto: 'parrilladas',
    importe: 12,
    locked: false,
    createdAt: now('2025-02-01'),
    updatedAt: now('2025-02-01'),
    isActive: true,
  },
  {
    id: 'p2',
    eventoId: 'e1',
    concepto: 'picarones',
    importe: 6,
    locked: false,
    createdAt: now('2025-02-01'),
    updatedAt: now('2025-02-01'),
    isActive: true,
  },
];

const selectores: Selector[] = [
  // tipoConsumo
  {
    id: 's1',
    eventoId: 'e1',
    categoria: 'tipoConsumo',
    valor: 'comer_aqui',
    habilitado: true,
    orden: 0,
    createdAt: now('2025-02-10'),
    updatedAt: now('2025-02-10'),
    isActive: true,
  },
  {
    id: 's2',
    eventoId: 'e1',
    categoria: 'tipoConsumo',
    valor: 'para_llevar',
    habilitado: true,
    orden: 1,
    createdAt: now('2025-02-10'),
    updatedAt: now('2025-02-10'),
    isActive: true,
  },
  {
    id: 's3',
    eventoId: 'e1',
    categoria: 'tipoConsumo',
    valor: 'domicilio',
    habilitado: true,
    orden: 2,
    createdAt: now('2025-02-10'),
    updatedAt: now('2025-02-10'),
    isActive: true,
  },
  // metodoPago
  {
    id: 's4',
    eventoId: 'e1',
    categoria: 'metodoPago',
    valor: 'efectivo',
    habilitado: true,
    orden: 0,
    createdAt: now('2025-02-10'),
    updatedAt: now('2025-02-10'),
    isActive: true,
  },
  {
    id: 's5',
    eventoId: 'e1',
    categoria: 'metodoPago',
    valor: 'tarjeta',
    habilitado: true,
    orden: 1,
    createdAt: now('2025-02-10'),
    updatedAt: now('2025-02-10'),
    isActive: true,
  },
  {
    id: 's6',
    eventoId: 'e1',
    categoria: 'metodoPago',
    valor: 'bizum',
    habilitado: true,
    orden: 2,
    createdAt: now('2025-02-10'),
    updatedAt: now('2025-02-10'),
    isActive: true,
  },
  // receptor
  {
    id: 's7',
    eventoId: 'e1',
    categoria: 'receptor',
    valor: 'mostrador',
    habilitado: true,
    orden: 0,
    createdAt: now('2025-02-10'),
    updatedAt: now('2025-02-10'),
    isActive: true,
  },
];

const reservas: Reserva[] = [
  {
    id: 'r1',
    eventoId: 'e1',
    cliente: 'Juan',
    parrilladas: 2,
    picarones: 1,
    tipoConsumo: 'comer_aqui',
    metodoPago: 'efectivo',
    totalPedido: 0,
    pagado: false,
    comprobado: false,
    locked: false,
    createdAt: now('2025-03-01'),
    updatedAt: now('2025-03-01'),
    isActive: true,
  },
];

seed('eventos', eventos);
seed('ubicaciones', ubicaciones);
seed('precios', precios);
seed('selectores', selectores);
seed('reservas', reservas);
