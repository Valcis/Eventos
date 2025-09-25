import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCrud } from '../lib/crud';
import type { Selector } from '../types';
import Modal from '../components/Modal';
import FormField from '../components/FormField';

const categorias = ['tipoConsumo', 'metodoPago', 'receptor', 'puntoRecogida'] as const;

export default function Selectores() {
    const { id: eventoId } = useParams<{ id: string }>();
    const { items, create, update, remove } = useCrud<Selector>('selectores');
    const [open, setOpen] = useState(false);

    const rows = useMemo(() => items.filter(s => s.eventoId === eventoId), [items, eventoId]);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!eventoId) return;
        const fd = new FormData(e.currentTarget);
        const categoria = String(fd.get('categoria'));
        const valor = String(fd.get('valor'));
        const orden = Number(fd.get('orden') ?? 0);
        create({ eventoId, categoria: categoria as 'tipoConsumo' | 'metodoPago' | 'receptor' | 'puntoRecogida', valor, habilitado: true, orden });
        setOpen(false);
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Selectores</h2>
                <button className="btn btn-primary" onClick={() => setOpen(true)}>Añadir opción</button>
            </div>

            <div className="card overflow-auto">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Categoría</th>
                        <th>Valor</th>
                        <th>Habilitado</th>
                        <th>Orden</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map(s => (
                        <tr key={s.id}>
                            <td>{s.categoria}</td>
                            <td>{s.valor}</td>
                            <td>
                                <input type="checkbox" checked={s.habilitado} onChange={() => update(s.id, { habilitado: !s.habilitado })} />
                            </td>
                            <td>{s.orden}</td>
                            <td>
                                <button className="btn btn-sm" onClick={() => remove(s.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr><td colSpan={5} className="text-center text-gray-500 p-4">Sin opciones aún</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            <Modal title="Nueva opción" isOpen={open} onClose={() => setOpen(false)}>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onSubmit}>
                    <FormField label="Categoría">
                        <select name="categoria" className="input">
                            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Valor">
                        <input name="valor" className="input" required />
                    </FormField>
                    <FormField label="Orden">
                        <input name="orden" type="number" className="input" defaultValue={0} />
                    </FormField>
                    <div className="col-span-full flex justify-end gap-2">
                        <button type="button" className="btn" onClick={() => setOpen(false)}>Cancelar</button>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}