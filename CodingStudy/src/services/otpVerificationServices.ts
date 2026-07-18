import { apiFetch } from './api'

type OtpVerificationResult = {
  message: string
}

async function verifyOtp(email: string, otpCode: string) {
  return apiFetch<OtpVerificationResult>('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp: otpCode }),
  })
}

async function resendOtp(email: string) {
  return apiFetch<OtpVerificationResult>('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export const otpVerificationServices = {
  verifyOtp,
  resendOtp,
}
