export type ID = string;
export type ISODateTime = string;

export interface BaseEntity {
    id: ID;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
    isActive: boolean;
}

export type TipoPrecio = 'bruto' | 'neto';

export interface Gasto extends BaseEntity {
    eventoId: ID;
    producto: string;
    unidad: string;
    cantidad: number;
    tipoPrecio: TipoPrecio;
    tipoIVA: number;   // 0 | 4 | 10 | 21 | ...
    base: number;      // sin IVA
    iva: number;       // importe IVA
    total: number;     // con IVA
    isPack: boolean;
    unidadesPack?: number;
    precioUnidad?: number;
    pagador?: string;
    tienda?: string;
    notas?: string;
    comprobado: boolean;
    locked: boolean;
}

export interface GastoFilters {
    q?: string;
    tienda?: string;
    pagador?: string;
    comprobado?: boolean;
    locked?: boolean;
}
