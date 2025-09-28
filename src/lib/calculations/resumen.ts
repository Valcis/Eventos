// src/lib/calculations/resumen.ts
import type { Gasto, Reserva, Ubicacion } from '../../types';
import { gastoAcumulado } from './gastos';
import { reservasConfirmadas } from './reservas';

export interface ResumenResult {
  gastoAcumulado: number;
  reservas: { parrilladas: number; picarones: number };
  aforoDisponible?: number;
}

export function calcularResumen(params: {
  gastos: Gasto[];
  reservas: Reserva[];
  ubicacion?: Ubicacion;
}): ResumenResult {
  const totalGastos = gastoAcumulado(params.gastos);
  const res = reservasConfirmadas(params.reservas);

  let aforoDisponible: number | undefined;
  if (params.ubicacion?.capacidad !== undefined) {
    const comerAqui = params.reservas
      .filter((r) => r.tipoConsumo === 'comer_aqui')
      .reduce((acc, r) => acc + r.parrilladas, 0);
    aforoDisponible = params.ubicacion.capacidad - comerAqui;
  }

  const result: ResumenResult = { gastoAcumulado: totalGastos, reservas: res };
  if (aforoDisponible !== undefined) result.aforoDisponible = aforoDisponible;
  return result;
}
