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

export function useAuth(): AppFlowController {
  const [mode, setMode] = useState<AuthMode>('login')
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [programmerPosition, setProgrammerPosition] =
    useState<ProgrammerPosition>(initialPosition)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(false)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [accessToken, setAccessToken] = useState('')

  const loginRequest = useFetch(authServices.login)
  const registerRequest = useFetch(authServices.register)
  const {
    selectedProgrammingLanguages,
    onboardingCategories,
    isOnboardingLoading,
    onboardingError,
    toggleProgrammingLanguage,
    handleContinueLanguageSelection,
    resetOnboardingState,
  } = useOnboarding({
    accessToken,
    onCompleted: () => {
      setHasCompletedLanguageSelection(true)
      setCurrentUser((user) =>
        user ? { ...user, onboardingCompleted: true } : user,
      )
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

    setCurrentUser(result.user)
    setAccessToken(result.accessToken)
    setIsAuthenticated(true)
    setHasCompletedLanguageSelection(Boolean(result.user.onboardingCompleted))
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

  function handleLogout() {
    setIsAuthenticated(false)
    setAccessToken('')
    setCurrentUser(null)
    setHasCompletedLanguageSelection(false)
    setMode('login')
    loginRequest.reset()
    registerRequest.reset()
    resetOnboardingState()
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
    handleLogin,
    handleRegister,
    handleContinueLanguageSelection,
    handleLogout,
  }
}
