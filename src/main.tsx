import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import './styles/index.css'
import Home from './pages/Home'
import EventLayout from './pages/evento/EventLayout'
import Resumen from './pages/evento/Resumen'
import Asistentes from './pages/evento/Asistentes'
import Ubicaciones from './pages/evento/Ubicaciones'
import Gastos from './pages/evento/Gastos'
import Proveedores from './pages/evento/Proveedores'
import Precios from './pages/evento/Precios'
import Balance from './pages/evento/Balance'
import './seed'

const router = createBrowserRouter([
  { path:'/', element:<App/>, children:[
    { index:true, element:<Home/> },
    { path:'eventos/:id', element:<EventLayout/>, children:[
      { index:true, element:<Resumen/> },
      { path:'asistentes', element:<Asistentes/> },
      { path:'ubicaciones', element:<Ubicaciones/> },
      { path:'gastos', element:<Gastos/> },
      { path:'proveedores', element:<Proveedores/> },
      { path:'precios', element:<Precios/> },
      { path:'balance', element:<Balance/> },
    ] }
  ] }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
)