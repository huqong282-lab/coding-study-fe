import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { courseCatalog } from '../../data/courses'
import type { Course } from '../../types/product'
import type { AppUser } from '../../types/user'

type DashboardStudentProps = {
  user?: AppUser | null
  selectedProgrammingLanguages?: string[]
  onLogout?: () => void
}

type DashboardView = 'overview' | 'courses'
type CourseFilter = 'all' | 'premium' | 'free' | 'started' | 'finished'

type EnrolledCourse = Course & {
  progress: number
  lessonsFinished: number
  learningMinutes: number
}

const courseFilters: { id: CourseFilter; label: string }[] = [
  { id: 'all', label: 'All Courses' },
  { id: 'premium', label: 'Premium' },
  { id: 'free', label: 'Free' },
  { id: 'started', label: 'Started' },
  { id: 'finished', label: 'Finished' },
]

function buildEnrolledCourses(selectedLanguages: string[]): EnrolledCourse[] {
  if (selectedLanguages.length === 0) {
    return []
  }

  return courseCatalog
    .filter((course) => selectedLanguages.includes(course.languageId))
    .slice(0, 4)
    .map((course, index) => {
      const progress = [72, 100, 34, 18][index] ?? 22
      const lessonsFinished = Math.max(1, Math.round((course.modules * progress) / 100))

      return {
        ...course,
        progress,
        lessonsFinished,
        learningMinutes: 85 + index * 45,
      }
    })
}

function DashboardStudent({
  user,
  selectedProgrammingLanguages = [],
  onLogout,
}: DashboardStudentProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeView: DashboardView = tabParam === 'courses' ? 'courses' : 'overview'
  const [activeFilter, setActiveFilter] = useState<CourseFilter>('all')
  const enrolledCourses = useMemo(
    () => buildEnrolledCourses(selectedProgrammingLanguages),
    [selectedProgrammingLanguages],
  )

  const visibleCourses = enrolledCourses.filter((course) => {
    if (activeFilter === 'premium') {
      return course.access === 'paid'
    }

    if (activeFilter === 'free') {
      return course.access === 'free'
    }

    if (activeFilter === 'started') {
      return course.progress > 0 && course.progress < 100
    }

    if (activeFilter === 'finished') {
      return course.progress === 100
    }

    return true
  })

  const stats = {
    myCourses: enrolledCourses.length,
    lessonsFinished: enrolledCourses.reduce((total, course) => total + course.lessonsFinished, 0),
    learningTime: enrolledCourses.reduce((total, course) => total + course.learningMinutes, 0),
  }

  const firstName = user?.name.trim().split(' ')[0] || 'Learner'

  return (
    <main className="student-dashboard-page">
      <Navbar user={user} onLogout={onLogout} />

      <section className="student-dashboard-shell">
        <div className="student-dashboard-heading">
          <div>
            <p className="eyebrow">Student Dashboard</p>
            <h1>Halo, {firstName}</h1>
            <p>Track your career building stats dan lanjutkan kelas yang sedang kamu ikuti.</p>
          </div>
        </div>

        <div className="student-dashboard-tabs" aria-label="Dashboard sections">
          <button
            className={activeView === 'overview' ? 'is-active' : ''}
            type="button"
            onClick={() => setSearchParams({})}
          >
            Overview
          </button>
          <button
            className={activeView === 'courses' ? 'is-active' : ''}
            type="button"
            onClick={() => setSearchParams({ tab: 'courses' })}
          >
            My Courses
          </button>
        </div>

        {activeView === 'overview' ? (
          <section className="student-overview-panel" aria-labelledby="student-overview-title">
            <div className="student-section-title">
              <p className="eyebrow">Overview</p>
              <h2 id="student-overview-title">Track your career building stats</h2>
            </div>

            <div className="student-stat-grid">
              <article>
                <span>My Courses</span>
                <strong>{stats.myCourses}</strong>
                <p>Kelas yang sedang kamu ikuti</p>
              </article>
              <article>
                <span>Lessons Finished</span>
                <strong>{stats.lessonsFinished}</strong>
                <p>Lesson selesai dari semua kelas</p>
              </article>
              <article>
                <span>Learning Time</span>
                <strong>{stats.learningTime}</strong>
                <p>Menit belajar terkumpul</p>
              </article>
            </div>
          </section>
        ) : (
          <section className="student-courses-panel" aria-labelledby="student-courses-title">
            <div className="student-section-title">
              <p className="eyebrow">My Courses</p>
              <h2 id="student-courses-title">Cari kelas yang sudah kamu ikuti</h2>
            </div>

            <div className="student-course-filters" aria-label="Filter my courses">
              {courseFilters.map((filter) => (
                <button
                  className={activeFilter === filter.id ? 'is-active' : ''}
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {visibleCourses.length > 0 ? (
              <div className="student-course-list">
                {visibleCourses.map((course) => (
                  <article className="student-course-card" key={course.id}>
                    <div>
                      <span className="course-tag">{course.access === 'paid' ? 'Premium' : 'Free'}</span>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                    </div>
                    <div className="student-course-meta">
                      <span>{course.lessonsFinished}/{course.modules} lessons</span>
                      <span>{course.learningMinutes} menit</span>
                      <span>{course.progress === 100 ? 'Finished' : 'Started'}</span>
                    </div>
                    <div className="student-progress-track" aria-label={`${course.progress}% progress`}>
                      <span style={{ width: `${course.progress}%` }} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="student-empty-state">
                <strong>Kamu belum mengikuti kelas</strong>
                <p>
                  Pilih kelas dari halaman Library dulu, nanti kelas yang kamu ikuti akan muncul di
                  sini.
                </p>
              </div>
            )}
          </section>
        )}
      </section>

      <Footer />
    </main>
  )
}

export default DashboardStudent
