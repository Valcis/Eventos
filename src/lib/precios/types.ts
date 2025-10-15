import {BaseEntity} from "../globalTypes";

export interface Precio extends BaseEntity {
    eventoId: string;
    concepto: string;
    importe: number;
    moneda: string;     // p.ej. 'EUR'
    locked?: boolean;
}
