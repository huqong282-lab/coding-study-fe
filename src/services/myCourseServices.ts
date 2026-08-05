import { apiFetch } from './api'

export type MyCourseMentor = {
  id: number
  name: string
  email: string
}

export type MyCourseCategory = {
  id: string
  name: string
  description?: string | null
}

export type MyCourseRecord = {
  enrollmentId: string
  paymentStatus: string | null
  purchasedAt: string
  course: {
    id: string
    title: string
    description: string
    thumbnailUrl?: string | null
    price: string
    status: 'DRAFT' | 'PUBLISHED'
    mentor: MyCourseMentor
    category: MyCourseCategory
  }
}

export type ModuleProgressRecord = {
  id: string
  classId: string
  urutan: number
  judul: string
  deskripsi?: string | null
  videoUrl?: string | null
  durationSeconds: number
  watchedSeconds: number
  progress: number
  completed: boolean
  completedAt?: string | null
}

export type EnrolledCourseProgressSummary = {
  progress: number
  totalModules: number
  completedModules: number
  learningMinutes: number
  stage: 'started' | 'finished'
}

export async function listMyCourses(token: string) {
  const response = await apiFetch<MyCourseRecord[]>('/my-courses', {
    token,
  })

  return response.data ?? []
}

export async function listClassModuleProgress(classId: string, token: string) {
  const response = await apiFetch<ModuleProgressRecord[]>(
    `/module-progress/class/${encodeURIComponent(classId)}`,
    {
      token,
    },
  )

  return response.data ?? []
}

export function summarizeClassProgress(modules: ModuleProgressRecord[]): EnrolledCourseProgressSummary {
  const totalModules = modules.length
  const completedModules = modules.filter((module) => module.completed).length
  const progress =
    totalModules > 0
      ? Math.round(modules.reduce((total, module) => total + module.progress, 0) / totalModules)
      : 0
  const learningMinutes = Math.round(
    modules.reduce((total, module) => total + module.watchedSeconds, 0) / 60,
  )

  return {
    progress,
    totalModules,
    completedModules,
    learningMinutes,
    stage: progress >= 100 ? 'finished' : 'started',
  }
}
