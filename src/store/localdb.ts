import type {BaseEntity} from '../types';

type TableName =
    | 'eventos'
    | 'reservas'
    | 'ubicaciones'
    | 'gastos'
    | 'proveedores'
    | 'precios'
    | 'selectores';

const read = <T, >(n: TableName): T[] => JSON.parse(localStorage.getItem(n) ?? '[]');
const write = <T, >(n: TableName, items: T[]) => localStorage.setItem(n, JSON.stringify(items));

export const list = <T extends BaseEntity>(n: TableName): T[] => read<T>(n);

type WithoutBase<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

export const create = <T extends BaseEntity>(n: TableName, item: WithoutBase<T>): T => {
    const now = new Date().toISOString();
    const id = (crypto as any)?.randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2);
    const full = {...(item as object), id, createdAt: now, updatedAt: now, isActive: true} as T;
    const a = list<T>(n);
    a.unshift(full);
    write(n, a);
    return full;
};

export const update = <T extends BaseEntity>(n: TableName, id: string, patch: Partial<T>) => {
    const a = list<T>(n);
    const i = a.findIndex((x) => x.id === id);
    if (i > -1) {
        a[i] = {...a[i], ...patch, updatedAt: new Date().toISOString()} as T;
        write(n, a);
    }
};

export const remove = (n: TableName, id: string) => write(n, list<BaseEntity>(n).filter((x) => x.id !== id));

export const seed = (n: TableName, data: BaseEntity[]) => {
    if (list<BaseEntity>(n).length === 0) write(n, data);
};