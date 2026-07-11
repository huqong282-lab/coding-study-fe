import { apiFetch } from './api'

export type OnboardingCategory = {
  id: string
  name: string
  description?: string | null
}

export type CompleteOnboardingPayload = {
  categoryIds: string[]
}

export type CompleteOnboardingResult = {
  message: string
}

export async function getOnboardingCategories() {
  const response = await apiFetch<OnboardingCategory[]>('/onboarding/categories')

  if (!response.data) {
    throw new Error('Onboarding categories response is missing data')
  }

  return response.data
}

export async function completeOnboarding(
  payload: CompleteOnboardingPayload,
  token: string,
) {
  const response = await apiFetch<CompleteOnboardingResult>('/onboarding/complete', {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  })

  if (!response.data) {
    throw new Error('Complete onboarding response is missing data')
  }

  return response.data
}
