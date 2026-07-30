import { courseCatalog } from '../data/courses'
import type { Course } from '../types/product'
import type { BackendCourse } from '../services/courseServices'

type LanguageProfile = {
  languageId: string
  languageName: string
  level: string
  modules: number
  duration: string
  rating: number
}

const languageProfiles: Record<string, LanguageProfile> = {
  javascript: {
    languageId: 'javascript',
    languageName: 'JavaScript',
    level: 'Frontend',
    modules: 12,
    duration: '6 minggu',
    rating: 4.8,
  },
  typescript: {
    languageId: 'typescript',
    languageName: 'TypeScript',
    level: 'Frontend',
    modules: 11,
    duration: '6 minggu',
    rating: 4.8,
  },
  python: {
    languageId: 'python',
    languageName: 'Python',
    level: 'Data',
    modules: 15,
    duration: '7 minggu',
    rating: 4.9,
  },
  php: {
    languageId: 'php',
    languageName: 'PHP',
    level: 'Backend',
    modules: 10,
    duration: '5 minggu',
    rating: 4.6,
  },
  java: {
    languageId: 'java',
    languageName: 'Java',
    level: 'Backend',
    modules: 13,
    duration: '7 minggu',
    rating: 4.6,
  },
  go: {
    languageId: 'go',
    languageName: 'Go',
    level: 'Cloud',
    modules: 9,
    duration: '5 minggu',
    rating: 4.7,
  },
  sql: {
    languageId: 'sql',
    languageName: 'SQL',
    level: 'Database',
    modules: 8,
    duration: '4 minggu',
    rating: 4.8,
  },
  dart: {
    languageId: 'dart',
    languageName: 'Dart',
    level: 'Mobile',
    modules: 10,
    duration: '6 minggu',
    rating: 4.6,
  },
  kotlin: {
    languageId: 'kotlin',
    languageName: 'Kotlin',
    level: 'Mobile',
    modules: 12,
    duration: '6 minggu',
    rating: 4.7,
  },
}

const templateByLanguage = courseCatalog.reduce<Record<string, Course[]>>((accumulator, course) => {
  const list = accumulator[course.languageId] ?? []
  list.push(course)
  accumulator[course.languageId] = list
  return accumulator
}, {})

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function inferLanguageProfile(course: BackendCourse) {
  const searchableText = normalizeText(`${course.title} ${course.description}`)

  if (searchableText.includes('typescript')) {
    return languageProfiles.typescript
  }

  if (searchableText.includes('python')) {
    return languageProfiles.python
  }

  if (searchableText.includes('php') || searchableText.includes('laravel')) {
    return languageProfiles.php
  }

  if (searchableText.includes('kotlin')) {
    return languageProfiles.kotlin
  }

  if (searchableText.includes('dart') || searchableText.includes('flutter')) {
    return languageProfiles.dart
  }

  if (searchableText.includes('sql') || searchableText.includes('database') || searchableText.includes('query')) {
    return languageProfiles.sql
  }

  if (searchableText.includes('golang') || searchableText.includes(' go ') || searchableText.startsWith('go ') || searchableText.includes(' go api')) {
    return languageProfiles.go
  }

  if (searchableText.includes('java')) {
    return languageProfiles.java
  }

  return languageProfiles.javascript
}

function inferAccess(price: string) {
  const parsedPrice = Number(price)

  if (Number.isFinite(parsedPrice) && parsedPrice <= 0) {
    return 'free' as const
  }

  return 'paid' as const
}

function formatPriceLabel(price: string) {
  const parsedPrice = Number(price)

  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    return 'Gratis'
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(parsedPrice)
}

function scoreFromCourseId(courseId: string) {
  const seed = Array.from(courseId).reduce((total, character) => total + character.charCodeAt(0), 0)
  return 4.5 + (seed % 5) / 10
}

function getTemplate(course: BackendCourse, languageId: string) {
  const templates = templateByLanguage[languageId] ?? []
  if (templates.length === 0) {
    return undefined
  }

  const normalizedTitle = normalizeText(course.title)

  return (
    templates.find((template) => {
      const templateTitle = normalizeText(template.title)
      return (
        templateTitle === normalizedTitle ||
        templateTitle.includes(normalizedTitle) ||
        normalizedTitle.includes(templateTitle)
      )
    }) ?? templates[0]
  )
}

function buildOutcomes(profile: LanguageProfile, title: string) {
  return [
    `Memahami dasar ${profile.languageName} untuk project ${title}`,
    `Membangun workflow belajar yang sesuai level ${profile.level.toLowerCase()}`,
    `Siap lanjut ke praktik lanjutan dan portofolio nyata`,
  ]
}

function buildSyllabus(profile: LanguageProfile, title: string) {
  return [
    `Fundamental ${profile.languageName} untuk ${title}`,
    `Struktur project dan praktik inti`,
    `Latihan implementasi dan mini project`,
  ]
}

export function mapBackendCourse(course: BackendCourse): Course {
  const profile = inferLanguageProfile(course)
  const template = getTemplate(course, profile.languageId)
  const priceLabel = formatPriceLabel(course.price)
  const access = inferAccess(course.price)
  const mentorName = course.mentor?.name || template?.mentor || 'Mentor Coding Study'
  const title = course.title || template?.title || 'Kelas Coding'

  return {
    id: course.id,
    languageId: template?.languageId ?? profile.languageId,
    languageName: template?.languageName ?? profile.languageName,
    title,
    rating: template?.rating ?? scoreFromCourseId(course.id),
    modules: template?.modules ?? profile.modules,
    level: template?.level ?? profile.level,
    duration: template?.duration ?? profile.duration,
    access,
    priceLabel,
    mentor: mentorName,
    description: course.description || template?.description || `Belajar ${profile.languageName} secara terstruktur dan praktis.`,
    outcomes: template?.outcomes ?? buildOutcomes(profile, title),
    syllabus: template?.syllabus ?? buildSyllabus(profile, title),
  }
}

export function mapBackendCourses(courses: BackendCourse[]) {
  return courses.map(mapBackendCourse)
}
