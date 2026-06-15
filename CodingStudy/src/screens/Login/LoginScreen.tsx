import Login from '../../components/forms/Login'
import Register from '../../components/forms/Register'
import { appCopy, languageOptions, programmerPositionOptions } from '../../data/appData'

type AuthMode = 'login' | 'register'
type Language = 'id' | 'en'

type LoginScreenProps = {
  mode: AuthMode
  language: Language
  programmerPosition: string
  onModeChange: (mode: AuthMode) => void
  onLanguageChange: (language: Language) => void
  onProgrammerPositionChange: (position: string) => void
  onLogin: (credentials: { email: string; password: string }) => Promise<void> | void
  onRegister: (user: { name: string; email: string; password: string }) => Promise<void> | void
  authError?: string
  isAuthLoading?: boolean
}

function LoginScreen({
  mode,
  language,
  programmerPosition,
  onModeChange,
  onLanguageChange,
  onProgrammerPositionChange,
  onLogin,
  onRegister,
  authError = '',
  isAuthLoading = false,
}: LoginScreenProps) {
  const isLogin = mode === 'login'
  const text = appCopy[language]

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Coding Study introduction">
        <p className="eyebrow">{text.authEyebrow}</p>
        <h1>Coding Study</h1>
        <p className="hero-copy">{text.authDescription}</p>

        <div className="feature-grid" aria-label={text.highlights}>
          <div>
            <span>01</span>
            <strong>{text.trackProgress}</strong>
            <p>{text.trackProgressDescription}</p>
          </div>
          <div>
            <span>02</span>
            <strong>{text.teamNotes}</strong>
            <p>{text.teamNotesDescription}</p>
          </div>
          <div>
            <span>03</span>
            <strong>{text.dailyPractice}</strong>
            <p>{text.dailyPracticeDescription}</p>
          </div>
        </div>
      </section>

      <section className="auth-card" aria-label={`${isLogin ? 'Login' : 'Register'} form`}>
        <div className="auth-card-header">
          <div>
            <p className="eyebrow">{isLogin ? text.welcomeBack : text.createAccount}</p>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
          </div>
          <div className="auth-controls">
            <label className="language-select">
              <span>{text.language}</span>
              <select
                value={language}
                onChange={(event) => onLanguageChange(event.target.value as Language)}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="language-select">
              <span>{text.programmerPosition}</span>
              <select
                value={programmerPosition}
                onChange={(event) => onProgrammerPositionChange(event.target.value)}
              >
                {programmerPositionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[language]}
                  </option>
                ))}
              </select>
            </label>
            <div className="mode-toggle" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={isLogin ? 'active' : ''}
                onClick={() => onModeChange('login')}
                role="tab"
                aria-selected={isLogin}
              >
                Login
              </button>
              <button
                type="button"
                className={!isLogin ? 'active' : ''}
                onClick={() => onModeChange('register')}
                role="tab"
                aria-selected={!isLogin}
              >
                Register
              </button>
            </div>
          </div>
        </div>

        {isLogin ? (
          <Login
            language={language}
            onSwitchToRegister={() => onModeChange('register')}
            onLogin={onLogin}
            serverError={authError}
            isLoading={isAuthLoading}
          />
        ) : (
          <Register
            language={language}
            onSwitchToLogin={() => onModeChange('login')}
            onRegister={onRegister}
            serverError={authError}
            isLoading={isAuthLoading}
          />
        )}
      </section>
    </main>
  )
}

export default LoginScreen
