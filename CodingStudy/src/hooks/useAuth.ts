import { useState } from 'react'
import * as authServices from '../services/authServices'
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
const authSessionKey = 'codingstudy-auth-session'

type StoredAuthSession = {
  accessToken: string
  user: AppUser
  hasCompletedLanguageSelection: boolean
  selectedProgrammingLanguages: string[]
}

function readStoredAuthSession(): StoredAuthSession | null {
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

function saveStoredAuthSession(session: StoredAuthSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(authSessionKey, JSON.stringify(session))
}

function clearStoredAuthSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(authSessionKey)
}

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

  const loginRequest = useFetch(authServices.login)
  const registerRequest = useFetch(authServices.register)

  function persistAuthSession(
    user: AppUser | null,
    token: string,
    completed: boolean,
    selectedLanguages: string[],
  ) {
    if (!user || !token) {
      return
    }

    saveStoredAuthSession({
      accessToken: token,
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
      persistAuthSession(currentUser, accessToken, true, selectedProgrammingLanguages)
    },
  })

  const authError = loginRequest.error || registerRequest.error
  const isAuthLoading = loginRequest.isLoading || registerRequest.isLoading

  async function handleLogin(credentials: AuthCredentials) {
    loginRequest.reset()
    registerRequest.reset()

    const result = await loginRequest.execute(credentials)
    if (!result) {
      return
    }

    setCurrentUser({
      ...result.user,
      role: credentials.role,
    })
    setAccessToken(result.accessToken)
    setIsAuthenticated(true)
    setHasCompletedLanguageSelection(Boolean(result.user.onboardingCompleted))
    persistAuthSession(
      result.user,
      result.accessToken,
      Boolean(result.user.onboardingCompleted),
      result.user.onboardingCompleted ? storedAuthSession?.selectedProgrammingLanguages ?? [] : [],
    )
  }

  async function handleRegister(user: RegisterCredentials) {
    loginRequest.reset()
    registerRequest.reset()

    const result = await registerRequest.execute(user)
    if (!result) {
      return
    }

    setMode('login')
  }

  function handleSkipLanguageSelection() {
    setHasCompletedLanguageSelection(true)
    setCurrentUser((user) => (user ? { ...user, onboardingCompleted: true } : user))
    persistAuthSession(currentUser, accessToken, true, selectedProgrammingLanguages)
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setAccessToken('')
    setCurrentUser(null)
    setHasCompletedLanguageSelection(false)
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
    handleSkipLanguageSelection,
    handleLogout,
  }
}
