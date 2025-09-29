import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App, { EventLayout } from './App';
import './styles/index.css';

// Páginas
import Home from './pages/Home';
import Reservas from './pages/evento/Reservas';
import Selectores from './pages/evento/Selectores';
import Resumen from './pages/evento/Resumen';
import Precios from './pages/evento/Precios';
import Gastos from './pages/evento/Gastos';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // <-- Providers + Outlet
    children: [
      { index: true, element: <Home /> },
      {
        path: 'eventos/:id',
        element: <EventLayout />, // <-- cabecera + tabs + Outlet
        children: [
          { index: true, element: <Resumen /> },
          { path: 'reservas', element: <Reservas /> },
          { path: 'precios', element: <Precios /> },
          { path: 'gastos', element: <Gastos /> },
          { path: 'selectores', element: <Selectores /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </StrictMode>,
);
