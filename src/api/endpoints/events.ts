import { http } from '../client'
import type { components } from '../../types/openapi'

export type Event = components['schemas']['Event']
export type PagedMeta = components['schemas']['PageMeta']

export interface PagedResponse<T> {
    items: T[]
    page?: PagedMeta
    after?: string
}

export interface ListEventsParams {
    q?: string
    dateFrom?: string
    dateTo?: string
    limit?: number
    page?: number
    after?: string
}

function buildQuery(params: ListEventsParams): string {
    const qs = new URLSearchParams()
    if (params.q) qs.set('q', params.q)
    if (params.dateFrom) qs.set('dateFrom', params.dateFrom)
    if (params.dateTo) qs.set('dateTo', params.dateTo)
    if (typeof params.limit === 'number') qs.set('limit', String(params.limit))
    if (typeof params.page === 'number') qs.set('page', String(params.page))
    if (params.after) qs.set('after', params.after)
    const s = qs.toString()
    return s ? `?${s}` : ''
}

export function listEvents(params: ListEventsParams = {}) {
    return http<PagedResponse<Event>>(`/events${buildQuery(params)}`)
}

export function getEvent(id: string) {
    return http<Event>(`/events/${id}`)
}

export function createEvent(data: Partial<Event>) {
    return http<Event>(`/events`, { method: 'POST', body: data })
}

export function updateEvent(id: string, data: Partial<Event>) {
    return http<Event>(`/events/${id}`, { method: 'PATCH', body: data })
}

export function deleteEvent(id: string) {
    return http<void>(`/events/${id}`, { method: 'DELETE' })
}
