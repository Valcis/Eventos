import type {BaseEntity, BaseItem} from '../lib/shared/types';
import type {
  SelectorKind,
  MetodoPago,
  Pagador,
  Tienda,
  Unidad,
  TipoConsumo,
  ReceptorCobrador,
  PuntoRecogida,
} from '../lib/selectores/types';

type TableName =
  | 'eventos'
  | 'reservas'
  | 'gastos'
  | 'precios'
  | 'selectores';

const read = <T>(n: TableName): T[] => JSON.parse(localStorage.getItem(n) ?? '[]');
const write = <T>(n: TableName, items: T[]) => localStorage.setItem(n, JSON.stringify(items));

export const list = <T extends BaseEntity>(n: TableName): T[] => read<T>(n);

type WithoutBase<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

export const create = <T extends BaseEntity>(n: TableName, item: WithoutBase<T>): T => {
  const now = new Date().toISOString();
  const id = (crypto as any)?.randomUUID
    ? (crypto as any).randomUUID()
    : Math.random().toString(36).slice(2);
  const full = { ...(item as object), id, createdAt: now, updatedAt: now, isActive: true } as T;
  const a = list<T>(n);
  a.unshift(full);
  write(n, a);
  return full;
};

export const update = <T extends BaseEntity>(n: TableName, id: string, patch: Partial<T>) => {
  const a = list<T>(n);
  const i = a.findIndex((x) => x.id === id);
  if (i > -1) {
    a[i] = { ...a[i], ...patch, updatedAt: new Date().toISOString() } as T;
    write(n, a);
  }
};

export const remove = (n: TableName, id: string) =>
  write(
    n,
    list<BaseEntity>(n).filter((x) => x.id !== id),
  );

export const seed = (n: TableName, data: BaseEntity[]) => {
  if (list<BaseEntity>(n).length === 0) write(n, data);
};

const DB_VERSION = 1; // si ya existe tu versión, reutilízala
const nsSel = (eventId: string, kind: SelectorKind) =>
  `event:${eventId}:v${DB_VERSION}:selectores:${kind}`;

export function getSelectors<T extends BaseItem>(eventId: string, kind: SelectorKind): T[] {
  const raw = localStorage.getItem(nsSel(eventId, kind));
  return raw ? (JSON.parse(raw) as T[]) : [];
}

export function setSelectors<T extends BaseItem>(eventId: string, kind: SelectorKind, items: T[]) {
  localStorage.setItem(nsSel(eventId, kind), JSON.stringify(items));
}

export function upsertSelector<T extends BaseItem>(eventId: string, kind: SelectorKind, item: T) {
  const list = getSelectors<T>(eventId, kind);
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx >= 0) list[idx] = item;
  else list.unshift(item);
  setSelectors(eventId, kind, list);
}

export function removeSelector(eventId: string, kind: SelectorKind, id: string) {
  const list = getSelectors<BaseItem>(eventId, kind);
  setSelectors(
    eventId,
    kind,
    list.filter((x) => x.id !== id),
  );
}

// (Opcional) Semillas rápidas
export function seedSelectorsIfEmpty(eventId: string) {
  if (!import.meta.env.DEV) return;
  const ensure = <T extends BaseItem>(kind: SelectorKind, items: T[]) => {
    if (getSelectors<T>(eventId, kind).length === 0) setSelectors(eventId, kind, items);
  };
  ensure<Unidad>('unidades', [
    { id: crypto.randomUUID(), nombre: 'und', isActive: true },
    { id: crypto.randomUUID(), nombre: 'kg', isActive: true },
    { id: crypto.randomUUID(), nombre: 'pack', isActive: true },
  ]);
  ensure<TipoConsumo>('tipoConsumo', [
    { id: crypto.randomUUID(), nombre: 'comer_aqui', isActive: true },
    { id: crypto.randomUUID(), nombre: 'recoger', isActive: true },
  ]);
  ensure<MetodoPago>('metodosPago', [
    { id: crypto.randomUUID(), nombre: 'bizum', isActive: true, requiereReceptor: true },
    { id: crypto.randomUUID(), nombre: 'efectivo', isActive: true, requiereReceptor: false },
    { id: crypto.randomUUID(), nombre: 'tarjeta', isActive: true, requiereReceptor: false },
  ]);
}
