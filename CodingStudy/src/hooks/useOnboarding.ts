import { useEffect, useState } from 'react'
import * as onboardingServices from '../services/onboardingServices'
import type { OnboardingCategory } from '../types/user'
import { useFetch } from './useFetch'

type UseOnboardingOptions = {
  accessToken: string
  onCompleted?: () => void
}

export const normalizeCategoryKey = (categoryName: string) =>
  categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '')

const localOnboardingCategories: OnboardingCategory[] = [
  { id: 'javascript', name: 'JavaScript', description: 'Bahasa pemrograman untuk membangun website interaktif.' },
  { id: 'typescript', name: 'TypeScript', description: 'JavaScript dengan static typing untuk kode yang lebih aman.' },
  { id: 'python', name: 'Python', description: 'Bahasa serbaguna untuk web, AI, data, dan automation.' },
  { id: 'php', name: 'PHP', description: 'Bahasa populer untuk web development dan backend.' },
  { id: 'go', name: 'Go', description: 'Bahasa cepat untuk backend, microservices, dan cloud.' },
  { id: 'java', name: 'Java', description: 'Bahasa populer untuk enterprise dan Android.' },
  { id: 'kotlin', name: 'Kotlin', description: 'Bahasa modern untuk Android dan backend.' },
  { id: 'dart', name: 'Dart', description: 'Bahasa untuk Flutter dan aplikasi multiplatform.' },
  { id: 'sql', name: 'SQL', description: 'Bahasa query untuk mengelola database.' },
]

export function useOnboarding({ accessToken, onCompleted }: UseOnboardingOptions) {
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = useState<string[]>([])
  const [onboardingError, setOnboardingError] = useState('')

  const onboardingCategoriesRequest = useFetch(onboardingServices.getOnboardingCategories)
  const completeOnboardingRequest = useFetch(onboardingServices.completeOnboarding)

  const backendOnboardingCategories = onboardingCategoriesRequest.data ?? []
  const onboardingCategories =
    backendOnboardingCategories.length > 0
      ? backendOnboardingCategories
      : localOnboardingCategories
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

    if (backendOnboardingCategories.length === 0) {
      setOnboardingError('Kategori onboarding dari backend belum tersedia. Coba lagi sebentar.')
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
    setSelectedProgrammingLanguages,
    handleContinueLanguageSelection,
    resetOnboardingState,
  }
}
