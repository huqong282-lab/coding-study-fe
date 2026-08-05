import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../../services/api'
import { resetPassword } from '../../services/authServices'

type ResetPasswordLocationState = {
  email?: string
  verified?: boolean
}

type ResetPasswordForm = {
  password: string
  confirmPassword: string
}

const initialForm: ResetPasswordForm = {
  password: '',
  confirmPassword: '',
}

function ResetPasswordScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as ResetPasswordLocationState | null
  const email = typeof state?.email === 'string' ? state.email.trim() : ''
  const isVerified = Boolean(state?.verified)
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const passwordError = useMemo(() => {
    if (form.password.length < 8) {
      return 'Password minimal 8 karakter.'
    }

    return ''
  }, [form.password])

  const confirmPasswordError = useMemo(() => {
    if (!form.confirmPassword) {
      return 'Konfirmasi password wajib diisi.'
    }

    if (form.password !== form.confirmPassword) {
      return 'Password dan konfirmasi password harus sama.'
    }

    return ''
  }, [form.confirmPassword, form.password])

  useEffect(() => {
    if (!email || !isVerified) {
      navigate('/forgot-password', { replace: true })
    }
  }, [email, isVerified, navigate])

  useEffect(() => {
    if (!isSuccess) {
      return undefined
    }

    const timerId = window.setTimeout(() => {
      navigate('/login', { replace: true })
    }, 1400)

    return () => window.clearTimeout(timerId)
  }, [isSuccess, navigate])

  function updateField(field: keyof ResetPasswordForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setSubmitted(false)
    setStatusMessage('')
    setServerError('')
    setIsSuccess(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    setStatusMessage('')
    setServerError('')

    if (passwordError || confirmPasswordError) {
      return
    }

    setIsLoading(true)

    try {
      const message = await resetPassword({
        email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      })

      setStatusMessage(message || 'Password berhasil direset. Silakan login kembali.')
      setIsSuccess(true)
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : 'Gagal mereset password. Coba lagi sebentar lagi.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!email || !isVerified) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#050814] p-0 text-slate-200 sm:p-1">
      <div className="mx-auto grid min-h-screen max-w-[1440px] overflow-hidden border-white/10 bg-[#111020] shadow-[0_34px_100px_rgba(0,0,0,0.42)] sm:rounded-[28px] sm:border lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden border-b border-white/10 bg-[#121028] px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:px-16 lg:py-14">
          <div className="absolute -left-28 -top-28 h-[30rem] w-[30rem] rounded-full bg-violet-500/16 blur-3xl" />
          <div className="absolute bottom-16 left-1/4 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex min-h-full flex-col justify-between gap-10">
            <div>
              <Link className="inline-flex items-center gap-3 text-white" to="/login">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500 text-sm font-black shadow-[0_14px_34px_rgba(124,92,255,0.32)]">
                  C
                </span>
                <span className="text-lg font-black tracking-tight">CodingStudy</span>
              </Link>

              <div className="mt-12 max-w-xl animate-auth-fade-up lg:mt-16">
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-violet-300">
                  Reset akses akun
                </p>
                <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                  Buat <span className="text-violet-400">password baru</span>
                </h1>
                <p className="mt-5 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
                  Email <span className="font-semibold text-white">{email}</span> sudah terverifikasi. Sekarang buat password baru untuk akun kamu.
                </p>
              </div>
            </div>

            <p className="relative max-w-xl text-sm leading-6 text-slate-500">
              Pastikan password baru kuat dan belum pernah dipakai sebelumnya.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md animate-auth-fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-500">
              Langkah 3 dari 3
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Reset password</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Masukkan password baru untuk akun kamu.
            </p>

            <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Password baru</span>
                <input
                  className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  placeholder="Minimal 8 karakter"
                  autoComplete="new-password"
                  aria-invalid={Boolean(submitted && passwordError)}
                />
                {submitted && passwordError && <small className="text-sm text-rose-300">{passwordError}</small>}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Konfirmasi password</span>
                <input
                  className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  placeholder="Ulangi password baru"
                  autoComplete="new-password"
                  aria-invalid={Boolean(submitted && confirmPasswordError)}
                />
                {submitted && confirmPasswordError && <small className="text-sm text-rose-300">{confirmPasswordError}</small>}
              </label>

              {(statusMessage || serverError) && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                    serverError
                      ? 'border-rose-400/20 bg-rose-400/10 text-rose-200'
                      : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                  }`}
                >
                  {serverError || statusMessage}
                </div>
              )}

              <button
                className="inline-flex h-12 items-center justify-center rounded-xl bg-violet-500 px-4 font-semibold text-white shadow-[0_16px_36px_rgba(124,92,255,0.35)] transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Menyimpan...' : 'Simpan password baru'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-300">
              Kembali ke{' '}
              <Link className="font-bold text-violet-400 transition hover:text-violet-300" to="/login">
                login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ResetPasswordScreen
