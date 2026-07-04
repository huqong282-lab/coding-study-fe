import { useEffect, useState } from 'react'
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

        setCourses(mapBackendCourses(result.courses))
      } catch (requestError) {
        if (!isActive) {
          return
        }

        const message = requestError instanceof Error ? requestError.message : 'Gagal memuat course'
        setError(message)
        setCourses([])
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
