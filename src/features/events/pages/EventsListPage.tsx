import { useState } from 'react'
import { useEventsQuery, useEventsInfiniteQuery, useCreateEvent } from '../queries'
import EventUpsertModal from '../components/EventUpsertModal'

const USE_CURSOR = false // Pon a true si el back usa cursor "after"

export default function EventsListPage() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const create = useCreateEvent()

    if (USE_CURSOR) {
        const q = useEventsInfiniteQuery({ limit: 20 })
        const items = q.data?.pages.flatMap(p => p.items) ?? []
        return (
            <div className="container">
                <header className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold">Eventos</h1>
                    <button className="btn" onClick={() => setIsOpen(true)}>
                        Nuevo
                    </button>
                </header>
                {q.isLoading ? (
                    'Cargando…'
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(ev => (
                                <tr key={String((ev as { id?: string }).id)}>
                                    <td>{(ev as { name?: string }).name ?? '-'}</td>
                                    <td>{(ev as { date?: string }).date ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="mt-4">
                    <button
                        className="btn"
                        disabled={!q.hasNextPage || q.isFetchingNextPage}
                        onClick={() => q.fetchNextPage()}
                    >
                        {q.isFetchingNextPage
                            ? 'Cargando…'
                            : q.hasNextPage
                              ? 'Cargar más'
                              : 'No hay más'}
                    </button>
                </div>
                <EventUpsertModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onSubmit={create.mutate}
                />
            </div>
        )
    }

    const q = useEventsQuery({ limit: 20, page: 1 })
    return (
        <div className="container">
            <header className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold">Eventos</h1>
                <button className="btn" onClick={() => setIsOpen(true)}>
                    Nuevo
                </button>
            </header>
            {q.isLoading ? (
                'Cargando…'
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(q.data?.items ?? []).map(ev => (
                            <tr key={String((ev as { id?: string }).id)}>
                                <td>{(ev as { name?: string }).name ?? '-'}</td>
                                <td>{(ev as { date?: string }).date ?? '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <EventUpsertModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onSubmit={create.mutate}
            />
        </div>
    )
}
