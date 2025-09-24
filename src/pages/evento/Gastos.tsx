import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'
import { schemas, useCrud } from '../../lib/crud'
import type { Gasto } from '../../types'
import { formatCurrency } from '../../lib/utils'

export default function Gastos() {
  const { id } = useParams<{ id: string }>()
  const { items, create, update, remove } = useCrud<Gasto>('gastos')
  const data = items.filter(g => g.eventoId === id)

  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Gasto | null>(null)

  const total = data.reduce((a,g)=>a+g.monto,0)
  const columns = useMemo<ColumnDef<Gasto>[]>(() => [
    { header: 'Categoría', accessorKey: 'categoria' },
    { header: 'Monto', accessorKey: 'monto', cell: ({ getValue }) => formatCurrency(getValue() as number) },
    { header: 'Notas', accessorKey: 'notas' },
  ], [])

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const raw = Object.fromEntries(new FormData(ev.currentTarget).entries())
    const parsed = schemas.gasto.safeParse({ ...raw, eventoId: id })
    if (!parsed.success) { alert('Revisa los campos'); return }
    if (editing) update(editing.id, parsed.data as Partial<Gasto>)
    else create(parsed.data as any)
    setIsOpen(false); setEditing(null); (ev.currentTarget as any).reset()
  }

  return (
    <section className="space-y-3">
      <div className="card">
        <div className="text-sm text-gray-500">Gasto total</div>
        <div className="text-2xl font-semibold">{formatCurrency(total)}</div>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Gastos</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setIsOpen(true) }}>Añadir</button>
      </div>
      <DataTable columns={columns} data={data} onEdit={(r)=>{setEditing(r);setIsOpen(true)}} onDelete={(r)=>remove(r.id)} />
      <Modal title={editing ? 'Editar gasto' : 'Añadir gasto'} isOpen={isOpen} onClose={()=>{setIsOpen(false);setEditing(null)}}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <FormField label="Categoría"><input className="input" name="categoria" defaultValue={editing?.categoria ?? ''} /></FormField>
          <FormField label="Monto (€)"><input className="input" name="monto" defaultValue={editing?.monto ?? ''} /></FormField>
          <FormField label="Notas"><input className="input" name="notas" defaultValue={editing?.notas ?? ''} /></FormField>
          <div className="col-span-full flex justify-end gap-2">
            <button type="button" className="btn" onClick={()=>{setIsOpen(false);setEditing(null)}}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}