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

const initialLanguage: Language = 'id'
const initialPosition: ProgrammerPosition = 'frontend'

export function useAuth(): AppFlowController {
  const [mode, setMode] = useState<AuthMode>('login')
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [programmerPosition, setProgrammerPosition] =
    useState<ProgrammerPosition>(initialPosition)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(false)
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [accessToken, setAccessToken] = useState('')

  const loginRequest = useFetch(authServices.login)
  const registerRequest = useFetch(authServices.register)

  const authError = loginRequest.error || registerRequest.error
  const isAuthLoading = loginRequest.isLoading || registerRequest.isLoading

  function toggleProgrammingLanguage(languageId: string) {
    setSelectedProgrammingLanguages((currentLanguages) =>
      currentLanguages.includes(languageId)
        ? currentLanguages.filter((item) => item !== languageId)
        : [...currentLanguages, languageId],
    )
  }

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

  function handleContinueLanguageSelection() {
    setHasCompletedLanguageSelection(true)
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setAccessToken('')
    setCurrentUser(null)
    setHasCompletedLanguageSelection(false)
    setSelectedProgrammingLanguages([])
    setMode('login')
    loginRequest.reset()
    registerRequest.reset()
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
