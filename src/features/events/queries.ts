import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../../api/endpoints/events'

const keys = {
    list: (p: api.ListEventsParams) => ['events', 'list', p] as const,
    infinite: (p: Omit<api.ListEventsParams, 'page'>) => ['events', 'infinite', p] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
}

export function useEventsQuery(params: api.ListEventsParams) {
    return useQuery({
        queryKey: keys.list(params),
        queryFn: () => api.listEvents(params),
    })
}

export function useEventsInfiniteQuery(params: Omit<api.ListEventsParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: keys.infinite(params),
        queryFn: ({ pageParam }) =>
            api.listEvents({
                ...params,
                after: typeof pageParam === 'string' ? pageParam : params.after,
            }),
        getNextPageParam: lastPage => lastPage.after ?? undefined,
        initialPageParam: params.after ?? undefined,
    })
}

export function useEventQuery(id: string) {
    return useQuery({ queryKey: keys.detail(id), queryFn: () => api.getEvent(id) })
}

export function useCreateEvent() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: api.createEvent,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
    })
}

export function useUpdateEvent(id: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: Partial<api.Event>) => api.updateEvent(id, data),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['events', 'detail', id] })
            qc.invalidateQueries({ queryKey: ['events', 'list'] })
        },
    })
}

export function useDeleteEvent() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: api.deleteEvent,
        onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
    })
}
