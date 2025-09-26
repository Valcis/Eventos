// src/evento/Ubicaciones.tsx
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCrud } from '../../lib/crud';
import type { Ubicacion } from '../../types';
import Modal from '../../components/Modal';
import FormField from '../../components/FormField';

export default function Ubicaciones() {
  const { id: eventoId } = useParams<{ id: string }>();
  const crud = useCrud<Ubicacion>('ubicaciones');
  const rows = useMemo(() => crud.items.filter(u => u.eventoId === eventoId), [crud.items, eventoId]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ubicacion | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!eventoId) return;
    const fd = new FormData(e.currentTarget);

    const nombre = String(fd.get('nombre') ?? '');
    const direccion = String(fd.get('direccion') ?? '');
    const habilitado = Boolean(fd.get('habilitado'));
    const capacidadEntry = fd.get('capacidad');
    const telefonoEntry = fd.get('telefono');
    const horarioEntry = fd.get('horario');
    const comentariosEntry = fd.get('comentarios');

    const base = {
      eventoId,
      nombre,
      direccion,
      habilitado,
      locked: false,
      ...(capacidadEntry && String(capacidadEntry) !== '' ? { capacidad: Number(capacidadEntry) } : {}),
      ...(telefonoEntry && String(telefonoEntry) !== '' ? { telefono: String(telefonoEntry) } : {}),
      ...(horarioEntry && String(horarioEntry) !== '' ? { horario: String(horarioEntry) } : {}),
      ...(comentariosEntry && String(comentariosEntry) !== '' ? { comentarios: String(comentariosEntry) } : {}),
    } as const;

    if (editing) {
      // update respetando exactOptionalPropertyTypes: solo incluimos propiedades presentes
      crud.update(editing.id, { ...base });
    } else {
      crud.create({ ...base });
    }

    setOpen(false);
    setEditing(null);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Ubicaciones</h2>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setOpen(true); }}>Nueva ubicación</button>
      </div>

      <div className="card overflow-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Horario</th>
              <th>Comentarios</th>
              <th>Habilitado</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => {
              const bloqueado = u.locked;
              return (
                <tr key={u.id} className={bloqueado ? 'opacity-60' : ''}>
                  <td>{u.nombre}</td>
                  <td>{u.direccion}</td>
                  <td>{u.telefono ?? ''}</td>
                  <td>{u.horario ?? ''}</td>
                  <td>{u.comentarios ?? ''}</td>
                  <td>
                    <input type="checkbox" checked={u.habilitado} onChange={() => !bloqueado && crud.update(u.id, { habilitado: !u.habilitado })} disabled={bloqueado} />
                  </td>
                  <td>{u.capacidad ?? ''}</td>
                  <td className="flex gap-2">
                    <button className="btn btn-sm" onClick={() => crud.update(u.id, { locked: !u.locked })}>{u.locked ? '🔓' : '🔒'}</button>
                    <button className="btn btn-sm" onClick={() => !bloqueado && setEditing(u)} disabled={bloqueado}>Editar</button>
                    <button className="btn btn-sm" onClick={() => !bloqueado && crud.remove(u.id)} disabled={bloqueado}>Borrar</button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={8} className="text-center text-gray-500 p-4">Sin ubicaciones</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal title={editing ? 'Editar ubicación' : 'Nueva ubicación'} isOpen={open} onClose={() => { setOpen(false); setEditing(null); }}>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
          <FormField label="Nombre"><input name="nombre" className="input" required defaultValue={editing?.nombre ?? ''} /></FormField>
          <FormField label="Dirección"><input name="direccion" className="input" required defaultValue={editing?.direccion ?? ''} /></FormField>
          <FormField label="Teléfono"><input name="telefono" className="input" defaultValue={editing?.telefono ?? ''} /></FormField>
          <FormField label="Horario"><input name="horario" className="input" defaultValue={editing?.horario ?? ''} /></FormField>
          <FormField label="Comentarios"><input name="comentarios" className="input" defaultValue={editing?.comentarios ?? ''} /></FormField>
          <FormField label="Habilitado">
            <input name="habilitado" type="checkbox" defaultChecked={editing?.habilitado ?? true} />
          </FormField>
          <FormField label="Capacidad"><input name="capacidad" type="number" min={0} className="input" defaultValue={editing?.capacidad ?? ''} /></FormField>
          <div className="col-span-full flex justify-end gap-2">
            <button type="button" className="btn" onClick={() => { setOpen(false); setEditing(null); }}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
