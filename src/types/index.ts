export type ID = string
export interface BaseEntity { id: ID; createdAt: string; updatedAt: string; isActive: boolean }
export interface Evento extends BaseEntity { nombre: string; fecha: string; ubicacionId?: ID; presupuesto: number }
export interface Asistente extends BaseEntity { nombre: string; email: string; telefono?: string; eventoId?: ID; checkedIn?: boolean }
export interface Ubicacion extends BaseEntity { nombre: string; direccion: string; capacidad: number }
export interface Proveedor extends BaseEntity { nombre: string; categoria: string; contacto?: string }
export interface Entrada extends BaseEntity { eventoId: ID; tipo: string; precio: number; disponibles: number }
export interface Gasto extends BaseEntity { eventoId: ID; categoria: string; monto: number; notas?: string }
export interface Precio extends BaseEntity { eventoId: ID; concepto: string; importe: number }