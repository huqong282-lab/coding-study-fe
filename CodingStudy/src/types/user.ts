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
}

export type AuthCredentials = {
  email: string
  password: string
}

export type RegisterCredentials = {
  name: string
  email: string
  password: string
}

export type AuthSession = {
  user: AppUser
  accessToken: string
  refreshToken: string
}

export type OnboardingCategory = {
  id: string
  name: string
  description?: string | null
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
  handleRegister: (user: RegisterCredentials) => Promise<boolean>
  handleContinueLanguageSelection: () => Promise<boolean>
  handleLogout: () => void
}

export type AppFlowController = AppFlowState & AppFlowActions
