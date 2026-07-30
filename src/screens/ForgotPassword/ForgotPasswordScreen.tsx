import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../../services/api'
import { requestPasswordReset } from '../../services/authServices'

type ForgotPasswordForm = {
  email: string
}

const initialForm: ForgotPasswordForm = {
  email: '',
}

const resetSteps = [
  {
    number: '1',
    title: 'Masukkan email',
    description: 'Gunakan email akun manual, bukan Google Account.',
  },
  {
    number: '2',
    title: 'Cek inbox kamu',
    description: 'Kode OTP reset berlaku selama 10 menit.',
  },
  {
    number: '3',
    title: 'Buat password baru',
    description: 'Minimal 8 karakter, lalu masuk kembali.',
  },
]

function ForgotPasswordScreen() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [serverError, setServerError] = useState('')

  const emailError = useMemo(() => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Masukkan email yang valid.'
    }

    return ''
  }, [form.email])

  function updateEmail(event: ChangeEvent<HTMLInputElement>) {
    setForm({ email: event.target.value })
    setSubmitted(false)
    setStatusMessage('')
    setServerError('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    setStatusMessage('')
    setServerError('')

    if (emailError) {
      return
    }

    setIsLoading(true)

    try {
      const message = await requestPasswordReset({ email: form.email.trim() })
      setStatusMessage(message || 'Kode OTP reset berhasil dikirim ke email kamu.')
      navigate('/forgot-password/verify', {
        replace: true,
        state: { email: form.email.trim() },
      })
    } catch (error) {
      setServerError(
        error instanceof ApiError
          ? error.message
          : 'Gagal mengirim OTP reset. Coba lagi sebentar lagi.',
      )
    } finally {
      setIsLoading(false)
    }
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
                  Lupa <span className="text-violet-400">Password</span> kamu?
                </h1>
                <p className="mt-5 max-w-lg text-base leading-8 text-slate-300 sm:text-lg">
                  Tenang, itu bisa terjadi. Masukkan email yang terdaftar dan kami kirimkan kode OTP
                  untuk membuat password baru.
                </p>
              </div>

              <div className="mt-10 grid max-w-xl gap-4 animate-auth-fade-up [animation-delay:120ms]">
                {resetSteps.map((step, index) => (
                  <div
                    className={`flex items-center gap-4 rounded-xl border px-4 py-4 ${
                      index === 0
                        ? 'border-violet-400/60 bg-violet-500/8'
                        : 'border-white/10 bg-white/[0.03]'
                    }`}
                    key={step.number}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-black ${
                        index === 0 ? 'bg-violet-500 text-white' : 'bg-violet-500/10 text-violet-300/60'
                      }`}
                    >
                      {step.number}
                    </span>
                    <div className="min-w-0">
                      <strong className="block text-sm font-black text-white">{step.title}</strong>
                      <p className="mt-1 text-sm text-slate-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="relative max-w-xl text-sm leading-6 text-slate-500">
              Pastikan akun kamu terdaftar secara manual, bukan melalui Google Account.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-md animate-auth-fade-up">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-500">
              Langkah 1 dari 3
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Reset password</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Masukkan email yang kamu gunakan untuk mendaftar.
            </p>

            <form className="mt-8 grid gap-6" onSubmit={handleSubmit} noValidate>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-slate-300">Email</span>
                <input
                  className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateEmail}
                  placeholder="nama@email.com"
                  autoComplete="email"
                  aria-invalid={Boolean(submitted && emailError)}
                />
                {submitted && emailError && <small className="text-sm text-rose-300">{emailError}</small>}
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
                {isLoading ? 'Mengirim...' : 'Kirim OTP reset'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-300">
              Sudah ingat password?{' '}
              <Link className="font-bold text-violet-400 transition hover:text-violet-300" to="/login">
                Masuk di sini
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ForgotPasswordScreen
