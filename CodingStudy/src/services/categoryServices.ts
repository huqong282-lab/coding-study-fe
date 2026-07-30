import { apiFetch } from './api'

export type BackendCategory = {
  id: string
  name: string
  description?: string | null
  createdAt?: string
  updatedAt?: string
}

export type CategoryPayload = {
  name: string
  description?: string
}

export async function listCategories(token: string) {
  const response = await apiFetch<BackendCategory[]>('/categories', { token })

  return response.data ?? []
}

export async function getCategoryById(categoryId: string, token: string) {
  const response = await apiFetch<BackendCategory>(`/categories/${categoryId}`, { token })

  if (!response.data) {
    throw new Error('Category response is missing data')
  }

  return response.data
}

export async function createCategory(payload: CategoryPayload, token: string) {
  const response = await apiFetch<BackendCategory>('/categories', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })

  if (!response.data) {
    throw new Error('Create category response is missing data')
  }

  return response.data
}

export async function updateCategory(categoryId: string, payload: CategoryPayload, token: string) {
  const response = await apiFetch<BackendCategory>(`/categories/${categoryId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  })

  if (!response.data) {
    throw new Error('Update category response is missing data')
  }

  return response.data
}

export async function deleteCategory(categoryId: string, token: string) {
  await apiFetch<null>(`/categories/${categoryId}`, {
    method: 'DELETE',
    token,
  })
}
