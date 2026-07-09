import type { AppUser } from '../types/user'

export const authSessionKey = 'codingstudy-auth-session'
export const authSessionUpdatedEvent = 'codingstudy-auth-session-updated'
export const authSessionClearedEvent = 'codingstudy-auth-session-cleared'

export type StoredAuthSession = {
  accessToken: string
  refreshToken: string
  user: AppUser
  hasCompletedLanguageSelection: boolean
  selectedProgrammingLanguages: string[]
}

export function readStoredAuthSession(): StoredAuthSession | null {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(authSessionKey)
  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession) as StoredAuthSession
  } catch {
    return null
  }
}

export function saveStoredAuthSession(session: StoredAuthSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(authSessionKey, JSON.stringify(session))
  window.dispatchEvent(new Event(authSessionUpdatedEvent))
}

export function clearStoredAuthSession(options?: { notify?: boolean }) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(authSessionKey)

  if (options?.notify) {
    window.dispatchEvent(new Event(authSessionClearedEvent))
  }
}

export function notifyStoredAuthSessionCleared() {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(authSessionClearedEvent))
}

export function updateStoredAccessToken(accessToken: string) {
  const currentSession = readStoredAuthSession()
  if (!currentSession) {
    return null
  }

  const nextSession = {
    ...currentSession,
    accessToken,
  }

  saveStoredAuthSession(nextSession)
  return nextSession
}
