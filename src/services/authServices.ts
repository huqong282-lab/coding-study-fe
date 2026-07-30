import { apiFetch } from './api'
import type { AppUser, AuthCredentials, AuthSession, RegisterCredentials } from '../types/user'

export type AuthUser = AppUser
export type LoginPayload = AuthCredentials
export type RegisterPayload = RegisterCredentials
export type LoginResult = AuthSession
export type ForgotPasswordPayload = {
  email: string
}

export type VerifyForgotPasswordPayload = {
  email: string
  otp: string
}

export type ResetPasswordPayload = {
  email: string
  password: string
  confirmPassword: string
}

type BackendAuthUser = Omit<AppUser, 'role'> & {
  role?: string | { name?: string | null } | null
}

function normalizeAuthUser(user: BackendAuthUser): AppUser {
  return {
    ...user,
    role: typeof user.role === 'string' ? user.role : user.role?.name ?? undefined,
    onboardingCompleted: Boolean(user.onboardingCompleted),
  }
}

export async function login(payload: LoginPayload) {
  const response = await apiFetch<{
    user: BackendAuthUser
    accessToken: string
    refreshToken: string
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.data) {
    throw new Error('Login response is missing data')
  }

  return {
    ...response.data,
    user: normalizeAuthUser(response.data.user),
  }
}

export async function register(payload: RegisterPayload) {
  const response = await apiFetch<BackendAuthUser>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.data) {
    throw new Error('Register response is missing data')
  }

  return normalizeAuthUser(response.data)
}

export async function requestPasswordReset(payload: ForgotPasswordPayload) {
  const response = await apiFetch<null>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response.message
}

export async function verifyForgotPassword(payload: VerifyForgotPasswordPayload) {
  const response = await apiFetch<null>('/auth/verify-forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response.message
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await apiFetch<null>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response.message
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
