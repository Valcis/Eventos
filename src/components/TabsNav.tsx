import { NavLink } from 'react-router-dom'
interface Item { to: string; label: string }
interface Props { base: string; items: Item[] }
export default function TabsNav({ base, items }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map(it => (
        <NavLink key={it.to} to={`${base}${it.to}`}
          className={({isActive}) => 'px-3 py-2 rounded-2xl border ' + (isActive ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50')}
          end
        >{it.label}</NavLink>
      ))}
    </div>
  )
}