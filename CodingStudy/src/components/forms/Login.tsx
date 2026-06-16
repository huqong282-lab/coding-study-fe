import { useMemo, useState } from 'react'

type LoginProps = {
  language?: 'id' | 'en'
  onSwitchToRegister: () => void
  onLogin?: (credentials: { email: string; password: string }) => Promise<void> | void
  serverError?: string
  isLoading?: boolean
}

type LoginForm = {
  email: string
  password: string
  remember: boolean
}

const initialForm: LoginForm = {
  email: '',
  password: '',
  remember: true,
}

const loginCopy = {
  id: {
    invalidEmail: 'Masukkan email yang valid.',
    shortPassword: 'Password minimal 8 karakter.',
    emailPlaceholder: 'nama@email.com',
    passwordPlaceholder: 'Minimal 8 karakter',
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
    emailPlaceholder: 'name@email.com',
    passwordPlaceholder: 'At least 8 characters',
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
      await onLogin?.({
        email: form.email.trim(),
        password: form.password,
      })
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label className="form-field">
        <span>Email</span>
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
        <span>Password</span>
        <div className="password-field">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={updateField}
            placeholder={copy.passwordPlaceholder}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
          />
          <button type="button" onClick={() => setShowPassword((current) => !current)}>
            {showPassword ? copy.hide : copy.show}
          </button>
        </div>
        {errors.password && <small>{errors.password}</small>}
      </label>

      <div className="form-row">
        <label className="check-field">
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={updateField}
          />
          <span>{copy.remember}</span>
        </label>
        <button className="text-button" type="button">
          {copy.forgotPassword}
        </button>
      </div>

      {(submitted || serverError) && (
        <div className={isValid && !serverError ? 'form-message success' : 'form-message error'}>
          {serverError || (isValid ? copy.success : copy.error)}
        </div>
      )}

      <button className="btn btn-primary auth-submit select-none" type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : copy.submit}
      </button>

      <p className="auth-switch-copy">
        {copy.switchCopy}{' '}
        <button type="button" onClick={onSwitchToRegister}>
          {copy.register}
        </button>
      </p>
    </form>
  )
}

export default Login
