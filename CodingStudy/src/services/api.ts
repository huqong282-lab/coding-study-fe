import { env } from '../config/env'

type ApiOptions = RequestInit & {
  token?: string | null
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  errors?: unknown
}

export class ApiError extends Error {
  status: number
  errors: unknown

  constructor(message: string, status: number, errors?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...options,
    headers,
  })

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || 'Request failed', response.status, payload?.errors)
  }

  return payload as ApiResponse<T>
}
