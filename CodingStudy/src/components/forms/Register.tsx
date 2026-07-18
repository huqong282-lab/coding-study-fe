import { useMemo, useState } from 'react'

type RegisterProps = {
  language?: 'id' | 'en'
  onSwitchToLogin: () => void
  onRegister?: (user: { name: string; email: string; password: string }) => Promise<boolean> | boolean
  serverError?: string
  isLoading?: boolean
}

type RegisterForm = {
  name: string
  email: string
  password: string
  confirmPassword: string
  updates: boolean
}

const initialForm: RegisterForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  updates: true,
}

const registerCopy = {
  id: {
    name: 'Nama lengkap',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Konfirmasi password',
    namePlaceholder: 'Contoh: Firman Syah',
    emailPlaceholder: 'nama@email.com',
    passwordPlaceholder: 'Minimal 8 karakter',
    confirmPasswordPlaceholder: 'Ulangi password',
    invalidName: 'Nama minimal 3 karakter.',
    invalidEmail: 'Masukkan email yang valid.',
    shortPassword: 'Password minimal 8 karakter.',
    passwordMismatch: 'Konfirmasi password belum sama.',
    hide: 'Hide',
    show: 'Show',
    updates: 'Saya setuju menerima update belajar',
    success: 'Registrasi berhasil. Silakan login dengan email yang sama.',
    error: 'Periksa kembali data register.',
    submit: 'Buat akun',
    switchCopy: 'Sudah punya akun?',
    login: 'Login',
  },
  en: {
    name: 'Full name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    namePlaceholder: 'Example: Firman Syah',
    emailPlaceholder: 'name@email.com',
    passwordPlaceholder: 'At least 8 characters',
    confirmPasswordPlaceholder: 'Repeat password',
    invalidName: 'Name must be at least 3 characters.',
    invalidEmail: 'Enter a valid email.',
    shortPassword: 'Password must be at least 8 characters.',
    passwordMismatch: 'Password confirmation does not match.',
    hide: 'Hide',
    show: 'Show',
    updates: 'I agree to receive learning updates',
    success: 'Registration succeeded. Please sign in with the same email.',
    error: 'Check your registration data again.',
    submit: 'Create account',
    switchCopy: 'Already have an account?',
    login: 'Login',
  },
}

function Register({
  language = 'id',
  onSwitchToLogin,
  onRegister,
  serverError = '',
  isLoading = false,
}: RegisterProps) {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const copy = registerCopy[language]

  const passwordScore = useMemo(() => {
    const checks = [
      form.password.length >= 8,
      /[A-Z]/.test(form.password),
      /[0-9]/.test(form.password),
      /[^A-Za-z0-9]/.test(form.password),
    ]

    return checks.filter(Boolean).length
  }, [form.password])

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<keyof RegisterForm, string>> = {}

    if (form.name.trim().length < 3) {
      nextErrors.name = copy.invalidName
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = copy.invalidEmail
    }

    if (form.password.length < 8) {
      nextErrors.password = copy.shortPassword
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = copy.passwordMismatch
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    if (isValid) {
      await onRegister?.({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      })
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-300">{copy.name}</span>
        <input
          className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10"
          type="text"
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder={copy.namePlaceholder}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <small className="text-sm text-rose-300">{errors.name}</small>}
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-300">{copy.email}</span>
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
        <span className="text-sm font-medium text-slate-300">{copy.password}</span>
        <div className="relative">
          <input
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-16 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={updateField}
            placeholder={copy.passwordPlaceholder}
            autoComplete="new-password"
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

      <div className="grid grid-cols-4 gap-2" aria-label="Password strength">
        <span className={`h-1.5 rounded-full ${passwordScore >= 1 ? 'bg-violet-400' : 'bg-white/10'}`}></span>
        <span className={`h-1.5 rounded-full ${passwordScore >= 2 ? 'bg-violet-400' : 'bg-white/10'}`}></span>
        <span className={`h-1.5 rounded-full ${passwordScore >= 3 ? 'bg-violet-400' : 'bg-white/10'}`}></span>
        <span className={`h-1.5 rounded-full ${passwordScore >= 4 ? 'bg-violet-400' : 'bg-white/10'}`}></span>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-slate-300">{copy.confirmPassword}</span>
        <input
          className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10"
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={updateField}
          placeholder={copy.confirmPasswordPlaceholder}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
        />
        {errors.confirmPassword && (
          <small className="text-sm text-rose-300">{errors.confirmPassword}</small>
        )}
      </label>

      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input
          className="h-4 w-4 rounded border-white/20 bg-white/10 text-violet-500 accent-violet-500"
          type="checkbox"
          name="updates"
          checked={form.updates}
          onChange={updateField}
        />
        <span className="select-none">{copy.updates}</span>
      </label>

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
        <button className="font-semibold text-violet-300 transition hover:text-violet-200" type="button" onClick={onSwitchToLogin}>
          {copy.login}
        </button>
      </p>
    </form>
  )
}

export default Register
