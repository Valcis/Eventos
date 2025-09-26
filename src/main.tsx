// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App, { EventLayout } from './App';
import './styles/index.css';

// Páginas
import Home from './pages/Home';
import Reservas from './evento/Reservas';
import Selectores from './evento/Selectores';
import Resumen from './evento/Resumen';
import Ubicaciones from './evento/Ubicaciones';
import Precios from './evento/Precios';
import Gastos from './evento/Gastos';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            {
                path: 'eventos/:id',
                element: <EventLayout />,
                children: [
                    { index: true, element: <Resumen /> },
                    { path: 'reservas', element: <Reservas /> },
                    { path: 'ubicaciones', element: <Ubicaciones /> },
                    { path: 'precios', element: <Precios /> },
                    { path: 'gastos', element: <Gastos /> },
                    { path: 'selectores', element: <Selectores /> },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);