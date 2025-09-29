import {BaseEntity} from "../shared/types";


/**
 * Precio unitario de un producto/servicio.
 * - precioBase: importe sin IVA
 * - tipoIVA: porcentaje entero (0, 4, 10, 21, ...)
 * - precioTotal: importe con IVA (precioBase * (1 + tipoIVA/100))
 */
export interface Precio extends BaseEntity {
    nombre: string;         // Nombre del producto/servicio
    unidad: string;         // p.ej. "ud", "hora", "kg"
    precioBase: number;     // sin IVA
    tipoIVA: number;        // 0 | 4 | 10 | 21 | ...
    precioTotal: number;    // con IVA
    proveedor?: string;
    notas?: string;

    // Packs (opcional)
    isPack: boolean;
    unidadesPack?: number;  // nº unidades que incluye el pack
}

/** Filtros comunes para listados de precios. */
export interface PrecioFilters {
    q?: string;           // texto libre (nombre/proveedor)
    proveedor?: string;
    isActive?: boolean;
    isPack?: boolean;
    tipoIVA?: number;
}
