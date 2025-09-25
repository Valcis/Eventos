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