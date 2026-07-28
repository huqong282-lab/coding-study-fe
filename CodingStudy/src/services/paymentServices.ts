import { apiFetch } from './api'

export type CheckoutPaymentPayload = {
  classId: string
}

export type CheckoutPaymentResult = {
  paymentId: string
  orderId: string
  snapToken: string
  redirectUrl: string
}

export async function createCheckoutPayment(payload: CheckoutPaymentPayload, token: string) {
  const response = await apiFetch<CheckoutPaymentResult>('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  })

  if (!response.data) {
    throw new Error('Checkout payment response is missing data')
  }

  return response.data
}
