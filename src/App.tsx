import {Outlet, Link, NavLink, useParams} from 'react-router-dom';

function EventTabs() {
    // Component: pestañas de navegación del evento
    const {id} = useParams();
    console.log(useParams());
    const tabs = [
        {to: `/eventos/${id}`, label: 'Resumen', end: true as const},
        {to: `/eventos/${id}/reservas`, label: 'Reservas'},
        {to: `/eventos/${id}/gastos`, label: 'Gastos'},
        {to: `/eventos/${id}/precios`, label: 'Precios'},
        {to: `/eventos/${id}/selectores`, label: 'Selectores'},
    ];
    return (
        <nav className="mb-4 flex gap-2">
            {tabs.map(t => (
                t.end ? (
                    <NavLink key={t.to} to={t.to} end
                        className={({isActive}) =>
                            `px-3 py-1 rounded ${isActive ? 'bg-gray-900 text-white' : 'bg-gray-100'}`
                        }
                    >
                        {t.label}
                    </NavLink>
                ) : (
                    <NavLink
                        key={t.to} to={t.to}
                        className={({isActive}) =>
                            `px-3 py-1 rounded ${isActive ? 'bg-gray-900 text-white' : 'bg-gray-100'}`
                        }
                    >
                        {t.label}
                    </NavLink>
                )
            ))}
        </nav>
    );
}

function EventLayout() {
    const {id} = useParams();
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Evento {id}</h1>
                <Link to="/" className="text-sm text-blue-600 hover:underline">Volver</Link>
            </div>
            <EventTabs/>
            <Outlet/>
        </section>
    );
}

export default function App() {
    return (
        <div className="max-w-6xl mx-auto p-4">
            <Outlet/>
        </div>
    );
}

// Exportamos layouts para el router
export {EventLayout};