import {BaseEntity} from "../globalTypes";

export type TipoPrecio = 'con IVA' | 'sin IVA';

export interface Gasto extends BaseEntity {
    eventoId: string;
    producto: string;
    unidadId: string;
    cantidad: number;
    tipoPrecio: TipoPrecio;
    tipoIVA: number;       // %
    precioBase: number;    // sin IVA
    precioNeto: number;    // con IVA (si aplica)
    isPack: boolean;
    unidadesPack?: number;
    precioUnidad?: number;
    pagadorId?: string;
    tiendaId?: string;
    notas?: string;
    comprobado: boolean;
    locked: boolean;
}
