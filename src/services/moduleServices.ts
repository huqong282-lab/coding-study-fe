import { apiFetch } from './api'

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

export async function listModules(classId: string, token: string) {
  const response = await apiFetch<BackendModule[]>(
    `/modules?classId=${encodeURIComponent(classId)}&limit=100`,
    { token },
  )

  return (response.data ?? []).sort((firstModule, secondModule) => firstModule.urutan - secondModule.urutan)
}

export async function createModule(payload: CreateModulePayload, token: string) {
  const response = await apiFetch<BackendModule>('/modules', {
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
  const response = await apiFetch<BackendModule>(`/modules/${moduleId}`, {
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
  await apiFetch<null>(`/modules/${moduleId}`, {
    method: 'DELETE',
    token,
  })
}
