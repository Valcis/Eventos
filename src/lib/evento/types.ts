import {BaseEntity, ID} from "../shared/types";

export interface Evento extends BaseEntity {
    nombre: string;
    fecha: string;
    ubicacionId?: ID;
    presupuesto: number;
}