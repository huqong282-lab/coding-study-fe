import { env } from '../config/env'
import {
  readStoredAuthSession,
  notifyStoredAuthSessionCleared,
  updateStoredAccessToken,
} from './authSession'

type ApiOptions = RequestInit & {
  token?: string | null
  retryOnAuthFailure?: boolean
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages?: number
  }
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

let refreshInFlight: Promise<string | null> | null = null

async function refreshAccessToken() {
  const storedSession = readStoredAuthSession()
  if (!storedSession?.refreshToken) {
    return null
  }

  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(`${env.apiBaseUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedSession.refreshToken }),
      })

      const payload = (await response.json().catch(() => null)) as ApiResponse<{
        accessToken: string
      }> | null

      if (!response.ok || payload?.success === false || !payload?.data?.accessToken) {
        return null
      }

      updateStoredAccessToken(payload.data.accessToken)
      return payload.data.accessToken
    })().finally(() => {
      refreshInFlight = null
    })
  }

  return refreshInFlight
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}) {
  const retryOnAuthFailure = options.retryOnAuthFailure ?? true
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

  if (response.status === 401 && retryOnAuthFailure && options.token) {
    const refreshedToken = await refreshAccessToken()
    if (refreshedToken) {
      return apiFetch<T>(path, {
        ...options,
        token: refreshedToken,
        retryOnAuthFailure: false,
      })
    }

    if (typeof window !== 'undefined') {
      notifyStoredAuthSessionCleared()
    }
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || 'Request failed', response.status, payload?.errors)
  }

  return payload as ApiResponse<T>
}
