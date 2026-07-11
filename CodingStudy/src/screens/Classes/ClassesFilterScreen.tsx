import { useMemo, useState } from 'react'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { careerTrackMap, careerTracks } from '../../data/careerTracks'
import { useCourseCatalog } from '../../hooks/useCourseCatalog'
import type { Course } from '../../types/product'
import type { AppUser } from '../../types/user'

type ClassesFilterScreenProps = {
  user?: AppUser | null
  onLogout: () => void
  onOpenCourse: (course: Course) => void
}

type SortMode = 'popular' | 'promo' | 'lowest' | 'highest'

const sortOptions: Array<{ id: SortMode; label: string }> = [
  { id: 'popular', label: 'Populer' },
  { id: 'promo', label: 'Harga Promo' },
  { id: 'lowest', label: 'Harga Terendah' },
  { id: 'highest', label: 'Harga Tertinggi' },
]

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  sql: 'SQL',
  dart: 'Dart',
  kotlin: 'Kotlin',
  php: 'PHP',
  go: 'Go',
}

function getCoursePrice(course: Course) {
  if (course.access === 'free') {
    return 0
  }

  const numericPrice = Number(course.priceLabel.replace(/[^\d]/g, ''))

  return Number.isFinite(numericPrice) ? numericPrice : 0
}

function ClassesFilterScreen({ user, onLogout, onOpenCourse }: ClassesFilterScreenProps) {
  const { courses, isLoading, error } = useCourseCatalog()
  const [selectedTrackId, setSelectedTrackId] = useState('all')
  const [selectedLanguageId, setSelectedLanguageId] = useState('all')
  const [sortMode, setSortMode] = useState<SortMode>('popular')

  const selectedTrack = selectedTrackId === 'all' ? null : careerTrackMap.get(selectedTrackId)

  const languageOptions = useMemo(() => {
    const languageIds =
      selectedTrackId === 'all'
        ? Array.from(new Set(careerTracks.flatMap((track) => track.courseLanguageIds)))
        : careerTrackMap.get(selectedTrackId)?.courseLanguageIds ?? []

    return ['all', ...languageIds]
  }, [selectedTrackId])

  const visibleTrackCourses = useMemo(() => {
    return selectedLanguageId === 'all'
      ? courses
      : courses.filter((course) => course.languageId === selectedLanguageId)
  }, [courses, selectedLanguageId])

  const filteredCourses = useMemo(() => {
    const trackLanguageIds =
      selectedTrackId === 'all'
        ? new Set(careerTracks.flatMap((track) => track.courseLanguageIds))
        : new Set(careerTrackMap.get(selectedTrackId)?.courseLanguageIds ?? [])

    const trackCourses = courses.filter((course) => trackLanguageIds.has(course.languageId))
    const languageFilteredCourses =
      selectedLanguageId === 'all'
        ? trackCourses
        : trackCourses.filter((course) => course.languageId === selectedLanguageId)
    const promoFilteredCourses =
      sortMode === 'promo' ? languageFilteredCourses.filter((course) => course.access === 'paid') : languageFilteredCourses

    return [...promoFilteredCourses].sort((firstCourse, secondCourse) => {
      if (sortMode === 'popular') {
        return secondCourse.rating - firstCourse.rating
      }

      if (sortMode === 'highest') {
        return getCoursePrice(secondCourse) - getCoursePrice(firstCourse)
      }

      return getCoursePrice(firstCourse) - getCoursePrice(secondCourse)
    })
  }, [courses, selectedLanguageId, selectedTrackId, sortMode])

  function handleSelectTrack(trackId: string) {
    setSelectedTrackId(trackId)
    setSelectedLanguageId('all')
  }

  return (
    <main className="classes-page">
      <Navbar user={user ?? undefined} onLogout={onLogout} />

      <section className="classes-hero" aria-labelledby="classes-title">
        <p className="home-section-kicker">KATALOG KELAS</p>
        <h1 id="classes-title">
          Pilih Jalur Belajar <span>Sesuai Kariermu</span>
        </h1>
        <p>
          Temukan kelas berdasarkan bidang yang ingin kamu tekuni, mulai dari Web Development,
          Data Analysis, Apps Development, sampai desain produk digital.
        </p>
      </section>

      <section className="classes-track-section" aria-label="Kategori kelas">
        <div className="classes-filter-panel" aria-label="Filter kelas">
          <label className="classes-level-filter">
            <span>Bahasa Pemrograman {selectedTrack ? `- ${selectedTrack.name}` : ''}</span>
            <select value={selectedLanguageId} onChange={(event) => setSelectedLanguageId(event.target.value)}>
              {languageOptions.map((languageId) => (
                <option key={languageId} value={languageId}>
                  {languageId === 'all' ? 'Semua Bahasa' : languageLabels[languageId] ?? languageId}
                </option>
              ))}
            </select>
          </label>

          <div className="classes-sort-filter" aria-label="Urutkan kelas">
            {sortOptions.map((option) => (
              <button
                className={sortMode === option.id ? 'is-active' : ''}
                key={option.id}
                type="button"
                onClick={() => setSortMode(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="classes-track-grid">
          {careerTracks.map((track, index) => {
            const trackCourses = visibleTrackCourses.filter((course) => track.courseLanguageIds.includes(course.languageId))
            const isSelected = selectedTrackId === track.id

            return (
              <article className={`classes-track-card ${isSelected ? 'is-selected' : ''}`} key={track.id}>
                <div className="classes-track-card__top">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <small>{trackCourses.length || 'Soon'} kelas</small>
                </div>
                <h2>{track.name}</h2>
                <p>{track.summary}</p>
                <div className="classes-track-card__meta">
                  <span>Mentor expert</span>
                  <span>Project based</span>
                </div>
                <button
                  className="btn btn-primary classes-track-card__button"
                  type="button"
                  onClick={() => handleSelectTrack(isSelected ? 'all' : track.id)}
                >
                  {isSelected ? 'Semua Jalur' : 'Pilih Jalur'}
                </button>
              </article>
            )
          })}
        </div>

        <div className="classes-course-results" aria-label="Hasil filter kelas">
          <div className="classes-course-results__header">
            <div>
              <p className="home-section-kicker">HASIL FILTER</p>
              <h2>{filteredCourses.length} kelas tersedia</h2>
            </div>
            <span>
              {selectedTrack?.name ?? 'Semua jalur'} -{' '}
              {selectedLanguageId === 'all' ? 'Semua bahasa' : languageLabels[selectedLanguageId] ?? selectedLanguageId}
            </span>
          </div>

          <div className="classes-course-list">
            {filteredCourses.map((course) => (
              <article className="classes-course-card" key={course.id}>
                <div className="classes-course-card__media" aria-hidden="true">
                  <span>{course.access === 'free' ? 'Free' : 'Promo'}</span>
                </div>
                <div className="classes-course-card__body">
                  <div className="classes-course-card__top">
                    <span>{course.level}</span>
                    <strong>{course.rating.toFixed(1)}</strong>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="classes-course-card__footer">
                    <strong>{course.priceLabel}</strong>
                    <button type="button" onClick={() => onOpenCourse(course)}>
                      Detail
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="classes-state">
            <strong>Memuat kelas...</strong>
            <p>Data course sedang ditarik dari backend.</p>
          </div>
        )}

        {error && (
          <div className="classes-state is-error">
            <strong>Gagal memuat kelas</strong>
            <p>{error}</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}

export default ClassesFilterScreen
