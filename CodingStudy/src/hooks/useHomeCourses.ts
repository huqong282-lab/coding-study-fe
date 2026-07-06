import { useEffect, useMemo, useState } from 'react'
import { useCourseCatalog } from './useCourseCatalog'
import type { Course } from '../types/product'
import type { ProgrammerPosition } from '../types/user'

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  php: 'PHP',
  typescript: 'TypeScript',
  java: 'Java',
  go: 'Go',
  sql: 'SQL',
  dart: 'Dart',
  kotlin: 'Kotlin',
}

const positionLanguageMap: Record<ProgrammerPosition, string[]> = {
  frontend: ['javascript', 'typescript'],
  backend: ['javascript', 'python', 'php', 'go', 'sql'],
  fullstack: ['javascript', 'typescript', 'python', 'php', 'sql'],
  mobile: ['dart', 'kotlin', 'javascript'],
  devops: ['python', 'go', 'php'],
  data: ['python', 'sql', 'java'],
}

export function useHomeCourses(
  selectedProgrammingLanguages: string[],
  programmerPosition: ProgrammerPosition,
) {
  const { courses: courseCatalog, isLoading, error } = useCourseCatalog()
  const [activeTopic, setActiveTopic] = useState('all')
  const [isInterestPanelOpen, setIsInterestPanelOpen] = useState(false)

  const learningLanguages = useMemo(() => {
    if (selectedProgrammingLanguages.length > 0) {
      return selectedProgrammingLanguages
    }

    return positionLanguageMap[programmerPosition] ?? ['javascript', 'python']
  }, [programmerPosition, selectedProgrammingLanguages])

  useEffect(() => {
    if (activeTopic !== 'all' && !learningLanguages.includes(activeTopic)) {
      setActiveTopic('all')
    }
  }, [activeTopic, learningLanguages])

  const displayedCourses = useMemo(() => {
    const selectedSet = new Set(learningLanguages)
    const matchedCourses = courseCatalog.filter((course) => selectedSet.has(course.languageId))

    const filteredCourses =
      activeTopic === 'all'
        ? matchedCourses
        : matchedCourses.filter((course) => course.languageId === activeTopic)

    return filteredCourses.length > 0 ? filteredCourses : courseCatalog.slice(0, 3)
  }, [activeTopic, courseCatalog, learningLanguages])

  const featuredLanguages = learningLanguages.slice(0, 4)
  const languageOptions = Object.entries(languageLabels).map(([id, name]) => ({ id, name }))
  const showInterestPanel = () => setIsInterestPanelOpen((current) => !current)

  function getLanguageLabel(languageId: string) {
    return languageLabels[languageId] ?? languageId
  }

  function openAllTopic() {
    setActiveTopic('all')
  }

  function selectTopic(languageId: string) {
    setActiveTopic(languageId)
  }

  return {
    activeTopic,
    allCourses: courseCatalog,
    displayedCourses: displayedCourses as Course[],
    error,
    featuredLanguages,
    languageOptions,
    isInterestPanelOpen,
    learningLanguages,
    isLoading,
    getLanguageLabel,
    openAllTopic,
    selectTopic,
    showInterestPanel,
  }
}
