export const uid = (): string =>
  Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
export const nowISO = (): string => new Date().toISOString();

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function stableSort<T>(array: readonly T[], compare: (a: T, b: T) => number): T[] {
  return array
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const res = compare(a.item, b.item);
      return res !== 0 ? res : a.index - b.index;
    })
    .map(({ item }) => item);
}

export function defaultCompare(a: unknown, b: unknown): number {
  // Normalize undefined/null
  const va = a ?? '';
  const vb = b ?? '';
  // Dates
  if (va instanceof Date && vb instanceof Date) return va.getTime() - vb.getTime();
  // Numbers
  if (typeof va === 'number' && typeof vb === 'number') return va - vb;
  // Booleans (true > false)
  if (typeof va === 'boolean' && typeof vb === 'boolean') return Number(va) - Number(vb);
  // Strings (case-insensitive)
  return String(va).localeCompare(String(vb), undefined, { sensitivity: 'base' });
}

export function getDirectionMultiplier(direction: 'asc' | 'desc'): 1 | -1 {
  return direction === 'asc' ? 1 : -1;
}
