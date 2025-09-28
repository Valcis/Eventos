import React, { FC } from 'react';
import { Outlet, NavLink, Link, useParams } from 'react-router-dom';

// Providers tomados de UiProviders.tsx (rutas relativas, sin alias @)
import { ToastProvider } from './components/ui/Toast';
import { AlertConfirmProvider } from './components/ui/AlertConfirm';

/** Pestañas de navegación dentro de un evento */
const EventTabs: React.FC = () => {
  const { id } = useParams();
  const tabs = [
    { to: `/eventos/${id}`, label: 'Resumen', end: true as const },
    { to: `/eventos/${id}/reservas`, label: 'Reservas' },
    { to: `/eventos/${id}/gastos`, label: 'Gastos' },
    { to: `/eventos/${id}/precios`, label: 'Precios' },
    { to: `/eventos/${id}/selectores`, label: 'Selectores' },
  ];

  return (
    <nav className="flex gap-2 my-4">
      {tabs.map((tab) =>
        // Si una pestaña marca end: true, usamos NavLink con la prop "end"
        tab.end ? (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              `px-3 py-1 rounded ${isActive ? 'bg-gray-900 text-white' : 'bg-gray-100'}`
            }
          >
            {tab.label}
          </NavLink>
        ) : (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-3 py-1 rounded ${isActive ? 'bg-gray-900 text-white' : 'bg-gray-100'}`
            }
          >
            {tab.label}
          </NavLink>
        ),
      )}
    </nav>
  );
};

/** Layout de páginas de evento (envuelve las subrutas de un evento) */
const EventLayout: FC = () => {
  const { id } = useParams();

  return (
    <section className="p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Evento {id}</h1>
        <Link to="/" className="text-blue-600 underline">
          Volver
        </Link>
      </header>

      <EventTabs />

      {/* Contenido de la subruta */}
      <Outlet />
    </section>
  );
};

/** App raíz: apila Providers y expone un <Outlet/> para el router */
const App: React.FC = () => {
  return (
    <ToastProvider>
      <AlertConfirmProvider>
        {/* Aquí se renderiza la ruta hija (Home o layouts) */}
        <Outlet />
      </AlertConfirmProvider>
    </ToastProvider>
  );
};

export default App;
// Exportamos el layout para que el router lo use en main.tsx
export { EventLayout };
