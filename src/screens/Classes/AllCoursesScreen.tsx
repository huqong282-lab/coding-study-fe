import { useEffect, useMemo, useState } from 'react'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { listCourses } from '../../services/courseServices'
import type { Course } from '../../types/product'
import type { AppUser } from '../../types/user'
import { mapBackendCourses } from '../../utils/courseMapper'

type AllCoursesScreenProps = {
  user?: AppUser | null
  onLogout: () => void
  onOpenCourse: (course: Course) => void
}

function AllCoursesScreen({ user, onLogout, onOpenCourse }: AllCoursesScreenProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadCourses() {
      setIsLoading(true)
      setError('')

      try {
        const result = await listCourses({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' })

        if (!isActive) {
          return
        }

        setCourses(mapBackendCourses(result.courses))
      } catch (requestError) {
        if (!isActive) {
          return
        }

        setError(requestError instanceof Error ? requestError.message : 'Gagal mengambil data kelas dari backend')
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
  }, [])

  const visibleCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return courses
    }

    return courses.filter((course) =>
      [course.title, course.description, course.languageName, course.level, course.mentor]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [courses, searchQuery])

  return (
    <main className="courses-page">
      <Navbar user={user ?? undefined} onLogout={onLogout} />

      <section className="courses-hero" aria-labelledby="courses-page-title">
        <p className="home-section-kicker">SEMUA KELAS</p>
        <h1 id="courses-page-title">
          Jelajahi Semua <span>Kelas Coding Study</span>
        </h1>
        <p>
          Data kelas di halaman ini diambil langsung dari backend. Pilih kelas yang paling sesuai
          dengan target belajar dan roadmap kariermu.
        </p>
      </section>

      <section className="courses-catalog" aria-label="Daftar semua kelas">
        <div className="courses-toolbar">
          <div>
            <p className="home-section-kicker">KATALOG BACKEND</p>
            <h2>{isLoading ? 'Memuat kelas...' : `${visibleCourses.length} kelas tersedia`}</h2>
          </div>

          <label className="courses-search">
            <span>Cari kelas</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Contoh: React, Python, Backend"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="courses-state">
            <strong>Mengambil data kelas dari backend...</strong>
            <p>Tunggu sebentar, katalog sedang disinkronkan.</p>
          </div>
        ) : error ? (
          <div className="courses-state is-error">
            <strong>Gagal mengambil kelas dari backend</strong>
            <p>{error}</p>
          </div>
        ) : visibleCourses.length === 0 ? (
          <div className="courses-state">
            <strong>Kelas tidak ditemukan</strong>
            <p>
              {courses.length === 0
                ? 'Backend belum mengembalikan data kelas. Pastikan endpoint /courses sudah tersedia dan memiliki data.'
                : 'Coba gunakan kata kunci lain.'}
            </p>
          </div>
        ) : (
          <div className="courses-grid">
            {visibleCourses.map((course) => (
              <article className="courses-card" key={course.id}>
                <div className="courses-card__media">
                  <span className={course.access === 'free' ? 'is-free' : 'is-paid'}>
                    {course.access === 'free' ? 'Gratis' : 'Premium'}
                  </span>
                  <strong>{course.languageName}</strong>
                </div>

                <div className="courses-card__body">
                  <div className="courses-card__meta">
                    <span>{course.level}</span>
                    <span>{course.rating.toFixed(1)} rating</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="courses-card__footer">
                    <strong>{course.priceLabel}</strong>
                    <button type="button" onClick={() => onOpenCourse(course)}>
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}

export default AllCoursesScreen
