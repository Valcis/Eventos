import { getToken, clearToken } from './auth'
import { HttpError } from './errors'

interface HttpOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
    signal?: AbortSignal
    skipAuth?: boolean
}

const BASE_URL = import.meta.env.VITE_API_BASE ?? '/api'

async function doFetch(path: string, opts: HttpOptions): Promise<Response> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (!opts.skipAuth) {
        const token = getToken()
        if (token) (headers as Record<string, string>).Authorization = `Bearer ${token}`
    }
    return fetch(`${BASE_URL}${path}`, {
        method: opts.method ?? 'GET',
        headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        signal: opts.signal,
        credentials: 'same-origin',
    })
}

export async function http<T>(path: string, opts: HttpOptions = {}): Promise<T> {
    const res = await doFetch(path, opts)
    if (res.ok) {
        if (res.status === 204) return undefined as T
        return (await res.json()) as T
    }

    if (res.status === 401) {
        const refreshed = await tryRefreshOnce()
        if (refreshed) {
            const retry = await doFetch(path, opts)
            if (retry.ok) {
                if (retry.status === 204) return undefined as T
                return (await retry.json()) as T
            }
            const payloadRetry = await safeJson(retry)
            throw new HttpError(retry.statusText, retry.status, payloadRetry)
        }
        clearToken()
    }

    const payload = await safeJson(res)
    throw new HttpError(res.statusText, res.status, payload)
}

async function safeJson(res: Response): Promise<unknown> {
    try {
        return await res.json()
    } catch {
        return undefined
    }
}

let refreshAttempted = false
async function tryRefreshOnce(): Promise<boolean> {
    if (refreshAttempted) return false
    refreshAttempted = true
    try {
        const res = await doFetch('/auth/refresh', { method: 'POST', skipAuth: true })
        if (!res.ok) return false
        const data = (await res.json()) as { token?: string }
        if (data.token) {
            const { setToken } = await import('./auth')
            setToken(data.token)
            return true
        }
        return false
    } catch {
        return false
    } finally {
        refreshAttempted = false
    }
}
