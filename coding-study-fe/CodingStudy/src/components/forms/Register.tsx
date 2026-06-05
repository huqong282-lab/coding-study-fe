import { useMemo, useState } from 'react'

type RegisterProps = {
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

function Register({ onSwitchToLogin }: RegisterProps) {
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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
      nextErrors.name = 'Nama minimal 3 karakter.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Masukkan email yang valid.'
    }

    if (form.password.length < 8) {
      nextErrors.password = 'Password minimal 8 karakter.'
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Konfirmasi password belum sama.'
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
        <span>Nama lengkap</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder="Contoh: Firman Syah"
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <small>{errors.name}</small>}
      </label>

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
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
          />
          <button type="button" onClick={() => setShowPassword((current) => !current)}>
            {showPassword ? 'Hide' : 'Show'}
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
        <span>Konfirmasi password</span>
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={updateField}
          placeholder="Ulangi password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
        />
        {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
      </label>

      <label className="check-field">
        <input type="checkbox" name="updates" checked={form.updates} onChange={updateField} />
        <span>Saya setuju menerima update belajar</span>
      </label>

      {submitted && (
        <div className={isValid ? 'form-message success' : 'form-message error'}>
          {isValid ? 'Registrasi berhasil disimulasikan.' : 'Periksa kembali data register.'}
        </div>
      )}

      <button className="btn btn-primary auth-submit select-none" type="submit">
        Buat akun
      </button>

      <p className="auth-switch-copy">
        Sudah punya akun?{' '}
        <button type="button" onClick={onSwitchToLogin}>
          Login
        </button>
      </p>
    </form>
  )
}

export default Register
