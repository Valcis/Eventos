import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import FormField from '../../components/FormField'
import { schemas, useCrud } from '../../lib/crud'
import type { Proveedor } from '../../types'

export default function Proveedores() {
  const { items, create, update, remove } = useCrud<Proveedor>('proveedores')
  const data = items

  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Proveedor | null>(null)

  const columns = useMemo<ColumnDef<Proveedor>[]>(() => [
    { header: 'Nombre', accessorKey: 'nombre' },
    { header: 'Categoría', accessorKey: 'categoria' },
    { header: 'Contacto', accessorKey: 'contacto' },
  ], [])

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const raw = Object.fromEntries(new FormData(ev.currentTarget).entries())
    const parsed = schemas.proveedor.safeParse(raw)
    if (!parsed.success) { alert('Revisa los campos'); return }
    if (editing) update(editing.id, parsed.data as Partial<Proveedor>)
    else create(parsed.data as any)
    setIsOpen(false); setEditing(null); (ev.currentTarget as any).reset()
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Proveedores</h3>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setIsOpen(true) }}>Añadir</button>
      </div>
      <DataTable columns={columns} data={data} onEdit={(r)=>{setEditing(r);setIsOpen(true)}} onDelete={(r)=>remove(r.id)} />
      <Modal title={editing ? 'Editar proveedor' : 'Añadir proveedor'} isOpen={isOpen} onClose={()=>{setIsOpen(false);setEditing(null)}}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <FormField label="Nombre"><input className="input" name="nombre" defaultValue={editing?.nombre ?? ''} /></FormField>
          <FormField label="Categoría"><input className="input" name="categoria" defaultValue={editing?.categoria ?? ''} /></FormField>
          <FormField label="Contacto"><input className="input" name="contacto" defaultValue={editing?.contacto ?? ''} /></FormField>
          <div className="col-span-full flex justify-end gap-2">
            <button type="button" className="btn" onClick={()=>{setIsOpen(false);setEditing(null)}}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>
    </section>
  )
}