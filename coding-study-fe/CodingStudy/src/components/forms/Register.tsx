import { useMemo, useState } from 'react'

type RegisterProps = {
  language?: 'id' | 'en'
  onSwitchToLogin: () => void
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
    success: 'Registrasi berhasil disimulasikan.',
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
    success: 'Registration simulation succeeded.',
    error: 'Check your registration data again.',
    submit: 'Create account',
    switchCopy: 'Already have an account?',
    login: 'Login',
  },
}

function Register({ language = 'id', onSwitchToLogin }: RegisterProps) {
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label className="form-field">
        <span>{copy.name}</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder={copy.namePlaceholder}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <small>{errors.name}</small>}
      </label>

      <label className="form-field">
        <span>{copy.email}</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={updateField}
          placeholder={copy.emailPlaceholder}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email && <small>{errors.email}</small>}
      </label>

      <label className="form-field">
        <span>{copy.password}</span>
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={updateField}
            placeholder={copy.passwordPlaceholder}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
          />
          <button type="button" onClick={() => setShowPassword((current) => !current)}>
            {showPassword ? copy.hide : copy.show}
          </button>
        </div>
        {errors.password && <small>{errors.password}</small>}
      </label>

      <div className="password-strength" aria-label="Password strength">
        <span className={passwordScore >= 1 ? 'filled' : ''}></span>
        <span className={passwordScore >= 2 ? 'filled' : ''}></span>
        <span className={passwordScore >= 3 ? 'filled' : ''}></span>
        <span className={passwordScore >= 4 ? 'filled' : ''}></span>
      </div>

      <label className="form-field">
        <span>{copy.confirmPassword}</span>
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={updateField}
          placeholder={copy.confirmPasswordPlaceholder}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
        />
        {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
      </label>

      <label className="check-field">
        <input type="checkbox" name="updates" checked={form.updates} onChange={updateField} />
        <span>{copy.updates}</span>
      </label>

      {submitted && (
        <div className={isValid ? 'form-message success' : 'form-message error'}>
          {isValid ? copy.success : copy.error}
        </div>
      )}

      <button className="btn btn-primary auth-submit select-none" type="submit">
        {copy.submit}
      </button>

      <p className="auth-switch-copy">
        {copy.switchCopy}{' '}
        <button type="button" onClick={onSwitchToLogin}>
          {copy.login}
        </button>
      </p>
    </form>
  )
}

export default Register
