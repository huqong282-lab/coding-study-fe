import { ApiError, type ApiResponse } from './api'
import { env } from '../config/env'

export type BackendModule = {
  id: string
  classId: string
  urutan: number
  judul: string
  deskripsi?: string | null
  videoUrl?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type CreateModulePayload = {
  classId: string
  urutan: number
  judul: string
  deskripsi?: string
  videoUrl?: string
}

export type UpdateModulePayload = Partial<{
  urutan: number
  judul: string
  deskripsi: string
  videoUrl: string | null
}>

function getModuleBaseUrl() {
  return env.apiBaseUrl.replace(/\/api\/?$/, '')
}

async function moduleFetch<T>(path: string, options: RequestInit & { token?: string } = {}) {
  const headers = new Headers(options.headers)

  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`)
  }

  const response = await fetch(`${getModuleBaseUrl()}${path}`, {
    ...options,
    headers,
  })
  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.message || 'Request failed', response.status, payload?.errors)
  }

  return payload as ApiResponse<T>
}

export async function listModules(classId: string, token: string) {
  const response = await moduleFetch<BackendModule[]>(
    `/modules?classId=${encodeURIComponent(classId)}&limit=100`,
    { token },
  )

  return (response.data ?? []).sort((firstModule, secondModule) => firstModule.urutan - secondModule.urutan)
}

export async function createModule(payload: CreateModulePayload, token: string) {
  const response = await moduleFetch<BackendModule>('/modules', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })

  if (!response.data) {
    throw new Error('Create module response is missing data')
  }

  return response.data
}

export async function updateModule(moduleId: string, payload: UpdateModulePayload, token: string) {
  const response = await moduleFetch<BackendModule>(`/modules/${moduleId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    token,
  })

  if (!response.data) {
    throw new Error('Update module response is missing data')
  }

  return response.data
}

export async function deleteModule(moduleId: string, token: string) {
  await moduleFetch<null>(`/modules/${moduleId}`, {
    method: 'DELETE',
    token,
  })
}
