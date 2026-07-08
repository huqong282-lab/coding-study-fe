import { useNavigate } from 'react-router-dom'
import Login from '../../components/forms/Login'
import Register from '../../components/forms/Register'
import { appCopy, languageOptions } from '../../data/appData'
import type { AuthMode, Language } from '../../types/user'

type LoginScreenProps = {
  mode: AuthMode
  language: Language
  onModeChange: (mode: AuthMode) => void
  onLanguageChange: (language: Language) => void
  onLogin: (credentials: { email: string; password: string }) => Promise<void> | void
  onRegister: (user: { name: string; email: string; password: string }) => Promise<void> | void
  authError?: string
  isAuthLoading?: boolean
}

function LoginScreen({
  mode,
  language,
  onModeChange,
  onLanguageChange,
  onLogin,
  onRegister,
  authError = '',
  isAuthLoading = false,
}: LoginScreenProps) {
  const isLogin = mode === 'login'
  const text = appCopy[language]
  const navigate = useNavigate()

  function handleModeChange(nextMode: AuthMode) {
    onModeChange(nextMode)
    navigate(nextMode === 'login' ? '/login' : '/register')
  }

  return (
    <main className="min-h-screen bg-[#050814] text-slate-300">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[1.08fr_0.92fr]">
        <section
          className="relative overflow-hidden border-b border-white/5 bg-[#0b0a22] px-6 py-12 sm:px-10 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-12 lg:py-16"
          aria-label="Coding Study introduction"
        >
          <div className="absolute -left-28 -top-24 h-[28rem] w-[28rem] rounded-full bg-violet-500/10 blur-3xl animate-auth-float" />
          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex h-full flex-col justify-start gap-8 lg:pt-2">
            <div className="max-w-xl animate-auth-fade-up">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300/80">
                {text.authEyebrow}
              </p>
              <h1 className="mt-5 text-5xl font-black leading-[0.9] text-white sm:text-6xl xl:text-7xl">
                Coding
                <span className="block text-violet-400">Study</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-slate-400 sm:text-lg">
                {text.authDescription}
              </p>
            </div>

            <div className="grid max-w-xl gap-4 animate-auth-fade-up [animation-delay:140ms]">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-500/15 text-xs font-bold text-violet-300">
                  01
                </span>
                <div className="min-w-0">
                  <strong className="block text-sm text-white">{text.trackProgress}</strong>
                  <p className="text-sm text-slate-400">{text.trackProgressDescription}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-500/15 text-xs font-bold text-sky-300">
                  02
                </span>
                <div className="min-w-0">
                  <strong className="block text-sm text-white">{text.teamNotes}</strong>
                  <p className="text-sm text-slate-400">{text.teamNotesDescription}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/15 text-xs font-bold text-emerald-300">
                  03
                </span>
                <div className="min-w-0">
                  <strong className="block text-sm text-white">{text.dailyPractice}</strong>
                  <p className="text-sm text-slate-400">{text.dailyPracticeDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14"
          aria-label={`${isLogin ? 'Login' : 'Register'} form`}
        >
          <div className="w-full max-w-lg animate-auth-fade-up">
            <div className="mb-8 flex justify-end">
              <label className="grid gap-2">
                <span className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-violet-300/80">
                  {text.language}
                </span>
                <select
                  className="auth-language-select h-10 w-40 rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] outline-none backdrop-blur-md transition focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10"
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
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#0d0f2a]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-violet-300/80">
                  {isLogin ? text.welcomeBack : text.createAccount}
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {isLogin ? 'Selamat datang' : 'Buat akun baru'}
                </h2>
                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  {isLogin ? 'Masuk ke akun kamu' : 'Mulai perjalanan belajarmu'}
                </p>
              </div>

              <div
                className="mb-7 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-1"
                role="tablist"
                aria-label="Authentication mode"
              >
                <button
                  type="button"
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isLogin
                      ? 'bg-violet-500 text-white shadow-[0_12px_30px_rgba(124,92,255,0.32)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  onClick={() => handleModeChange('login')}
                  role="tab"
                  aria-selected={isLogin}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    !isLogin
                      ? 'bg-violet-500 text-white shadow-[0_12px_30px_rgba(124,92,255,0.32)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  onClick={() => handleModeChange('register')}
                  role="tab"
                  aria-selected={!isLogin}
                >
                  Register
                </button>
              </div>

              {isLogin ? (
                <Login
                  language={language}
                  onSwitchToRegister={() => handleModeChange('register')}
                  onLogin={onLogin}
                  serverError={authError}
                  isLoading={isAuthLoading}
                />
              ) : (
                <Register
                  language={language}
                  onSwitchToLogin={() => handleModeChange('login')}
                  onRegister={onRegister}
                  serverError={authError}
                  isLoading={isAuthLoading}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default LoginScreen
