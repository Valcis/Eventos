export type ID = string;
export type ISODateTime = string;

export interface BaseEntity {
    id: ID;
    createdAt: ISODateTime;
    updatedAt: ISODateTime;
    isActive: boolean;
}

export interface Precio extends BaseEntity {
    eventoId: ID;
    concepto: string;
    importe: number;   // total (si manejas base+iva, añade campos; aquí mantenemos el usado por la UI)
    locked?: boolean;
}

export interface PrecioFilters {
    q?: string;
    concepto?: string;
    locked?: boolean;
}
