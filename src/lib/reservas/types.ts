import {BaseEntity, ID} from "../shared/types";


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