import { useMemo, useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import type { AppUser } from '../../types/user'

type MentorModuleManagementScreenProps = {
  user?: AppUser | null
  onLogout: () => void
}

type LessonDraft = {
  id: number
  title: string
  description: string
}

type LocationState = {
  courseTitle?: string
}

const initialLessons: LessonDraft[] = [
  {
    id: 1,
    title: 'Pengenalan kelas',
    description: 'Pembukaan materi, tujuan belajar, dan setup awal.',
  },
  {
    id: 2,
    title: 'Dasar materi utama',
    description: 'Materi inti pertama yang bisa mentor susun ulang.',
  },
  {
    id: 3,
    title: 'Latihan dan review',
    description: 'Rangkuman, latihan mandiri, dan evaluasi progress siswa.',
  },
]

function MentorModuleManagementScreen({ user, onLogout }: MentorModuleManagementScreenProps) {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const location = useLocation()
  const state = location.state as LocationState | null
  const courseTitle = state?.courseTitle ?? `Kelas ${courseId ?? ''}`.trim()
  const [lessons, setLessons] = useState(initialLessons)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const lessonCountLabel = useMemo(() => `${lessons.length} pelajaran`, [lessons.length])

  function handleAddLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) {
      return
    }

    setLessons((currentLessons) => [
      ...currentLessons,
      {
        id: Date.now(),
        title: title.trim(),
        description: description.trim() || 'Deskripsi pelajaran belum diisi.',
      },
    ])
    setTitle('')
    setDescription('')
  }

  function handleDeleteLesson(lessonId: number) {
    setLessons((currentLessons) => currentLessons.filter((lesson) => lesson.id !== lessonId))
  }

  function handleMoveLesson(lessonId: number, direction: 'up' | 'down') {
    setLessons((currentLessons) => {
      const currentIndex = currentLessons.findIndex((lesson) => lesson.id === lessonId)
      const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentLessons.length) {
        return currentLessons
      }

      const orderedLessons = [...currentLessons]
      const selectedLesson = orderedLessons[currentIndex]
      orderedLessons[currentIndex] = orderedLessons[nextIndex]
      orderedLessons[nextIndex] = selectedLesson
      return orderedLessons
    })
  }

  return (
    <main className="mentor-class-form-page">
      <Navbar user={user} onLogout={onLogout} variant="dashboard" title="Management Module" />

      <section className="mentor-class-form-shell">
        <div className="mentor-class-form-header">
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard')}>
            Kembali ke dashboard
          </button>
          <span className="mentor-class-form-chip">UI draft lokal, belum tersambung backend</span>
        </div>

        <div className="mentor-module-header">
          <div>
            <p>Management Module</p>
            <h1>{courseTitle}</h1>
            <span>Tambah, hapus, dan urutkan pelajaran sebelum nanti disambungkan ke backend.</span>
          </div>
          <strong>{lessonCountLabel}</strong>
        </div>

        <div className="mentor-module-layout">
          <section className="mentor-module-panel" aria-label="Daftar pelajaran">
            <div className="mentor-module-panel-head">
              <div>
                <p>Urutan Pelajaran</p>
                <h2>Module kelas</h2>
              </div>
            </div>

            <div className="mentor-module-list">
              {lessons.map((lesson, index) => (
                <article className="mentor-module-item" key={lesson.id}>
                  <span className="mentor-module-number">{index + 1}</span>
                  <div>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.description}</p>
                  </div>
                  <div className="mentor-module-actions">
                    <button
                      type="button"
                      onClick={() => handleMoveLesson(lesson.id, 'up')}
                      disabled={index === 0}
                    >
                      Naik
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveLesson(lesson.id, 'down')}
                      disabled={index === lessons.length - 1}
                    >
                      Turun
                    </button>
                    <button type="button" onClick={() => handleDeleteLesson(lesson.id)}>
                      Hapus
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="mentor-module-panel">
            <div className="mentor-module-panel-head">
              <div>
                <p>Tambah Pelajaran</p>
                <h2>Pelajaran baru</h2>
              </div>
            </div>

            <form className="mentor-module-form" onSubmit={handleAddLesson}>
              <label className="mentor-class-form-field">
                <span>Judul Pelajaran</span>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Contoh: Setup project"
                  required
                />
              </label>

              <label className="mentor-class-form-field">
                <span>Deskripsi</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Ringkasan singkat isi pelajaran."
                  rows={5}
                />
              </label>

              <button className="btn btn-primary" type="submit">
                Tambah Pelajaran
              </button>
            </form>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default MentorModuleManagementScreen
