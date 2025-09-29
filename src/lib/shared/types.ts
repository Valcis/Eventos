export type ID = string;

export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Evento extends BaseEntity {
  nombre: string;
  fecha: string;
  ubicacionId?: ID;
  presupuesto: number;
}

export type TipoConsumo = 'comer_aqui' | 'para_llevar' | 'domicilio';
export type MetodoPago = 'efectivo' | 'tarjeta' | 'bizum';

export interface Reserva extends BaseEntity {
  eventoId: ID;
  cliente: string;
  parrilladas: number;
  picarones: number;
  tipoConsumo: TipoConsumo;
  puntoRecogidaId?: ID;
  metodoPago: MetodoPago;
  receptor?: string;
  totalPedido: number;
  pagado: boolean;
  comprobado: boolean;
  locked: boolean;
}

export interface Ubicacion extends BaseEntity {
  eventoId: ID;
  nombre: string;
  direccion: string;
  telefono?: string;
  horario?: string;
  comentarios?: string;
  habilitado: boolean;
  capacidad?: number;
  locked: boolean;
}

export interface Gasto extends BaseEntity {
  eventoId: ID;
  producto: string;
  unidad: string;
  cantidad: number;
  tipoPrecio: 'bruto' | 'neto';
  tipoIVA: number;
  base: number;
  iva: number;
  total: number;
  isPack: boolean;
  unidadesPack?: number;
  precioUnidad?: number;
  pagador?: string;
  tienda?: string;
  notas?: string;
  comprobado: boolean;
  locked: boolean;
}

export interface Proveedor extends BaseEntity {
  nombre: string;
  categoria: string;
  contacto?: string;
}

export interface Precio extends BaseEntity {
  eventoId: ID;
  concepto: 'parrilladas' | 'picarones' | string;
  importe: number;
  locked?: boolean;
}

export type SelectorCategoria = 'tipoConsumo' | 'metodoPago' | 'receptor' | 'puntoRecogida';

export interface Selector extends BaseEntity {
  eventoId: ID;
  categoria: SelectorCategoria;
  valor: string;
  habilitado: boolean;
  orden: number;
}
