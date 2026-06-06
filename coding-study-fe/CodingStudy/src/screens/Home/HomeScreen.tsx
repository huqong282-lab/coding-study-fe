import { useEffect, useMemo, useState } from 'react'

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
}

type Course = {
  id: number
  languageId: string
  languageName: string
  title: string
  rating: number
  modules: number
  level: string
}

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript',
  python: 'Python',
  typescript: 'TypeScript',
  java: 'Java',
  go: 'Go',
  sql: 'SQL',
  dart: 'Dart',
  kotlin: 'Kotlin',
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

const recommendedCourses: Course[] = [
  {
    id: 1,
    languageId: 'javascript',
    languageName: 'JavaScript',
    title: 'JavaScript Dasar',
    rating: 4.8,
    modules: 12,
    level: 'Pemula',
  },
  {
    id: 2,
    languageId: 'python',
    languageName: 'Python',
    title: 'Python Untuk Data',
    rating: 4.9,
    modules: 15,
    level: 'Data',
  },
  {
    id: 3,
    languageId: 'javascript',
    languageName: 'JavaScript',
    title: 'Belajar Node.js',
    rating: 4.7,
    modules: 10,
    level: 'Backend',
  },
  {
    id: 4,
    languageId: 'typescript',
    languageName: 'TypeScript',
    title: 'TypeScript Modern',
    rating: 4.8,
    modules: 11,
    level: 'Frontend',
  },
  {
    id: 5,
    languageId: 'java',
    languageName: 'Java',
    title: 'Java OOP Praktis',
    rating: 4.6,
    modules: 13,
    level: 'Backend',
  },
  {
    id: 6,
    languageId: 'go',
    languageName: 'Go API Service',
    title: 'Go API Service',
    rating: 4.7,
    modules: 9,
    level: 'Cloud',
  },
  {
    id: 7,
    languageId: 'sql',
    languageName: 'SQL',
    title: 'SQL Query Dasar',
    rating: 4.8,
    modules: 8,
    level: 'Database',
  },
  {
    id: 8,
    languageId: 'dart',
    languageName: 'Dart',
    title: 'Dart Untuk Flutter',
    rating: 4.6,
    modules: 10,
    level: 'Mobile',
  },
  {
    id: 9,
    languageId: 'kotlin',
    languageName: 'Kotlin',
    title: 'Kotlin Android',
    rating: 4.7,
    modules: 12,
    level: 'Mobile',
  },
]

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
    const matchedCourses = recommendedCourses.filter((course) => selectedSet.has(course.languageId))

    if (activeTopic === 'all') {
      return matchedCourses
    }

    return matchedCourses.filter((course) => course.languageId === activeTopic)
  }, [activeTopic, learningLanguages])

  const displayedCourses = visibleCourses.length > 0 ? visibleCourses : recommendedCourses.slice(0, 3)
  const firstName = user.name.trim().split(' ')[0] || 'Learner'
  const avatarInitial = firstName.charAt(0).toUpperCase()

  return (
    <main className="home-page">
      <header className="home-navbar" aria-label="Main navigation">
        <a className="home-logo" href="#top" aria-label="Coding Study home">
          <span>CS</span>
          Coding Study
        </a>

        <nav className="home-nav-links" aria-label="Learning navigation">
          <a href="#classes">Kelas Saya</a>
          <a href="#forum">Forum</a>
        </nav>

        <div className="home-nav-actions">
          <label className="home-search">
            <span>Cari kursus</span>
            <input type="search" placeholder="Cari..." />
          </label>
          <button className="home-avatar-button" type="button" aria-label={`Profil ${user.name}`}>
            {avatarInitial}
          </button>
        </div>
      </header>

      <section className="home-welcome" id="top">
        <div>
          <p className="home-greeting">👋 Selamat Datang, {firstName}!</p>
          <p className="home-profile-email">{user.email}</p>
          <div className="home-focus-row" aria-label="Fokus belajar saat ini">
            <span>Fokus belajarmu saat ini:</span>
            {learningLanguages.slice(0, 4).map((languageId) => (
              <strong key={languageId}>{languageLabels[languageId] ?? languageId}</strong>
            ))}
          </div>
        </div>

        <button className="btn btn-secondary" type="button" onClick={onLogout}>
          Logout
        </button>
      </section>

      <section className="home-content" id="classes">
        <div className="topic-filter" aria-label="Pilih topik kursus">
          <span>Pilih Topik:</span>
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
              {languageLabels[languageId] ?? languageId} <span aria-hidden="true">⭐</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsInterestPanelOpen((current) => !current)}
            aria-expanded={isInterestPanelOpen}
          >
            + Tambah Minat
          </button>
        </div>

        {isInterestPanelOpen && (
          <div className="interest-panel" aria-label="Tambah minat bahasa pemrograman">
            <div>
              <strong>Pilih bahasa tambahan</strong>
              <p>Rekomendasi kursus akan langsung ikut berubah.</p>
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

        <section className="course-recommendation" aria-labelledby="recommendation-title">
          <div className="recommendation-heading">
            <p className="eyebrow">🎯 Rekomendasi kursus untukmu</p>
            <h1 id="recommendation-title">Materi yang cocok dengan minatmu</h1>
          </div>

          <div className="course-card-grid">
            {displayedCourses.map((course) => (
              <article className="recommendation-card" key={course.id}>
                <span className="course-tag">{course.languageName}</span>
                <h2>{course.title}</h2>
                <p>{course.level}</p>
                <div className="course-meta">
                  <span>⭐ {course.rating}</span>
                  <span>{course.modules} Modul</span>
                </div>
                <button className="btn btn-primary" type="button">
                  Mulai Belajar
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
