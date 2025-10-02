import type {BaseEntity, TableName} from "../lib/globalTypes";

/** Claves base que aporta BaseEntity. */
type BaseKeys = keyof BaseEntity;

/** Clave de almacenamiento para cada tabla. */
const storageKey = (name: TableName): string => `app:db:${name}`;

/** Lee el array de la tabla desde localStorage (o [] si no existe/corrupto). */
function readAll<T>(name: TableName): T[] {
    const raw = localStorage.getItem(storageKey(name));
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
        return [];
    }
}

/** Escribe el array completo de la tabla en localStorage. */
function writeAll<T>(name: TableName, items: readonly T[]): void {
    localStorage.setItem(storageKey(name), JSON.stringify(items));
}

/** Generador de ids seguro (usa crypto si existe). */
function genId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    // Fallback simple
    return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Crea un ISO string del instante actual. */
const nowIso = (): string => new Date().toISOString();

/**
 * Lista todos los elementos de una tabla.
 */
export function list<T>(name: TableName): T[] {
    return readAll<T>(name);
}

/**
 * Obtiene un elemento por id (o undefined si no existe).
 */
export function getById<T extends BaseEntity>(name: TableName, id: T["id"]): T | undefined {
    const all = readAll<T>(name);
    return all.find(it => (it as BaseEntity).id === id);
}

/**
 * Crea un elemento nuevo en la tabla, inyectando los campos base.
 * - `data`: T sin los campos base (id/createdAt/updatedAt/isActive)
 * - Devuelve el elemento completo (T).
 */
export function create<T extends BaseEntity>(
    name: TableName,
    data: Omit<T, BaseKeys>
): T {
    const createdAt = nowIso();
    const entity: T = {
        ...data,
        id: genId(),
        createdAt,
        updatedAt: createdAt,
        isActive: true,
    } as T;

    const all = readAll<T>(name);
    writeAll<T>(name, [...all, entity]);
    return entity;
}

/**
 * Actualiza un elemento por id con un patch (solo campos NO base).
 * - Si no existe, no hace nada (o lanza si prefieres).
 */
export function update<T extends BaseEntity>(
    name: TableName,
    id: T["id"],
    patch: Partial<Omit<T, BaseKeys>>
): void {
    const all = readAll<T>(name);
    let changed = false;
    const next = all.map(item => {
        const base = item as BaseEntity;
        if (base.id !== id) return item;
        changed = true;
        const merged = {
            ...item,
            ...(patch as Partial<T>),
            updatedAt: nowIso(),
        } as T;
        return merged;
    });
    if (changed) {
        writeAll<T>(name, next);
    }
}

/**
 * Elimina un elemento por id.
 */
export function remove(name: TableName, id: string): void {
    const all = readAll<BaseEntity>(name);
    const next = all.filter(it => it.id !== id);
    if (next.length !== all.length) {
        writeAll(name, next);
    }
}

/**
 * Reemplaza todos los elementos de la tabla (útil para seeds/tests).
 */
export function replaceAll<T>(name: TableName, items: readonly T[]): void {
    writeAll<T>(name, items);
}
