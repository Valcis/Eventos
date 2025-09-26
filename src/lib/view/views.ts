export type GastosView = 'simple' | 'detallada';

const KEY = 'views:gastos';

interface Store {
  [eventId: string]: GastosView;
}

function read(): Store {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Store;
  } catch {
    return {};
  }
}

function write(s: Store) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function getGastosView(eventId: string): GastosView {
  const s = read();
  return s[eventId] ?? 'simple';
}

export function setGastosView(eventId: string, view: GastosView) {
  const s = read();
  s[eventId] = view;
  write(s);
}
