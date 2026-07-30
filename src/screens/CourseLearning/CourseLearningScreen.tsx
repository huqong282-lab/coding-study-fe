import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import type { AppUser, Language } from '../../types/user'
import { useCourse } from '../../hooks/useCourse'

type CourseLearningScreenProps = {
  language: Language
  user?: AppUser | null
  onLogout: () => void
}

const copy = {
  id: {
    back: 'Kembali ke detail kelas',
    learningHub: 'Isi kelas',
    resources: 'Resources',
    about: 'About',
    rules: 'Rules',
    start: 'Mulai Belajar',
    continue: 'Lanjutkan Modul',
    completed: 'Selesai',
    notFound: 'Kursus tidak ditemukan.',
  },
  en: {
    back: 'Back to class detail',
    learningHub: 'Class content',
    resources: 'Resources',
    about: 'About',
    rules: 'Rules',
    start: 'Start Learning',
    continue: 'Continue Module',
    completed: 'Completed',
    notFound: 'Course not found.',
  },
}

function formatDuration(index: number, language: Language) {
  const duration = Math.max(4, 9 - Math.min(index, 4))
  return `${duration} ${language === 'id' ? 'menit' : 'mins'}`
}

function CourseLearningScreen({ language, user, onLogout }: CourseLearningScreenProps) {
  const navigate = useNavigate()
  const params = useParams()
  const text = copy[language]
  const { course, isLoading, error } = useCourse(params.courseId)
  const [activeTab, setActiveTab] = useState<'resources' | 'about' | 'rules'>('resources')
  const [activeModuleIndex, setActiveModuleIndex] = useState(0)

  const moduleItems = useMemo(() => {
    if (!course) {
      return []
    }

    const seedLessons = course.syllabus.length > 0 ? course.syllabus : [course.title]

    return Array.from({ length: course.modules }, (_, index) => {
      const seed = seedLessons[index % seedLessons.length]
      const stage = index < seedLessons.length ? seed : `${course.title} - Modul ${index + 1}`

      return {
        index,
        number: index + 1,
        title: stage,
        subtitle: index < 3 ? 'Core lesson' : 'Practice flow',
        duration: formatDuration(index, language),
      }
    })
  }, [course, language])

  if (isLoading) {
    return (
      <main className="course-learning-page">
        <Navbar user={user} onLogout={onLogout} />
        <section className="course-learning-shell">
          <div className="course-learning-empty">
            <p>Memuat modul course...</p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (!course) {
    return (
      <main className="course-learning-page">
        <Navbar user={user} onLogout={onLogout} />
        <section className="course-learning-shell">
          <div className="course-learning-empty">
            <p>{error || text.notFound}</p>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/home')}>
              {text.back}
            </button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const activeModule = moduleItems[activeModuleIndex] ?? moduleItems[0]
  const completedCount = Math.max(activeModuleIndex, 0)
  const progress = course.modules > 0 ? Math.round((completedCount / course.modules) * 100) : 0

  return (
    <main className="course-learning-page">
      <Navbar user={user} onLogout={onLogout} />

      <section className="course-learning-shell">
        <div className="course-learning-page-actions">
          <button className="btn btn-secondary course-learning-back-btn" type="button" onClick={() => navigate(`/courses/${course.id}`)}>
            {text.back}
          </button>
          <span className="course-learning-chip">{text.learningHub}</span>
        </div>

        <div className="course-learning-hero">
          <div>
            <p className="eyebrow">{course.languageName}</p>
            <h1>{course.title}</h1>
            <p className="course-learning-description">{course.description}</p>
          </div>

          <div className="course-learning-meta">
            <span>
              <small>{language === 'id' ? 'Mentor' : 'Mentor'}</small>
              <strong>{course.mentor}</strong>
            </span>
            <span>
              <small>{language === 'id' ? 'Level' : 'Level'}</small>
              <strong>{course.level}</strong>
            </span>
            <span>
              <small>{language === 'id' ? 'Modul' : 'Modules'}</small>
              <strong>{course.modules}</strong>
            </span>
            <span>
              <small>{language === 'id' ? 'Durasi' : 'Duration'}</small>
              <strong>{course.duration}</strong>
            </span>
          </div>
        </div>

        <div className="course-learning-layout">
          <aside className="course-learning-sidebar" aria-labelledby="course-learning-sidebar-title">
            <div className="course-learning-sidebar-head">
              <div>
                <p className="course-learning-sidebar-kicker">{text.learningHub}</p>
                <h2 id="course-learning-sidebar-title">{course.modules} {language === 'id' ? 'modul' : 'modules'}</h2>
              </div>
              <div className="course-learning-progress">
                <strong>{progress}%</strong>
                <span>{language === 'id' ? 'progres' : 'progress'}</span>
              </div>
            </div>

            <div className="course-learning-progress-track" aria-hidden="true">
              <span style={{ width: `${Math.max(progress, 10)}%` }} />
            </div>

            <div className="course-learning-sidebar-summary">
              <strong>{activeModule?.title}</strong>
              <p>{language === 'id' ? 'Modul aktif sekarang' : 'Active module now'}</p>
            </div>

            <div className="course-learning-module-list" role="list" aria-label="Daftar modul kelas">
              {moduleItems.map((moduleItem) => {
                const isActive = moduleItem.index === activeModuleIndex
                const isCompleted = moduleItem.index < activeModuleIndex

                return (
                  <button
                    className={isActive ? 'course-learning-module-item is-active' : 'course-learning-module-item'}
                    key={moduleItem.number}
                    type="button"
                    onClick={() => setActiveModuleIndex(moduleItem.index)}
                    aria-pressed={isActive}
                  >
                    <span className="course-learning-module-icon" aria-hidden="true">
                      {isCompleted ? '✓' : '▶'}
                    </span>
                    <span className="course-learning-module-copy">
                      <strong>
                        {moduleItem.number}. {moduleItem.title}
                      </strong>
                      <small>{moduleItem.subtitle}</small>
                    </span>
                    <span className="course-learning-module-duration">{moduleItem.duration}</span>
                  </button>
                )
              })}
            </div>
          </aside>

          <section className="course-learning-content" aria-labelledby="course-learning-player-title">
            <div className="course-learning-stage">
              <div className="course-learning-stage-lines course-learning-stage-line-left" aria-hidden="true" />
              <div className="course-learning-stage-lines course-learning-stage-line-right" aria-hidden="true" />
              <div className="course-learning-stage-node course-learning-stage-node-left-top" aria-hidden="true">F</div>
              <div className="course-learning-stage-node course-learning-stage-node-right-top" aria-hidden="true">I</div>
              <div className="course-learning-stage-node course-learning-stage-node-left-bottom" aria-hidden="true">L</div>
              <div className="course-learning-stage-node course-learning-stage-node-right-bottom" aria-hidden="true">R</div>
              <button className="course-learning-play-button" type="button" aria-label={text.start}>
                <span aria-hidden="true">▶</span>
              </button>
            </div>

            <div className="course-learning-player-header">
              <div>
                <p className="course-learning-player-kicker">{course.languageName}</p>
                <h2 id="course-learning-player-title">{activeModule?.title}</h2>
                <p className="course-learning-player-copy">
                  {language === 'id'
                    ? 'Pilih modul di sidebar untuk pindah materi. Layout ini mengikuti tema gelap kelas sebelumnya.'
                    : 'Pick a module from the sidebar to switch lessons. The layout keeps the same dark class theme.'}
                </p>
              </div>
              <button className="btn btn-primary course-learning-primary-action" type="button">
                {text.continue}
              </button>
            </div>

            <div className="course-learning-tabs" role="tablist" aria-label="Informasi kelas">
              <button
                className={activeTab === 'resources' ? 'is-active' : ''}
                type="button"
                role="tab"
                aria-selected={activeTab === 'resources'}
                onClick={() => setActiveTab('resources')}
              >
                {text.resources}
              </button>
              <button
                className={activeTab === 'about' ? 'is-active' : ''}
                type="button"
                role="tab"
                aria-selected={activeTab === 'about'}
                onClick={() => setActiveTab('about')}
              >
                {text.about}
              </button>
              <button
                className={activeTab === 'rules' ? 'is-active' : ''}
                type="button"
                role="tab"
                aria-selected={activeTab === 'rules'}
                onClick={() => setActiveTab('rules')}
              >
                {text.rules}
              </button>
            </div>

            <div className="course-learning-tab-panel">
              {activeTab === 'resources' && (
                <div className="course-learning-resource-grid">
                  <article className="course-learning-card">
                    <p>Assets</p>
                    <strong>{language === 'id' ? 'Belum ada file tambahan.' : 'No downloadable assets yet.'}</strong>
                    <span>{language === 'id' ? 'Materi inti ada di video dan modul.' : 'The core material lives in the videos and modules.'}</span>
                  </article>
                  <article className="course-learning-card">
                    <p>Tools</p>
                    <strong>{course.languageName}</strong>
                    <span>{language === 'id' ? 'Cocok untuk latihan langsung.' : 'Ideal for hands-on practice.'}</span>
                  </article>
                  <article className="course-learning-card">
                    <p>Checkpoint</p>
                    <strong>{activeModule?.title}</strong>
                    <span>{language === 'id' ? 'Tandai modul sebagai selesai setelah dipelajari.' : 'Mark the module once you finish it.'}</span>
                  </article>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="course-learning-notes">
                  <div>
                    <strong>{language === 'id' ? 'Tentang kelas' : 'About this class'}</strong>
                    <p>{course.description}</p>
                  </div>
                  <div>
                    <strong>{language === 'id' ? 'Hasil belajar' : 'Learning outcomes'}</strong>
                    <ul>
                      {course.outcomes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="course-learning-notes">
                  <div>
                    <strong>{language === 'id' ? 'Aturan kelas' : 'Class rules'}</strong>
                    <ul>
                      <li>{language === 'id' ? 'Ikuti modul dari atas ke bawah supaya alurnya rapi.' : 'Follow the modules from top to bottom to keep the flow clean.'}</li>
                      <li>{language === 'id' ? 'Gunakan tombol play untuk fokus ke sesi saat ini.' : 'Use the play button to focus on the current session.'}</li>
                      <li>{language === 'id' ? 'Selesaikan satu modul sebelum pindah ke modul berikutnya.' : 'Finish one module before moving to the next.'}</li>
                    </ul>
                  </div>
                  <div>
                    <strong>{language === 'id' ? 'Status belajar' : 'Learning status'}</strong>
                    <p>
                      {progress > 0
                        ? `${progress}% ${language === 'id' ? 'sudah dibuka dari kelas ini.' : 'has been unlocked in this class.'}`
                        : language === 'id'
                          ? 'Kelas siap dimulai dari modul pertama.'
                          : 'The class is ready to start from the first module.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CourseLearningScreen
