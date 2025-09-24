import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'
import { schemas, useCrud } from '../../lib/crud'
import type { Precio } from '../../types'
import { formatCurrency } from '../../lib/utils'

export default function Precios() {
  const { id } = useParams<{ id: string }>()
  const { items, create, update, remove } = useCrud<Precio>('precios')
  const data = items.filter(p => p.eventoId === id)

  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Precio | null>(null)

  const columns = useMemo<ColumnDef<Precio>[]>(() => [
    { header: 'Concepto', accessorKey: 'concepto' },
    { header: 'Importe', accessorKey: 'importe', cell: ({ getValue }) => formatCurrency(getValue() as number) },
  ], [])

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const raw = Object.fromEntries(new FormData(ev.currentTarget).entries())
    const parsed = schemas.precio.safeParse({ ...raw, eventoId: id })
    if (!parsed.success) { alert('Revisa los campos'); return }
    if (editing) update(editing.id, parsed.data as Partial<Precio>)
    else create(parsed.data as any)
    setIsOpen(false); setEditing(null); (ev.currentTarget as any).reset()
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Configuración de precios</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setIsOpen(true) }}>Añadir</button>
      </div>
      <DataTable columns={columns} data={data} onEdit={(r)=>{setEditing(r);setIsOpen(true)}} onDelete={(r)=>remove(r.id)} />
      <Modal title={editing ? 'Editar precio' : 'Añadir precio'} isOpen={isOpen} onClose={()=>{setIsOpen(false);setEditing(null)}}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <FormField label="Concepto"><input className="input" name="concepto" defaultValue={editing?.concepto ?? ''} /></FormField>
          <FormField label="Importe (€)"><input className="input" name="importe" defaultValue={editing?.importe ?? ''} /></FormField>
          <div className="col-span-full flex justify-end gap-2">
            <button type="button" className="btn" onClick={()=>{setIsOpen(false);setEditing(null)}}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}