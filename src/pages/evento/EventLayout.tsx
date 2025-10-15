import {Outlet, useNavigate, useParams} from 'react-router-dom';
import TabsNav from '../../components/TabsNav';
import type {Evento} from '../../lib/evento/types';
import {useCrud} from "../../lib/useLocalRepo";


export default function EventLayout() {
    const {id} = useParams<{ id: string }>();
    const {items} = useCrud<Evento>('eventos');
    const nav = useNavigate();
    const ev = items.find((x) => x.id === id);
    if (!ev) {
        nav('/');
        return null;
    }

    const base = `/eventos/${id}/`;
    const tabs = [
        {to: '', label: 'Resumen'},
        {to: 'reservas', label: 'Reservas'},
        {to: 'gastos', label: 'Gastos'},
        {to: 'precios', label: 'Precios'},
        {to: 'selectores', label: 'Selectores'},
    ];

    return (
        <section className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-gray-500">{ev.fecha}</div>
                    <h2 className="text-xl font-semibold">{ev.nombre}</h2>
                </div>
            </header>
            <TabsNav base={base} items={tabs}/>
            <Outlet/>
        </section>
    );
}
