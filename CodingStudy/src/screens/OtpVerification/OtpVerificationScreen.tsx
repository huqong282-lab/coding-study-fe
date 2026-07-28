import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { otpVerificationServices } from '../../services/otpVerificationServices'

const OTP_LENGTH = 6
const RESEND_WAIT_SECONDS = 60

type VerificationStatus = 'idle' | 'loading' | 'error' | 'success'

function OtpVerificationScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const email = typeof location.state?.email === 'string' ? location.state.email.trim() : ''
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [secondsLeft, setSecondsLeft] = useState(RESEND_WAIT_SECONDS)
  const [status, setStatus] = useState<VerificationStatus>('idle')
  const [message, setMessage] = useState('')
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const isComplete = otp.every(Boolean)
  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (!email) {
      navigate('/register', { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    if (secondsLeft === 0) return undefined

    const timerId = window.setTimeout(() => {
      setSecondsLeft((currentSeconds) => currentSeconds - 1)
    }, 1000)

    return () => window.clearTimeout(timerId)
  }, [secondsLeft])

  useEffect(() => {
    if (!isOtpVerified) {
      return undefined
    }

    const redirectTimer = window.setTimeout(() => {
      navigate('/login', { replace: true })
    }, 1200)

    return () => window.clearTimeout(redirectTimer)
  }, [isOtpVerified, navigate])

  function focusInput(index: number) {
    inputRefs.current[index]?.focus()
  }

  function updateOtp(nextOtp: string[]) {
    setOtp(nextOtp)
    setIsOtpVerified(false)
    if (status !== 'idle') {
      setStatus('idle')
      setMessage('')
    }
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, '')

    if (!digits) {
      const nextOtp = [...otp]
      nextOtp[index] = ''
      updateOtp(nextOtp)
      return
    }

    const nextOtp = [...otp]
    digits.slice(0, OTP_LENGTH - index).split('').forEach((digit, digitOffset) => {
      nextOtp[index + digitOffset] = digit
    })
    updateOtp(nextOtp)
    focusInput(Math.min(index + digits.length, OTP_LENGTH - 1))
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      event.preventDefault()
      const nextOtp = [...otp]
      nextOtp[index - 1] = ''
      updateOtp(nextOtp)
      focusInput(index - 1)
    }

    if (event.key === 'ArrowLeft' && index > 0) focusInput(index - 1)
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) focusInput(index + 1)
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const pastedOtp = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pastedOtp) return

    const nextOtp = Array(OTP_LENGTH).fill('')
    pastedOtp.split('').forEach((digit, index) => {
      nextOtp[index] = digit
    })
    updateOtp(nextOtp)
    focusInput(Math.min(pastedOtp.length, OTP_LENGTH - 1))
  }

  async function handleVerify() {
    if (!isComplete) {
      setStatus('error')
      setMessage('Masukkan 6 digit kode OTP terlebih dahulu.')
      focusInput(otp.findIndex((digit) => !digit))
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await otpVerificationServices.verifyOtp(email, otp.join(''))
      setStatus('success')
      setMessage(response.message || 'Kode OTP berhasil diverifikasi.')
      setIsOtpVerified(true)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Verifikasi OTP gagal.')
    }
  }

  async function handleResend() {
    if (secondsLeft > 0) return

    setStatus('loading')
    setMessage('')
    setIsOtpVerified(false)

    try {
      const response = await otpVerificationServices.resendOtp(email)
      setSecondsLeft(RESEND_WAIT_SECONDS)
      setStatus('success')
      setMessage(response.message || 'Kode OTP baru telah dikirim ke email kamu.')
      setOtp(Array(OTP_LENGTH).fill(''))
      focusInput(0)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Gagal mengirim ulang OTP.')
    }
  }

  if (!email) {
    return null
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-slate-300 sm:px-6 sm:py-10">
      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-900 px-5 py-12 shadow-2xl sm:px-10">
        <div className="pointer-events-none absolute -left-28 -top-24 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />

        <section className="relative w-full max-w-lg" aria-labelledby="otp-title">
          <div className="rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-violet-300/20 bg-violet-500/15 text-xl text-violet-200 shadow-lg">
                #
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.32em] text-violet-300/80">Keamanan akun</p>
              <h1 id="otp-title" className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Verifikasi OTP</h1>
              <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                Kode OTP telah dikirim ke <span className="font-semibold text-slate-200">{email}</span>. Masukkan kode 6 digit untuk melanjutkan.
              </p>
            </div>

            <div className="grid gap-3" aria-label="Input kode OTP">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => { inputRefs.current[index] = element }}
                    className="h-11 w-9 shrink-0 rounded-xl border border-white/10 bg-white/5 text-center text-lg font-bold text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/70 focus:ring-4 focus:ring-violet-400/10 sm:h-12 sm:w-11 sm:text-xl"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    aria-label={`Digit OTP ke-${index + 1}`}
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleChange(index, event)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={handlePaste}
                    disabled={status === 'loading'}
                  />
                ))}
              </div>
              <p className="text-center text-sm text-slate-400">Kirim ulang OTP tersedia dalam <span className="font-semibold text-violet-300">{formattedTime}</span></p>
            </div>

            {status !== 'idle' && message && (
              <div className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${status === 'error' ? 'border-rose-400/20 bg-rose-400/10 text-rose-200' : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'}`} role="status">
                {message}
              </div>
            )}

            <div className="mt-6 grid gap-3">
              <button
                className="inline-flex h-12 items-center justify-center rounded-xl bg-violet-500 px-4 font-semibold text-white shadow-lg transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                onClick={handleVerify}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Memverifikasi...' : 'Verifikasi'}
              </button>
              <button
                className="h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-violet-300 transition hover:border-violet-300/30 hover:bg-violet-500/10 hover:text-violet-200 disabled:cursor-not-allowed disabled:text-slate-500"
                type="button"
                onClick={handleResend}
                disabled={secondsLeft > 0 || status === 'loading'}
              >
                {secondsLeft > 0 ? `Kirim Ulang OTP (${formattedTime})` : 'Kirim Ulang OTP'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default OtpVerificationScreen
