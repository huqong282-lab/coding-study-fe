import { useEffect, useMemo, useRef, type WheelEvent as ReactWheelEvent } from 'react'
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
  const carouselCourses = useMemo(() => [...courses, ...courses, ...courses], [courses])

  useEffect(() => {
    const rail = railRef.current

    if (!rail) {
      return
    }

    const setWidth = rail.scrollWidth / 3
    rail.scrollLeft = setWidth
  }, [courses])

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
              Semua Jalur
            </button>
            {learningLanguages.map((trackId) => (
              <button
                className={activeTopic === trackId ? 'is-active' : ''}
                key={trackId}
                type="button"
                onClick={() => onSelectTopic(trackId)}
              >
                {getLanguageLabel(trackId)}
              </button>
            ))}
            <button
              className="home-course-filters__more"
              type="button"
              onClick={onShowInterestPanel}
              aria-expanded={isInterestPanelOpen}
            >
              {isInterestPanelOpen ? 'Sembunyikan' : 'Jalur Lainnya'}
            </button>
          </div>
        </div>
      </div>

      {isInterestPanelOpen && (
        <div className="home-interest-panel" aria-label="Tambah minat jalur kelas">
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
