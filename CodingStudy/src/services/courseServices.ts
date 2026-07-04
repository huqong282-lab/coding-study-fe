import { apiFetch } from './api'

export type BackendCourseMentor = {
  id: number
  name: string
  email: string
  role?: string
}

export type BackendCourse = {
  id: string
  mentorId: number
  title: string
  description: string
  price: string
  thumbnailUrl?: string | null
  status: 'DRAFT' | 'PUBLISHED'
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  mentor: BackendCourseMentor
}

export type CourseListQuery = {
  search?: string
  status?: 'DRAFT' | 'PUBLISHED'
  mentorId?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'price' | 'title'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

function buildQueryString(query?: CourseListQuery) {
  if (!query) {
    return ''
  }

  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    params.set(key, String(value))
  })

  const search = params.toString()

  return search ? `?${search}` : ''
}

export async function listCourses(query?: CourseListQuery) {
  const response = await apiFetch<BackendCourse[]>(`/courses${buildQueryString(query)}`)

  return {
    courses: response.data ?? [],
    pagination: response.pagination ?? null,
  }
}

export async function getCourseById(courseId: string) {
  const response = await apiFetch<BackendCourse>(`/courses/${courseId}`)

  if (!response.data) {
    throw new Error('Course response is missing data')
  }

  return response.data
}
