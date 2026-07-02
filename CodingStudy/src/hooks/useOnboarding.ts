import { useEffect, useState } from 'react'
import * as onboardingServices from '../services/onboardingServices'
import type { OnboardingCategory } from '../types/user'
import { useFetch } from './useFetch'

type UseOnboardingOptions = {
  accessToken: string
  onCompleted?: () => void
}

const normalizeCategoryKey = (categoryName: string) =>
  categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '')

export function useOnboarding({ accessToken, onCompleted }: UseOnboardingOptions) {
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = useState<string[]>([])
  const [onboardingError, setOnboardingError] = useState('')

  const onboardingCategoriesRequest = useFetch(onboardingServices.getOnboardingCategories)
  const completeOnboardingRequest = useFetch(onboardingServices.completeOnboarding)

  const onboardingCategories = onboardingCategoriesRequest.data ?? []
  const isOnboardingLoading =
    onboardingCategoriesRequest.isLoading || completeOnboardingRequest.isLoading

  useEffect(() => {
    void onboardingCategoriesRequest.execute()
  }, [])

  function toggleProgrammingLanguage(languageId: string) {
    setSelectedProgrammingLanguages((currentLanguages) =>
      currentLanguages.includes(languageId)
        ? currentLanguages.filter((item) => item !== languageId)
        : [...currentLanguages, languageId],
    )
  }

  async function handleContinueLanguageSelection() {
    setOnboardingError('')

    if (selectedProgrammingLanguages.length === 0) {
      setOnboardingError('Pilih minimal 1 kategori sebelum lanjut.')
      return false
    }

    if (onboardingCategories.length === 0) {
      setOnboardingError('Kategori onboarding belum dimuat. Coba lagi sebentar.')
      return false
    }

    const categoryIdMap = new Map(
      onboardingCategories.map((category: OnboardingCategory) => [
        normalizeCategoryKey(category.name),
        category.id,
      ]),
    )

    const selectedCategoryIds = selectedProgrammingLanguages
      .map((languageId) => categoryIdMap.get(languageId))
      .filter((categoryId): categoryId is string => Boolean(categoryId))

    if (selectedCategoryIds.length !== selectedProgrammingLanguages.length) {
      setOnboardingError('Beberapa kategori terpilih tidak ditemukan di backend.')
      return false
    }

    const result = await completeOnboardingRequest.execute(
      { categoryIds: selectedCategoryIds },
      accessToken,
    )

    if (!result) {
      return false
    }

    onCompleted?.()
    return true
  }

  function resetOnboardingState() {
    setSelectedProgrammingLanguages([])
    setOnboardingError('')
    onboardingCategoriesRequest.reset()
    completeOnboardingRequest.reset()
  }

  return {
    selectedProgrammingLanguages,
    onboardingCategories,
    isOnboardingLoading,
    onboardingError,
    toggleProgrammingLanguage,
    handleContinueLanguageSelection,
    resetOnboardingState,
  }
}
