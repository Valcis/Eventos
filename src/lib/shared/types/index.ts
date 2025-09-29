export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

export interface BaseItem {
    id: string;
    nombre: string;
    isActive: boolean;
    notas?: string;
}
