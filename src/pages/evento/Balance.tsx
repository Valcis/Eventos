import { useParams } from 'react-router-dom'
import { useCrud } from '../../lib/crud'
import type { Gasto, Entrada, Precio, Asistente } from '../../types'
import { formatCurrency } from '../../lib/utils'

export default function Balance() {
  const { id } = useParams<{ id: string }>()
  const { items: gastos } = useCrud<Gasto>('gastos')
  const { items: precios } = useCrud<Precio>('precios')
  const { items: asistentes } = useCrud<Asistente>('asistentes')

  const gs = gastos.filter(g => g.eventoId === id)
  const ps = precios.filter(p => p.eventoId === id)
  const as = asistentes.filter(a => a.eventoId === id)

  const gastoTotal = gs.reduce((a,g)=>a+g.monto,0)
  const precioBase = ps.find(p => p.concepto.toLowerCase()==='general')?.importe ?? 0
  const ingresos = as.length * precioBase
  const resultado = ingresos - gastoTotal

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card"><div className="text-sm text-gray-500">Ingresos (estimado)</div><div className="text-2xl font-semibold">{formatCurrency(ingresos)}</div></div>
      <div className="card"><div className="text-sm text-gray-500">Gastos</div><div className="text-2xl font-semibold">{formatCurrency(gastoTotal)}</div></div>
      <div className="card"><div className="text-sm text-gray-500">Resultado</div><div className="text-2xl font-semibold">{formatCurrency(resultado)}</div></div>
    </div>
  )
}