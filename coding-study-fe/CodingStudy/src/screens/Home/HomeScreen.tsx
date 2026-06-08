import { useEffect, useMemo, useState } from 'react'
import { courseCatalog, languageLabels } from '../../data/courseCatalog'

type Language = 'id' | 'en'

type HomeScreenProps = {
  language?: Language
  programmerPosition?: string
  user?: {
    name: string
    email: string
  }
  selectedProgrammingLanguages?: string[]
  onToggleLanguage?: (languageId: string) => void
  onLanguageChange?: (language: Language) => void
  onProgrammerPositionChange?: (position: string) => void
  onLogout?: () => void
  onOpenCourse?: (courseId: string) => void
}

const languageOptions = Object.entries(languageLabels).map(([id, name]) => ({ id, name }))

const positionLanguageMap: Record<string, string[]> = {
  frontend: ['javascript', 'typescript'],
  backend: ['javascript', 'python', 'go', 'sql'],
  fullstack: ['javascript', 'typescript', 'python', 'sql'],
  mobile: ['dart', 'kotlin', 'javascript'],
  devops: ['python', 'go'],
  data: ['python', 'sql', 'java'],
}

function normalizeSelectedLanguages(selectedLanguages: string[], programmerPosition: string) {
  if (selectedLanguages.length > 0) {
    return selectedLanguages
  }

  return positionLanguageMap[programmerPosition] ?? ['javascript', 'python']
}

function HomeScreen({
  programmerPosition = 'frontend',
  user = { name: 'Raka Pratama', email: 'raka@codingstudy.dev' },
  selectedProgrammingLanguages = [],
  onToggleLanguage,
  onLogout,
  onOpenCourse,
}: HomeScreenProps) {
  const learningLanguages = normalizeSelectedLanguages(
    selectedProgrammingLanguages,
    programmerPosition,
  )
  const [activeTopic, setActiveTopic] = useState('all')
  const [isInterestPanelOpen, setIsInterestPanelOpen] = useState(false)

  useEffect(() => {
    if (activeTopic !== 'all' && !learningLanguages.includes(activeTopic)) {
      setActiveTopic('all')
    }
  }, [activeTopic, learningLanguages])

  const visibleCourses = useMemo(() => {
    const selectedSet = new Set(learningLanguages)
    const matchedCourses = courseCatalog.filter((course) => selectedSet.has(course.languageId))

    if (activeTopic === 'all') {
      return matchedCourses
    }

    return matchedCourses.filter((course) => course.languageId === activeTopic)
  }, [activeTopic, learningLanguages])

  const displayedCourses = visibleCourses.length > 0 ? visibleCourses : courseCatalog.slice(0, 3)
  const firstName = user.name.trim().split(' ')[0] || 'Learner'
  const avatarInitial = firstName.charAt(0).toUpperCase()
  const totalFreeCourses = courseCatalog.filter((course) => course.access === 'free').length
  const totalPaidCourses = courseCatalog.length - totalFreeCourses

  return (
    <main className="home-page">
      <header className="home-navbar" aria-label="Main navigation">
        <a className="home-logo" href="#top" aria-label="Coding Study home">
          <span>CS</span>
          Coding Study
        </a>

        <nav className="home-nav-links" aria-label="Learning navigation">
          <a href="#classes">Kelas Saya</a>
          <a href="#library">Library</a>
        </nav>

        <div className="home-nav-actions">
          <label className="home-search">
            <span>Cari kursus</span>
            <input type="search" placeholder="React, Python, SQL..." />
          </label>
          <button className="home-avatar-button" type="button" aria-label={`Profil ${user.name}`}>
            {avatarInitial}
          </button>
        </div>
      </header>

      <section className="home-welcome" id="top">
        <div className="home-welcome-copy">
          <p className="home-greeting">👋 Selamat datang, {firstName}!</p>
          <p className="home-profile-email">{user.email}</p>
          <p className="home-headline">
            Dashboard ini sudah siap dipakai dengan alur dummy yang lebih rapi, termasuk detail
            kelas gratis dan berbayar.
          </p>

          <div className="home-focus-row" aria-label="Fokus belajar saat ini">
            <span>Fokus belajarmu:</span>
            {learningLanguages.slice(0, 4).map((languageId) => (
              <strong key={languageId}>{languageLabels[languageId] ?? languageId}</strong>
            ))}
          </div>
        </div>

        <div className="home-snapshot" aria-label="Ringkasan kelas">
          <div>
            <span>Total kelas</span>
            <strong>{courseCatalog.length}</strong>
          </div>
          <div>
            <span>Gratis</span>
            <strong>{totalFreeCourses}</strong>
          </div>
          <div>
            <span>Berbayar</span>
            <strong>{totalPaidCourses}</strong>
          </div>
          <button className="btn btn-secondary" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </section>

      <section className="home-content" id="classes">
        <div className="topic-filter" aria-label="Pilih topik kursus">
          <span>Pilih topik</span>
          <button
            className={activeTopic === 'all' ? 'is-active' : ''}
            type="button"
            onClick={() => setActiveTopic('all')}
          >
            Semua
          </button>
          {learningLanguages.map((languageId) => (
            <button
              className={activeTopic === languageId ? 'is-active' : ''}
              key={languageId}
              type="button"
              onClick={() => setActiveTopic(languageId)}
            >
              {languageLabels[languageId] ?? languageId}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsInterestPanelOpen((current) => !current)}
            aria-expanded={isInterestPanelOpen}
          >
            + Tambah minat
          </button>
        </div>

        {isInterestPanelOpen && (
          <div className="interest-panel" aria-label="Tambah minat bahasa pemrograman">
            <div>
              <strong>Pilih bahasa tambahan</strong>
              <p>Rekomendasi kelas akan langsung menyesuaikan minat barumu.</p>
            </div>
            <div className="interest-option-grid">
              {languageOptions.map((item) => {
                const isSelected = selectedProgrammingLanguages.includes(item.id)

                return (
                  <button
                    className={isSelected ? 'is-selected' : ''}
                    key={item.id}
                    type="button"
                    onClick={() => onToggleLanguage?.(item.id)}
                    aria-pressed={isSelected}
                  >
                    <span>{item.name}</span>
                    <small>{isSelected ? 'Dipilih' : 'Tambah'}</small>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <section className="course-recommendation" id="library" aria-labelledby="recommendation-title">
          <div className="recommendation-heading">
            <p className="eyebrow">🎯 Rekomendasi untukmu</p>
            <h1 id="recommendation-title">Pilih kelas lalu lihat detailnya dulu</h1>
            <p className="recommendation-copy">
              Setiap kelas akan membuka halaman detail berisi status gratis atau berbayar sebelum
              kamu lanjut ke belajar.
            </p>
          </div>

          <div className="course-card-grid">
            {displayedCourses.map((course) => (
              <article className="recommendation-card" key={course.id}>
                <div className="recommendation-card-top">
                  <span className="course-tag">{course.languageName}</span>
                  <span className={`price-pill ${course.access === 'free' ? 'is-free' : 'is-paid'}`}>
                    {course.priceLabel}
                  </span>
                </div>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>⭐ {course.rating}</span>
                  <span>{course.modules} modul</span>
                  <span>{course.duration}</span>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => onOpenCourse?.(course.id)}
                >
                  Lihat Detail
                </button>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}

export default HomeScreen
