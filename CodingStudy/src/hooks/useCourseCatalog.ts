import { useEffect, useState } from 'react'
import { courseCatalog } from '../data/courses'
import { listCourses } from '../services/courseServices'
import { mapBackendCourses } from '../utils/courseMapper'
import type { Course } from '../types/product'

export function useCourseCatalog(limit = 100) {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadCourses() {
      setIsLoading(true)
      setError('')

      try {
        const result = await listCourses({ limit, sortBy: 'createdAt', sortOrder: 'desc' })
        if (!isActive) {
          return
        }

        const mappedCourses = mapBackendCourses(result.courses)
        setCourses(mappedCourses.length > 0 ? mappedCourses : courseCatalog)
      } catch (requestError) {
        if (!isActive) {
          return
        }

        console.warn(requestError instanceof Error ? requestError.message : 'Gagal memuat course')
        setError('')
        setCourses(courseCatalog)
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadCourses()

    return () => {
      isActive = false
    }
  }, [limit])

  return {
    courses,
    isLoading,
    error,
  }
}
