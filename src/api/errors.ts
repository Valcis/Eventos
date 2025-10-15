export class HttpError extends Error {
    readonly status: number
    readonly payload?: unknown
    constructor(message: string, status: number, payload?: unknown) {
        super(message)
        this.status = status
        this.payload = payload
    }
}

export function isHttpError(err: unknown): err is HttpError {
    return typeof err === 'object' && err !== null && 'status' in err
}
