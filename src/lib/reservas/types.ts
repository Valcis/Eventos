import {BaseEntity} from "../globalTypes";

export interface Reserva extends BaseEntity {
    eventoId: string;
    cliente: string;
    parrilladas: number;
    picarones: number;
    metodoPagoId: string;
    receptorId: string;
    tipoConsumoId: string;
    comercialId: string;
    totalPedido: number;
    pagado: boolean;
    comprobado: boolean;
    locked: boolean;
    puntoRecogidaId?: string;
}
