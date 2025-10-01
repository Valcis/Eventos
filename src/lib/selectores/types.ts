import {BaseItem} from "../globalTypes";

export interface Comercial extends BaseItem {
    telefono?: string;
}

export interface MetodoPago extends BaseItem {
    requireReceptor: boolean;
}

export interface PuntoRecogida extends BaseItem {
    direccion?: string;
    horario?: string;
    comentarios?: string;
}

export interface TipoConsumo extends BaseItem {}

export interface Receptor extends BaseItem {}

export interface Cobrador extends BaseItem {}

export interface Unidad extends BaseItem {}

export interface Pagador extends BaseItem {}

export interface Tienda extends BaseItem {
    direccion?: string;
    horario?: string;
}
