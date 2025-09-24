import { NavLink, Outlet } from 'react-router-dom'
export default function App(){
  const tab = ({ isActive }: { isActive: boolean }) =>
    'px-3 py-2 rounded-2xl border ' + (isActive ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50')
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">EVENTOS</h1>
      </header>
      <nav className="flex gap-2 flex-wrap">
        <NavLink to="/" className={tab} end>Home</NavLink>
      </nav>
      <main><Outlet/></main>
    </div>
  )
}