import { apiFetch } from './api'

export type AuthUser = {
  id: number
  name: string
  email: string
  role?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = LoginPayload & {
  name: string
}

export type LoginResult = {
  user: AuthUser
  accessToken: string
}

export async function login(payload: LoginPayload) {
  const response = await apiFetch<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.data) {
    throw new Error('Login response is missing data')
  }

  return response.data
}

export async function register(payload: RegisterPayload) {
  const response = await apiFetch<AuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.data) {
    throw new Error('Register response is missing data')
  }

  return response.data
}
