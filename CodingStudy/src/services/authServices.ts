import { apiFetch } from './api'
import type { AppUser, AuthCredentials, AuthSession, RegisterCredentials } from '../types/user'

export type AuthUser = AppUser
export type LoginPayload = AuthCredentials
export type RegisterPayload = RegisterCredentials
export type LoginResult = AuthSession

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

export async function refreshAccessToken(refreshToken: string) {
  const response = await apiFetch<{ accessToken: string }>('/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })

  if (!response.data) {
    throw new Error('Refresh token response is missing data')
  }

  return response.data
}
