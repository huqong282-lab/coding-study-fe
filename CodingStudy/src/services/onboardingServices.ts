import { apiFetch } from './api'
import type { OnboardingCategory } from '../types/user'

export type CompleteOnboardingPayload = {
  categoryIds: string[]
}

export type CompleteOnboardingResult = {
  message: string
}

function getResponseData<T>(response: unknown): T | undefined {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as { data?: T }).data
  }

  return response as T
}

export async function getOnboardingCategories() {
  const response = await apiFetch<OnboardingCategory[]>('/onboarding/categories')
  const categories = getResponseData<OnboardingCategory[]>(response)

  if (!categories) {
    throw new Error('Onboarding categories response is missing data')
  }

  return categories
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
  const result = getResponseData<CompleteOnboardingResult>(response)

  if (!result) {
    throw new Error('Complete onboarding response is missing data')
  }

  return result
}
