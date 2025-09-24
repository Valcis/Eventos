import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'
import { schemas, useCrud } from '../../lib/crud'
import type { Ubicacion } from '../../types'

export default function Ubicaciones() {
  const { items, create, update, remove } = useCrud<Ubicacion>('ubicaciones')
  const data = items // si las haces por evento, añade eventoId y filtra

  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Ubicacion | null>(null)

  const columns = useMemo<ColumnDef<Ubicacion>[]>(() => [
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Dirección', accessorKey: 'direccion' },
    { header: 'Capacidad', accessorKey: 'capacidad' },
  ], [])

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const raw = Object.fromEntries(new FormData(ev.currentTarget).entries())
    const parsed = schemas.ubicacion.safeParse(raw)
    if (!parsed.success) { alert('Revisa los campos'); return }
    if (editing) update(editing.id, parsed.data as Partial<Ubicacion>)
    else create(parsed.data as any)
    setIsOpen(false); setEditing(null); (ev.currentTarget as any).reset()
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Ubicaciones / Puntos de recogida</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setIsOpen(true) }}>Añadir</button>
      </div>
      <DataTable columns={columns} data={data} onEdit={(r)=>{setEditing(r);setIsOpen(true)}} onDelete={(r)=>remove(r.id)} />
      <Modal title={editing ? 'Editar ubicación' : 'Añadir ubicación'} isOpen={isOpen} onClose={()=>{setIsOpen(false);setEditing(null)}}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <FormField label="Nombre"><input className="input" name="nombre" defaultValue={editing?.nombre ?? ''} /></FormField>
          <FormField label="Dirección"><input className="input" name="direccion" defaultValue={editing?.direccion ?? ''} /></FormField>
          <FormField label="Capacidad"><input className="input" name="capacidad" defaultValue={editing?.capacidad ?? 0} /></FormField>
          <div className="col-span-full flex justify-end gap-2">
            <button type="button" className="btn" onClick={()=>{setIsOpen(false);setEditing(null)}}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}