import type {Gasto} from './types';

export function calcularGasto(g: Pick<Gasto, 'tipoIVA' | 'tipoPrecio' | 'precioBase' | 'precioNeto'>): {
    base: number;
    iva: number;
    total: number;
} {
    const ivaPct = (g.tipoIVA ?? 0) / 100;
    const base = g.precioBase ?? 0;
    const iva = base * ivaPct;
    const total = g.tipoPrecio === 'con IVA' ? (g.precioNeto ?? base + iva) : base + iva;
    return { base, iva, total };
}

export function gastoAcumulado(gastos: ReadonlyArray<Gasto>): number {
    return gastos.reduce((sum, g) => sum + calcularGasto(g).total, 0);
}
