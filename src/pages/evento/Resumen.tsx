import {useMemo} from 'react';
import {useParams} from 'react-router-dom';
import {calcularResumen} from '../../lib/resumen/calculations';
import {Gasto} from "../../lib/gastos/types";
import {Reserva} from "../../lib/reservas/types";
import {useCrud} from "../../lib/shared/hooks/useLocalRepo";

export default function Resumen() {
    const {id: eventoId} = useParams<{ id: string }>();
    const gastosCrud = useCrud<Gasto>('gastos');
    const reservasCrud = useCrud<Reserva>('reservas');

    const gastos = useMemo(
        () => gastosCrud.items.filter((g) => g.eventoId === eventoId),
        [gastosCrud.items, eventoId],
    );
    const reservas = useMemo(
        () => reservasCrud.items.filter((r) => r.eventoId === eventoId),
        [reservasCrud.items, eventoId],
    );


    // Construimos los parámetros evitando pasar propiedades opcionales como undefined (exactOptionalPropertyTypes)
    const summary = useMemo(() => {
        const params = {gastos, reservas};
        return calcularResumen(params);
    }, [gastos, reservas,]);

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
                <h3 className="text-sm text-gray-500">Gasto acumulado</h3>
                <div className="text-2xl font-semibold">{summary.gastoAcumulado.toFixed(2)} €</div>
            </div>
            <div className="card p-4">
                <h3 className="text-sm text-gray-500">Reservas confirmadas</h3>
                <div className="text-lg">Parrilladas: {summary.reservas.parrilladas}</div>
                <div className="text-lg">Picarones: {summary.reservas.picarones}</div>
            </div>
            <div className="card p-4">
                <h3 className="text-sm text-gray-500">Aforo disponible</h3>
                <div className="text-2xl font-semibold">{summary.aforoDisponible ?? '—'}</div>
            </div>
        </section>
    );
}
