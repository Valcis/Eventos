export namespace Selectores {
    /** Tipo base para items de selectores (lo que ya tenías: id, nombre, activo, notas). */
    export interface BaseItem {
        id: string;
        nombre: string;
        activo: boolean;
        notas?: string;
    }

    export interface Comercial extends BaseItem {
        telefono?: string;
    }

    export interface MetodoPago extends BaseItem {
        /** Indica si, al elegir este método, debe informarse un receptor. */
        requiereReceptor?: boolean;
    }

    export interface Pagador extends BaseItem {
        telefono?: string;
    }

    export interface Tienda extends BaseItem {
        direccion?: string;
        horario?: string;
    }

    export interface Unidad extends BaseItem {
        abreviatura?: string;
    }

    /** Tipo nominal que usas en el repositorio (p. ej. con_iva/sin_iva por nombre) */
    export interface TipoPrecio extends BaseItem {
    }

    /** Tipo nominal que usas en el repositorio (p. ej. comer_aqui/recoger por nombre) */
    export interface TipoConsumo extends BaseItem {
    }

    export interface ReceptorCobrador extends BaseItem {
        telefono?: string;
    }

    export interface PuntoRecogida extends BaseItem {
        direccion?: string;
        horario?: string;
        telefono?: string;
        capacidad?: number;
        comentarios?: string;
    }

    // Discriminador de tablas (8 principales)
    export type Kind =
        | "comerciales"
        | "metodosPago"
        | "pagadores"
        | "tiendas"
        | "unidades"
        | "tipoConsumo"
        | "receptorCobrador"
        | "puntosRecogida";

    // Mapeo útil para servicios/almacenamiento genérico
    export interface MapByKind {
        comerciales: Comercial;
        metodosPago: MetodoPago;
        pagadores: Pagador;
        tiendas: Tienda;
        unidades: Unidad;
        tipoConsumo: TipoConsumo;
        receptorCobrador: ReceptorCobrador;
        puntosRecogida: PuntoRecogida;
    }

    export type ItemByKind<K extends Kind> = MapByKind[K];
}