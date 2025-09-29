export type ID = string;

export interface BaseEntity {
  id: ID;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}


export type SelectorCategoria = 'tipoConsumo' | 'metodoPago' | 'receptor' | 'puntoRecogida';

export interface Selector extends BaseEntity {
  eventoId: ID;
  categoria: SelectorCategoria;
  valor: string;
  habilitado: boolean;
  orden: number;
}
