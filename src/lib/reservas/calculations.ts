import {Reserva} from "./types";
import {Precio} from "../precios/types";

export function calcularTotalPedido(
    reserva: Pick<Reserva, 'parrilladas' | 'picarones'>,
    precios: Precio[],
): number {
    const pParrilla = precios.find((p) => p.concepto === 'parrilladas')?.importe ?? 0;
    const pPicarones = precios.find((p) => p.concepto === 'picarones')?.importe ?? 0;
    return reserva.parrilladas * pParrilla + reserva.picarones * pPicarones;
}

export function reservasConfirmadas(reservas: Reserva[]): {
    parrilladas: number;
    picarones: number;
} {
    return reservas.reduce(
        (acc, r) => {
            acc.parrilladas += r.parrilladas;
            acc.picarones += r.picarones;
            return acc;
        },
        {parrilladas: 0, picarones: 0},
    );
}
