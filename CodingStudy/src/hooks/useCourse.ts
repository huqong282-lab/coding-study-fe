import { useEffect, useState } from 'react'
import { getCourseById } from '../services/courseServices'
import { mapBackendCourse } from '../utils/courseMapper'
import type { Course } from '../types/product'

export function useCourse(courseId?: string) {
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    if (!courseId) {
      setCourse(null)
      setIsLoading(false)
      setError('Course tidak ditemukan')
      return () => {
        isActive = false
      }
    }

    async function loadCourse() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getCourseById(courseId)
        if (!isActive) {
          return
        }

        setCourse(mapBackendCourse(result))
      } catch (requestError) {
        if (!isActive) {
          return
        }

        const message = requestError instanceof Error ? requestError.message : 'Gagal memuat detail course'
        setError(message)
        setCourse(null)
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadCourse()

    return () => {
      isActive = false
    }
  }, [courseId])

  return {
    course,
    isLoading,
    error,
  }
}
