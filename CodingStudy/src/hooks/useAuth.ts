import { useEffect, useState } from 'react'
import * as authServices from '../services/authServices'
import {
  authSessionClearedEvent,
  authSessionUpdatedEvent,
  clearStoredAuthSession,
  readStoredAuthSession,
  saveStoredAuthSession,
  type StoredAuthSession,
} from '../services/authSession'
import type {
  AppFlowController,
  AppUser,
  AuthCredentials,
  AuthMode,
  Language,
  ProgrammerPosition,
  RegisterCredentials,
} from '../types/user'
import { useFetch } from './useFetch'
import { useOnboarding } from './useOnboarding'

const initialLanguage: Language = 'id'
const initialPosition: ProgrammerPosition = 'frontend'

export function useAuth(): AppFlowController {
  const storedAuthSession = readStoredAuthSession()
  const [mode, setMode] = useState<AuthMode>('login')
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [programmerPosition, setProgrammerPosition] =
    useState<ProgrammerPosition>(initialPosition)
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(storedAuthSession?.accessToken))
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(
    Boolean(storedAuthSession?.hasCompletedLanguageSelection),
  )
  const [currentUser, setCurrentUser] = useState<AppUser | null>(storedAuthSession?.user ?? null)
  const [accessToken, setAccessToken] = useState(storedAuthSession?.accessToken ?? '')
  const [refreshToken, setRefreshToken] = useState(storedAuthSession?.refreshToken ?? '')
  const [sessionError, setSessionError] = useState('')

  const loginRequest = useFetch(authServices.login)
  const registerRequest = useFetch(authServices.register)

  function applyStoredSession(session: StoredAuthSession | null) {
    if (!session) {
      setIsAuthenticated(false)
      setHasCompletedLanguageSelection(false)
      setCurrentUser(null)
      setAccessToken('')
      setRefreshToken('')
      setSessionError('Sesi habis, silakan login ulang')
      return
    }

    setIsAuthenticated(Boolean(session.accessToken))
    setHasCompletedLanguageSelection(
      Boolean(session.user?.onboardingCompleted ?? session.hasCompletedLanguageSelection),
    )
    setCurrentUser(session.user ?? null)
    setAccessToken(session.accessToken ?? '')
    setRefreshToken(session.refreshToken ?? '')
    setSessionError('')
  }

  function persistAuthSession(
    user: AppUser | null,
    token: string,
    refreshToken: string,
    completed: boolean,
    selectedLanguages: string[],
  ) {
    if (!user || !token || !refreshToken) {
      return
    }

    saveStoredAuthSession({
      accessToken: token,
      refreshToken,
      user: { ...user, onboardingCompleted: completed },
      hasCompletedLanguageSelection: completed,
      selectedProgrammingLanguages: selectedLanguages,
    })
  }

  const {
    selectedProgrammingLanguages,
    onboardingCategories,
    isOnboardingLoading,
    onboardingError,
    toggleProgrammingLanguage,
    setSelectedProgrammingLanguages,
    handleContinueLanguageSelection,
    resetOnboardingState,
  } = useOnboarding({
    accessToken,
    initialSelectedProgrammingLanguages:
      storedAuthSession?.selectedProgrammingLanguages ?? [],
    onCompleted: () => {
      setHasCompletedLanguageSelection(true)
      setCurrentUser((user) =>
        user ? { ...user, onboardingCompleted: true } : user,
      )
      persistAuthSession(
        currentUser,
        accessToken,
        refreshToken,
        true,
        selectedProgrammingLanguages,
      )
    },
  })

  useEffect(() => {
    function handleSessionUpdated() {
      applyStoredSession(readStoredAuthSession())
    }

    function handleSessionCleared() {
      applyStoredSession(null)
    }

    window.addEventListener(authSessionUpdatedEvent, handleSessionUpdated)
    window.addEventListener(authSessionClearedEvent, handleSessionCleared)

    return () => {
      window.removeEventListener(authSessionUpdatedEvent, handleSessionUpdated)
      window.removeEventListener(authSessionClearedEvent, handleSessionCleared)
    }
  }, [])

  const authError = sessionError || loginRequest.error || registerRequest.error
  const isAuthLoading = loginRequest.isLoading || registerRequest.isLoading

  async function handleLogin(credentials: AuthCredentials) {
    loginRequest.reset()
    registerRequest.reset()

    const result = await loginRequest.execute(credentials)
    if (!result) {
      return
    }

    setCurrentUser(result.user)
    setAccessToken(result.accessToken)
    setRefreshToken(result.refreshToken)
    setIsAuthenticated(true)
    setHasCompletedLanguageSelection(Boolean(result.user.onboardingCompleted))
    setSessionError('')

    const isSameStoredUser = storedAuthSession?.user?.id === result.user.id
    persistAuthSession(
      result.user,
      result.accessToken,
      result.refreshToken,
      Boolean(result.user.onboardingCompleted),
      result.user.onboardingCompleted && isSameStoredUser
        ? storedAuthSession?.selectedProgrammingLanguages ?? []
        : [],
    )
  }

  async function handleRegister(user: RegisterCredentials) {
    loginRequest.reset()
    registerRequest.reset()

    const result = await registerRequest.execute(user)
    if (!result) {
      return false
    }

    setSessionError('')
    setMode('login')
    return true
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setAccessToken('')
    setRefreshToken('')
    setCurrentUser(null)
    setHasCompletedLanguageSelection(false)
    setSessionError('')
    setMode('login')
    loginRequest.reset()
    registerRequest.reset()
    resetOnboardingState()
    clearStoredAuthSession()
  }

  return {
    mode,
    language,
    programmerPosition,
    isAuthenticated,
    hasCompletedLanguageSelection,
    selectedProgrammingLanguages,
    currentUser,
    accessToken,
    onboardingCategories,
    isOnboardingLoading,
    onboardingError,
    authError,
    isAuthLoading,
    setMode,
    setLanguage,
    setProgrammerPosition,
    toggleProgrammingLanguage,
    setSelectedProgrammingLanguages,
    handleLogin,
    handleRegister,
    handleContinueLanguageSelection,
    handleLogout,
  }
}
