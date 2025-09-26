import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'
import { schemas, useCrud } from '../../lib/crud'
import type { Asistente } from '../../types'

export default function Asistentes() {
  const { id } = useParams<{ id: string }>()
  const { items, create, update, remove } = useCrud<Asistente>('asistentes')
  const data = items.filter(a => a.eventoId === id)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Asistente | null>(null)

  const columns = useMemo<ColumnDef<Asistente>[]>(() => [
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Teléfono', accessorKey: 'telefono' },
  ], [])

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const raw = Object.fromEntries(new FormData(ev.currentTarget).entries())
    const parsed = schemas.asistente.safeParse({ ...raw, eventoId: id })
    if (!parsed.success) { alert('Revisa los campos'); return }
    if (editing) update(editing.id, parsed.data as Partial<Asistente>)
    else create(parsed.data as any)
    setIsOpen(false); setEditing(null); (ev.currentTarget as any).reset()
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Asistentes</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setIsOpen(true) }}>Añadir</button>
      </div>
      <DataTable columns={columns} data={data} onEdit={(r)=>{setEditing(r);setIsOpen(true)}} onDelete={(r)=>remove(r.id)} />
      <Modal title={editing ? 'Editar asistente' : 'Añadir asistente'} isOpen={isOpen} onClose={()=>{setIsOpen(false);setEditing(null)}}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <FormField label="Nombre"><input className="input" name="nombre" defaultValue={editing?.nombre ?? ''} /></FormField>
          <FormField label="Email"><input className="input" name="email" defaultValue={editing?.email ?? ''} /></FormField>
          <FormField label="Teléfono"><input className="input" name="telefono" defaultValue={editing?.telefono ?? ''} /></FormField>
          <div className="col-span-full flex justify-end gap-2">
            <button type="button" className="btn" onClick={()=>{setIsOpen(false);setEditing(null)}}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}