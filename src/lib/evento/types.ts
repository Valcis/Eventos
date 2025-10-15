import { BaseEntity } from '../globalTypes';

export interface Evento extends BaseEntity {
    nombre: string;          // req, ≤100
    fecha: string;           // req (ISO-like string)
    direccion?: string;      // ≤150
    presupuesto?: number;
    aforoMaximo?: number;
}
