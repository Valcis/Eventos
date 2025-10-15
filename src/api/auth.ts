let inMemoryToken: string | null = null

export function setToken(token: string | null): void {
    inMemoryToken = token
    try {
        if (token) localStorage.setItem('token', token)
        else localStorage.removeItem('token')
    } catch {}
}

export function getToken(): string | null {
    if (inMemoryToken) return inMemoryToken
    try {
        const cached = localStorage.getItem('token')
        if (cached) inMemoryToken = cached
    } catch {}
    return inMemoryToken
}

export function clearToken(): void {
    inMemoryToken = null
    try {
        localStorage.removeItem('token')
    } catch {}
}
