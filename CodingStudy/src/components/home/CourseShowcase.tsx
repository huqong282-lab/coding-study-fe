import { useEffect, useMemo, useRef, useState, type FormEvent, type WheelEvent as ReactWheelEvent } from 'react'
import type { Course } from '../../types/product'

type CourseShowcaseProps = {
  courses: Course[]
  isLoading?: boolean
  error?: string
  activeTopic: string
  learningLanguages: string[]
  languageOptions: Array<{ id: string; name: string }>
  isInterestPanelOpen: boolean
  onToggleLanguage: (languageId: string) => void
  onOpenCourse?: (course: Course) => void
  onOpenAllTopic: () => void
  onSelectTopic: (languageId: string) => void
  onShowInterestPanel: () => void
  getLanguageLabel: (languageId: string) => string
}

const coursePreviewIcons = ['◎', '◈', '⬡', '◌']

function CourseShowcase({
  courses,
  isLoading = false,
  error = '',
  activeTopic,
  learningLanguages,
  languageOptions,
  isInterestPanelOpen,
  onToggleLanguage,
  onOpenCourse,
  onOpenAllTopic,
  onSelectTopic,
  onShowInterestPanel,
  getLanguageLabel,
}: CourseShowcaseProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleCourses = useMemo(() => {
    if (!normalizedSearchQuery) {
      return courses
    }

    return courses.filter((course) => {
      const searchableText = [
        course.title,
        course.mentor,
        course.languageName,
        course.level,
        course.description,
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(normalizedSearchQuery)
    })
  }, [courses, normalizedSearchQuery])
  const carouselCourses = useMemo(() => [...visibleCourses, ...visibleCourses, ...visibleCourses], [visibleCourses])

  useEffect(() => {
    const rail = railRef.current

    if (!rail) {
      return
    }

    const setWidth = rail.scrollWidth / 3
    rail.scrollLeft = setWidth
  }, [visibleCourses])

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const rail = railRef.current

    if (!rail) {
      return
    }

    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return
    }

    event.preventDefault()
    rail.scrollLeft += event.deltaY
  }

  function openCourse(course: Course) {
    onOpenCourse?.(course)
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  function resetSearch() {
    setSearchQuery('')
  }

  return (
    <section className="home-section home-section--courses" id="classes" aria-labelledby="home-course-title">
      <div className="home-section__header">
        <div>
          <p className="home-section-kicker">KATALOG KELAS</p>
          <h2 className="home-section-title" id="home-course-title">
            Kelas Pilihan <span>Terpopuler</span>
          </h2>
        </div>

        <div className="home-course-controls">
          <form className="home-course-search" role="search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari kelas..."
              aria-label="Cari kelas"
            />
            <button type="submit">Cari</button>
          </form>

          <div className="home-course-arrows" aria-hidden="true">
            <button type="button" tabIndex={-1}>
              ←
            </button>
            <button type="button" tabIndex={-1}>
              →
            </button>
          </div>

          <div className="home-course-filters" aria-label="Pilih topik kursus">
            <button className={activeTopic === 'all' ? 'is-active' : ''} type="button" onClick={onOpenAllTopic}>
              Semua
            </button>
            {learningLanguages.map((languageId) => (
              <button
                className={activeTopic === languageId ? 'is-active' : ''}
                key={languageId}
                type="button"
                onClick={() => onSelectTopic(languageId)}
              >
                {getLanguageLabel(languageId)}
              </button>
            ))}
            <button
              className="home-course-filters__more"
              type="button"
              onClick={onShowInterestPanel}
              aria-expanded={isInterestPanelOpen}
            >
              {isInterestPanelOpen ? 'Sembunyikan' : 'Tambah Minat'}
            </button>
          </div>
        </div>
      </div>

      {isInterestPanelOpen && (
        <div className="home-interest-panel" aria-label="Tambah minat bahasa pemrograman">
          {languageOptions.map((item) => {
            const isSelected = learningLanguages.includes(item.id)

            return (
              <button
                className={isSelected ? 'is-selected' : ''}
                key={item.id}
                type="button"
                onClick={() => onToggleLanguage(item.id)}
                aria-pressed={isSelected}
              >
                <span>{item.name}</span>
                <small>{isSelected ? 'Dipilih' : 'Tambah'}</small>
              </button>
            )
          })}
        </div>
      )}

      <div
        className="home-course-rail"
        ref={railRef}
        aria-label="Daftar kelas pilihan"
        role="list"
        onWheel={handleWheel}
      >
        {isLoading ? (
          <div className="home-course-empty-state">
            <strong>Memuat kursus dari backend...</strong>
            <p>Ambil kopi dulu, data course lagi disiapkan.</p>
          </div>
        ) : error ? (
          <div className="home-course-empty-state">
            <strong>Gagal memuat course</strong>
            <p>{error}</p>
          </div>
        ) : normalizedSearchQuery && visibleCourses.length === 0 ? (
          <div className="home-course-empty-state home-course-search-empty">
            <div className="home-course-search-empty__icon" aria-hidden="true">
              <span />
            </div>
            <strong>Kelas tidak ditemukan</strong>
            <p>Coba gunakan kata kunci lain.</p>
            <div className="home-course-empty-actions">
              <button type="button" onClick={resetSearch}>
                Lihat Semua Kelas
              </button>
              <button type="button" onClick={resetSearch}>
                Reset Filter
              </button>
            </div>
          </div>
        ) : carouselCourses.length > 0 ? (
          carouselCourses.map((course, index) => (
            <article
              className="home-course-card"
              key={`${course.id}-${index}`}
              role="button"
              tabIndex={0}
              aria-label={`Lihat detail ${course.title}`}
              onClick={() => openCourse(course)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  openCourse(course)
                }
              }}
            >
              <div className="home-course-card__media" aria-hidden="true">
                <span className={`home-course-card__badge ${course.access === 'free' ? 'is-free' : 'is-paid'}`}>
                  {course.access === 'free' ? 'Hot' : 'Populer'}
                </span>
                <div className="home-course-card__icon">{coursePreviewIcons[index % coursePreviewIcons.length]}</div>
              </div>

              <div className="home-course-card__body">
                <span className="home-course-card__level">{course.level}</span>
                <h3>{course.title}</h3>
                <p>Oleh {course.mentor}</p>
                <div className="home-course-card__meta" aria-label="Informasi harga kelas">
                  <span className={`home-course-card__price ${course.access === 'free' ? 'is-free' : 'is-paid'}`}>
                    {course.priceLabel}
                  </span>
                  <span className="home-course-card__access">{course.access === 'free' ? 'Gratis' : 'Premium'}</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="home-course-empty-state">
            <strong>Belum ada course tersedia</strong>
            <p>Coba lagi sebentar lagi atau cek backend seed data-nya.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default CourseShowcase
