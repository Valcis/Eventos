// Tipos base y por selector

export type BaseItem = {
    id: string;
    nombre: string;
    activo: boolean;
    notas?: string;
};

export type Comercial = BaseItem & { telefono?: string };
export type MetodoPago = BaseItem & { requiereReceptor?: boolean }; // Bizum => true
export type Pagador = BaseItem;
export type Tienda = BaseItem & { direccion?: string; horario?: string };
export type Unidad = BaseItem;                                     // kg, und, pack...
export type TipoPrecio = BaseItem;                                 // "con_iva" | "sin_iva"
export type TipoConsumo = BaseItem;                                // "comer_aqui" | "recoger"
export type BenefBizum = BaseItem;                                 // receptor Bizum
export type PuntoRecogida = BaseItem & { direccion?: string; horario?: string; comentarios?: string };

export type SelectorKind =
    | "comerciales" | "metodosPago" | "pagadores" | "tiendas"
    | "unidades" | "tiposPrecio" | "tipoConsumo" | "benefBizum" | "puntosRecogida";
