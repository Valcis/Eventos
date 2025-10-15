import { useState } from 'react'
import type { Event } from '../../../api/endpoints/events'

interface Props {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: Partial<Event>) => void
}

export default function EventUpsertModal({ isOpen, onClose, onSubmit }: Props) {
    const [name, setName] = useState<string>('')
    const [date, setDate] = useState<string>('')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
            <div className="bg-white p-4 rounded-xl w-full max-w-md">
                <h2 className="text-lg font-semibold mb-2">Nuevo evento</h2>
                <div className="space-y-2">
                    <input
                        className="input w-full"
                        placeholder="Nombre"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        className="input w-full"
                        placeholder="Fecha ISO"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button className="btn" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={() => onSubmit({ name, date })}>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}
