import {BaseEntity, ID} from "../shared/types";

/**
 * Gasto: copiado de `src/lib/shared/types.ts` (branch `junie`).
 */
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


// (Opcional) filtros de uso común para listados de gastos
export interface GastoFilters {
    q?: string; // texto libre (producto/tienda/pagador)
    tienda?: string;
    pagador?: string;
    comprobado?: boolean;
    locked?: boolean;
}