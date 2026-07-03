export type Language = 'id' | 'en'

export type AuthMode = 'login' | 'register'

export type ProgrammerPosition =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'mobile'
  | 'devops'
  | 'data'

export type AppUser = {
  id: number
  name: string
  email: string
  role?: string
  onboardingCompleted?: boolean
  preferences?: OnboardingPreference[]
}

export type OnboardingCategory = {
  id: string
  name: string
  description?: string | null
}

export type OnboardingPreference = {
  categoryId: string
  category: {
    id: string
    name: string
  }
}

export type AuthCredentials = {
  email: string
  password: string
}

export type RegisterCredentials = AuthCredentials & {
  name: string
}

export type AuthSession = {
  user: AppUser
  accessToken: string
}

export type AppFlowState = {
  mode: AuthMode
  language: Language
  programmerPosition: ProgrammerPosition
  isAuthenticated: boolean
  hasCompletedLanguageSelection: boolean
  selectedProgrammingLanguages: string[]
  currentUser: AppUser | null
  accessToken: string
  onboardingCategories: OnboardingCategory[]
  isOnboardingLoading: boolean
  onboardingError: string
  authError: string
  isAuthLoading: boolean
}

export type AppFlowActions = {
  setMode: (mode: AuthMode) => void
  setLanguage: (language: Language) => void
  setProgrammerPosition: (position: ProgrammerPosition) => void
  toggleProgrammingLanguage: (languageId: string) => void
  setSelectedProgrammingLanguages: (languageIds: string[]) => void
  handleLogin: (credentials: AuthCredentials) => Promise<void>
  handleRegister: (user: RegisterCredentials) => Promise<void>
  handleContinueLanguageSelection: () => Promise<boolean>
  handleLogout: () => void
}

export type AppFlowController = AppFlowState & AppFlowActions
