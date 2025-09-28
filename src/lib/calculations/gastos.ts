import type { Gasto } from '../../types';

export function calcularGasto(g: Pick<Gasto, 'tipoPrecio' | 'tipoIVA' | 'base' | 'total'>): {
  base: number;
  iva: number;
  total: number;
} {
  const ivaPct = (g.tipoIVA ?? 0) / 100;
  if (g.tipoPrecio === 'bruto') {
    const total = g.total;
    const base = ivaPct > 0 ? total / (1 + ivaPct) : total;
    const iva = total - base;
    return { base, iva, total };
  }
  const base = g.base;
  const iva = base * ivaPct;
  const total = base + iva;
  return { base, iva, total };
}

export function gastoAcumulado(gastos: Gasto[]): number {
  return gastos.reduce((sum, g) => sum + g.total, 0);
}
