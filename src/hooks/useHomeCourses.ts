import { useEffect, useMemo, useState } from 'react'
import { useCourseCatalog } from './useCourseCatalog'
import { careerTrackMap, careerTracks } from '../data/careerTracks'
import type { Course } from '../types/product'
import type { ProgrammerPosition } from '../types/user'

const positionTrackMap: Record<ProgrammerPosition, string[]> = {
  frontend: ['web-development', 'ui-ux-design'],
  backend: ['web-development', 'cloud-devops'],
  fullstack: ['web-development', 'digital-product'],
  mobile: ['apps-development', 'ui-ux-design'],
  devops: ['cloud-devops', 'cyber-security'],
  data: ['data-analysis', 'digital-product'],
}

export function useHomeCourses(
  selectedProgrammingLanguages: string[],
  programmerPosition: ProgrammerPosition,
) {
  const { courses: courseCatalog, isLoading, error } = useCourseCatalog()
  const [activeTopic, setActiveTopic] = useState('all')
  const [isInterestPanelOpen, setIsInterestPanelOpen] = useState(false)

  const learningTracks = useMemo(() => {
    if (selectedProgrammingLanguages.length > 0) {
      const explicitlySelectedTracks = selectedProgrammingLanguages.filter((item) => careerTrackMap.has(item))

      if (explicitlySelectedTracks.length > 0) {
        return explicitlySelectedTracks
      }

      const selectedLanguageSet = new Set(selectedProgrammingLanguages)
      const matchedTracks = careerTracks
        .filter((track) => track.courseLanguageIds.some((languageId) => selectedLanguageSet.has(languageId)))
        .map((track) => track.id)

      if (matchedTracks.length > 0) {
        return matchedTracks
      }
    }

    return positionTrackMap[programmerPosition] ?? ['web-development', 'data-analysis', 'apps-development']
  }, [programmerPosition, selectedProgrammingLanguages])

  useEffect(() => {
    if (activeTopic !== 'all' && !learningTracks.includes(activeTopic)) {
      setActiveTopic('all')
    }
  }, [activeTopic, learningTracks])

  const displayedCourses = useMemo(() => {
    const activeTracks =
      activeTopic === 'all'
        ? learningTracks
        : learningTracks.includes(activeTopic)
          ? [activeTopic]
          : []
    const selectedLanguageIds = new Set(
      activeTracks.flatMap((trackId) => careerTrackMap.get(trackId)?.courseLanguageIds ?? []),
    )

    const filteredCourses = courseCatalog.filter((course) => selectedLanguageIds.has(course.languageId))

    return filteredCourses.length > 0 ? filteredCourses : courseCatalog.slice(0, 3)
  }, [activeTopic, courseCatalog, learningTracks])

  const featuredLanguages = learningTracks.slice(0, 4)
  const languageOptions = careerTracks.map(({ id, name }) => ({ id, name }))
  const showInterestPanel = () => setIsInterestPanelOpen((current) => !current)

  function getLanguageLabel(trackId: string) {
    return careerTrackMap.get(trackId)?.name ?? trackId
  }

  function openAllTopic() {
    setActiveTopic('all')
  }

  function selectTopic(trackId: string) {
    setActiveTopic(trackId)
  }

  return {
    activeTopic,
    allCourses: courseCatalog,
    displayedCourses: displayedCourses as Course[],
    error,
    featuredLanguages,
    languageOptions,
    isInterestPanelOpen,
    learningLanguages: learningTracks,
    isLoading,
    getLanguageLabel,
    openAllTopic,
    selectTopic,
    showInterestPanel,
  }
}
