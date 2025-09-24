import type { BaseEntity } from '../types'
type TableName = 'eventos'|'asistentes'|'ubicaciones'|'proveedores'|'entradas'|'gastos'|'precios'
const read = <T,>(n: TableName): T[] => JSON.parse(localStorage.getItem(n) ?? '[]')
const write = <T,>(n: TableName, items: T[]) => localStorage.setItem(n, JSON.stringify(items))
export const list = <T extends BaseEntity>(n: TableName): T[] => read<T>(n)
export const create = <T extends BaseEntity>(n: TableName, item: T) => { const a = list<T>(n); a.unshift(item); write(n,a); return item }
export const update = <T extends BaseEntity>(n: TableName, id: string, patch: Partial<T>) => {
  const a = list<any>(n); const i = a.findIndex((x:any)=>x.id===id); if (i>-1) { a[i] = { ...a[i], ...patch, updatedAt: new Date().toISOString() }; write(n,a) }
}
export const remove = (n: TableName, id: string) => write(n, list<any>(n).filter((x:any)=>x.id!==id))
export const seed = (n: TableName, data: any[]) => { if (list<any>(n).length===0) write(n,data) }