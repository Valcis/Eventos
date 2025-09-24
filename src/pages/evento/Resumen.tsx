import { useParams } from 'react-router-dom'
import { useCrud } from '../../lib/crud'
import type { Gasto, Entrada, Asistente } from '../../types'
import { formatCurrency } from '../../lib/utils'

export default function Resumen() {
  const { id } = useParams<{ id: string }>()
  const { items: gastos } = useCrud<Gasto>('gastos')
  const { items: entradas } = useCrud<Entrada>('entradas')
  const { items: asistentes } = useCrud<Asistente>('asistentes')

  const gs = gastos.filter(g => g.eventoId === id)
  const es = entradas.filter(e => e.eventoId === id)
  const as = asistentes.filter(a => a.eventoId === id)

  const gastoTotal = gs.reduce((a,g)=>a+g.monto,0)
  const aforo = es.reduce((a,e)=>a+e.disponibles,0)
  const inscritos = as.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card"><div className="text-sm text-gray-500">Gasto acumulado</div><div className="text-2xl font-semibold">{formatCurrency(gastoTotal)}</div></div>
      <div className="card"><div className="text-sm text-gray-500">Aforo disponible</div><div className="text-2xl font-semibold">{aforo}</div></div>
      <div className="card"><div className="text-sm text-gray-500">Inscritos</div><div className="text-2xl font-semibold">{inscritos}</div></div>
    </div>
  )
}