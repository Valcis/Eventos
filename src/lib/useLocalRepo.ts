// src/lib/useLocalRepo.ts
import {useCallback, useMemo, useState} from "react";
import * as db from "../store/localdb";
import type {BaseEntity, TableName} from "./globalTypes";


type BaseKeys = keyof BaseEntity;

export type NewEntity<T extends BaseEntity> = Omit<T, BaseKeys>;
export type UpdatePatch<T extends BaseEntity> = Partial<Omit<T, BaseKeys>>;

export interface UseLocalRepoResult<T extends BaseEntity> {
    readonly items: ReadonlyArray<T>;
    create: (data: NewEntity<T>) => T;
    update: (id: T["id"], patch: UpdatePatch<T>) => void; // <-- ahora void
    remove: (id: T["id"]) => void;
    refresh: () => void;
}

export function useLocalRepo<T extends BaseEntity>(name: TableName): UseLocalRepoResult<T> {
    const [items, setItems] = useState<ReadonlyArray<T>>(() => db.list<T>(name));

    const refresh = useCallback(() => {
        const next = db.list<T>(name);
        setItems(prev => (prev === next ? prev : next));
    }, [name]);

    const create = useCallback((data: NewEntity<T>): T => {
        const created = db.create<T>(name, data);
        refresh();
        return created;
    }, [name, refresh]);

    const update = useCallback((id: T["id"], patch: UpdatePatch<T>): void => {
        db.update<T>(name, id, patch);
        refresh();
    }, [name, refresh]);

    const remove = useCallback((id: T["id"]): void => {
        db.remove(name, id);
        refresh();
    }, [name, refresh]);

    return useMemo(
        () => ({items, create, update, remove, refresh}),
        [items, create, update, remove, refresh]
    );
}

export const useCrud = useLocalRepo;
