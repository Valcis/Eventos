import { useState } from 'react';
import * as db from '../store/localdb';
import {BaseEntity} from "./globalTypes";


export type TableName =
    | 'eventos'
    | 'reservas'
    | 'gastos'
    | 'precios'
    | 'selectores';

export type WithoutBase<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

export function useLocalRepo<T extends BaseEntity>(name: TableName) {
    const [items, setItems] = useState<T[]>(() => db.list<T>(name));
    const refresh = () => setItems(db.list<T>(name));

    const create = (data: WithoutBase<T>): T => {
        const entity = db.create<T>(name, data); // db.create añade id/timestamps
        refresh();
        return entity;
    };

    const update = (id: string, patch: Partial<T>) => {
        db.update<T>(name, id, patch);
        refresh();
    };

    const remove = (id: string) => {
        db.remove(name, id);
        refresh();
    };

    return { items, create, update, remove, refresh };
}

// Export de nombre antiguo para transición rápida (opcional):
export const useCrud = useLocalRepo;