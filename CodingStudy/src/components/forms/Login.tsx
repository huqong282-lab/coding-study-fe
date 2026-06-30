import { useMemo, useState } from 'react'
import type { AppRole } from '../../types/user'

type LoginProps = {
  language?: 'id' | 'en'
  onSwitchToRegister: () => void
  onLogin?: (credentials: { email: string; password: string; role: AppRole }) => Promise<void> | void
  serverError?: string
  isLoading?: boolean
}

type LoginForm = {
  email: string
  password: string
  role: AppRole | ''
  remember: boolean
}

const initialForm: LoginForm = {
  email: '',
  password: '',
  role: '',
  remember: true,
}

const loginCopy = {
  id: {
    invalidEmail: 'Masukkan email yang valid.',
    shortPassword: 'Password minimal 8 karakter.',
    requiredRole: 'Pilih masuk sebagai mentor atau murid.',
    emailPlaceholder: 'nama@email.com',
    passwordPlaceholder: 'Minimal 8 karakter',
    roleLabel: 'Masuk sebagai',
    student: 'Murid',
    mentor: 'Mentor',
    hide: 'Hide',
    show: 'Show',
    remember: 'Ingat saya',
    forgotPassword: 'Lupa password?',
    success: 'Login berhasil.',
    error: 'Periksa kembali email dan password.',
    submit: 'Masuk',
    switchCopy: 'Belum punya akun?',
    register: 'Register',
  },
  en: {
    invalidEmail: 'Enter a valid email.',
    shortPassword: 'Password must be at least 8 characters.',
    requiredRole: 'Choose whether to sign in as mentor or student.',
    emailPlaceholder: 'name@email.com',
    passwordPlaceholder: 'At least 8 characters',
    roleLabel: 'Sign in as',
    student: 'Student',
    mentor: 'Mentor',
    hide: 'Hide',
    show: 'Show',
    remember: 'Remember me',
    forgotPassword: 'Forgot password?',
    success: 'Login succeeded.',
    error: 'Check your email and password again.',
    submit: 'Sign in',
    switchCopy: 'Need an account?',
    register: 'Register',
  },
}

function Login({
  language = 'id',
  onSwitchToRegister,
  onLogin,
  serverError = '',
  isLoading = false,
}: LoginProps) {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const copy = loginCopy[language]

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<keyof LoginForm, string>> = {}

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = copy.invalidEmail
    }

    if (form.password.length < 8) {
      nextErrors.password = copy.shortPassword
    }

    if (!form.role) {
      nextErrors.role = copy.requiredRole
    }

    return nextErrors
  }, [copy, form])

  const isValid = Object.keys(errors).length === 0

  function updateField(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setSubmitted(false)
  }

  function updateRole(role: AppRole) {
    setForm((currentForm) => ({
      ...currentForm,
      role,
    }))
    setSubmitted(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    if (isValid) {
      await onLogin?.({
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      })
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-300">Email</span>
        <input
          className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10"
          type="email"
          name="email"
          value={form.email}
          onChange={updateField}
          placeholder={copy.emailPlaceholder}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <small className="text-sm text-rose-300">{errors.email}</small>}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-300">Password</span>
        <div className="relative">
          <input
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-16 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={updateField}
            placeholder={copy.passwordPlaceholder}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-violet-300 transition hover:text-violet-200"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? copy.hide : copy.show}
          </button>
        </div>
        {errors.password && <small className="text-sm text-rose-300">{errors.password}</small>}
      </label>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-slate-300">{copy.roleLabel}</legend>
        <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-1">
          {[
            { value: 'student' as AppRole, label: copy.student },
            { value: 'mentor' as AppRole, label: copy.mentor },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                form.role === option.value
                  ? 'bg-violet-500 text-white shadow-[0_12px_30px_rgba(124,92,255,0.32)]'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => updateRole(option.value)}
              aria-pressed={form.role === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.role && <small className="text-sm text-rose-300">{errors.role}</small>}
      </fieldset>

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            className="h-4 w-4 rounded border-white/20 bg-white/10 text-violet-500 accent-violet-500"
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={updateField}
          />
          <span className="select-none">{copy.remember}</span>
        </label>
        <button className="text-sm font-semibold text-violet-300 transition hover:text-violet-200" type="button">
          {copy.forgotPassword}
        </button>
      </div>

      {(submitted || serverError) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            isValid && !serverError
              ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
              : 'border-rose-400/20 bg-rose-400/10 text-rose-200'
          }`}
        >
          {serverError || (isValid ? copy.success : copy.error)}
        </div>
      )}

      <button
        className="mt-1 inline-flex h-12 items-center justify-center rounded-xl bg-violet-500 px-4 font-semibold text-white shadow-[0_16px_36px_rgba(124,92,255,0.35)] transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : copy.submit}
      </button>

      <p className="text-center text-sm text-slate-400">
        {copy.switchCopy}{' '}
        <button className="font-semibold text-violet-300 transition hover:text-violet-200" type="button" onClick={onSwitchToRegister}>
          {copy.register}
        </button>
      </p>
    </form>
  )
}

export default Login
