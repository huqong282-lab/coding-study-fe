import { useMemo, useState } from 'react'

type LoginProps = {
  onSwitchToRegister: () => void
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

function Login({ onSwitchToRegister }: LoginProps) {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => {
    const nextErrors: Partial<Record<keyof LoginForm, string>> = {}

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Masukkan email yang valid.'
    }

    if (form.password.length < 8) {
      nextErrors.password = 'Password minimal 8 karakter.'
    }

    return nextErrors
  }, [form])

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
        <span>Email</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={updateField}
          placeholder="nama@email.com"
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
            placeholder="Minimal 8 karakter"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
          />
          <button type="button" onClick={() => setShowPassword((current) => !current)}>
            {showPassword ? 'Hide' : 'Show'}
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
          <span>Ingat saya</span>
        </label>
        <button className="text-button" type="button">
          Lupa password?
        </button>
      </div>

      {submitted && (
        <div className={isValid ? 'form-message success' : 'form-message error'}>
          {isValid ? 'Login berhasil disimulasikan.' : 'Periksa kembali email dan password.'}
        </div>
      )}

      <button className="btn btn-primary auth-submit select-none" type="submit">
        Masuk
      </button>

      <p className="auth-switch-copy">
        Belum punya akun?{' '}
        <button type="button" onClick={onSwitchToRegister}>
          Register
        </button>
      </p>
    </form>
  )
}

export default Login
