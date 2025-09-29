export type ID = string;
export type ISODateTime = string;

export interface BaseEntity {
    id: ID;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
    isActive: boolean;
}

export type MetodoPago = 'efectivo' | 'tarjeta' | 'bizum' | 'transferencia';
export type TipoConsumo = 'local' | 'llevar' | 'delivery';

export interface Reserva extends BaseEntity {
    eventoId: ID;
    cliente: string;
    parrilladas: number;
    picarones: number;
    tipoConsumo: TipoConsumo;
    metodoPago: MetodoPago;
    receptor?: string;
    totalPedido: number;
    pagado: boolean;
    comprobado: boolean;
    locked: boolean;
}

export interface ReservaFilters {
    q?: string;
    metodoPago?: MetodoPago;
    pagado?: boolean;
    comprobado?: boolean;
    locked?: boolean;
}
