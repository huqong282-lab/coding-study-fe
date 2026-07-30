import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import {
  createModule,
  deleteModule,
  listModules,
  updateModule,
  type BackendModule,
} from '../../services/moduleServices'
import type { AppUser } from '../../types/user'

type MentorModuleManagementScreenProps = {
  user?: AppUser | null
  accessToken: string
  onLogout: () => void
}

type LocationState = {
  courseTitle?: string
}

type VideoPreview =
  | {
      type: 'iframe'
      src: string
    }
  | {
      type: 'video'
      src: string
    }

function getVideoPreview(videoUrl?: string | null): VideoPreview | null {
  if (!videoUrl) {
    return null
  }

  try {
    const url = new URL(videoUrl)
    const hostname = url.hostname.replace(/^www\./, '')
    const pathname = url.pathname

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const videoId = url.searchParams.get('v') || pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/)?.[1]
      return videoId ? { type: 'iframe', src: `https://www.youtube.com/embed/${videoId}` } : null
    }

    if (hostname === 'youtu.be') {
      const videoId = pathname.split('/').filter(Boolean)[0]
      return videoId ? { type: 'iframe', src: `https://www.youtube.com/embed/${videoId}` } : null
    }

    if (hostname === 'vimeo.com') {
      const videoId = pathname.split('/').filter(Boolean)[0]
      return videoId ? { type: 'iframe', src: `https://player.vimeo.com/video/${videoId}` } : null
    }

    if (/\.(mp4|webm|ogg)(?:$|\?)/i.test(videoUrl)) {
      return { type: 'video', src: videoUrl }
    }

    return { type: 'iframe', src: videoUrl }
  } catch {
    return null
  }
}

function MentorModuleManagementScreen({ user, accessToken, onLogout }: MentorModuleManagementScreenProps) {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const location = useLocation()
  const state = location.state as LocationState | null
  const courseTitle = state?.courseTitle ?? `Kelas ${courseId ?? ''}`.trim()
  const [modules, setModules] = useState<BackendModule[]>([])
  const [selectedModule, setSelectedModule] = useState<BackendModule | null>(null)
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [editJudul, setEditJudul] = useState('')
  const [editDeskripsi, setEditDeskripsi] = useState('')
  const [editVideoUrl, setEditVideoUrl] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const moduleCountLabel = useMemo(() => `${modules.length} modul`, [modules.length])

  useEffect(() => {
    let isMounted = true

    async function loadModules() {
      if (!courseId || !accessToken) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const loadedModules = await listModules(courseId, accessToken)
        if (isMounted) {
          setModules(loadedModules)
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError instanceof Error ? requestError.message : 'Gagal mengambil daftar modul')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadModules()

    return () => {
      isMounted = false
    }
  }, [accessToken, courseId])

  function openModuleDetail(moduleItem: BackendModule) {
    setSelectedModule(moduleItem)
    setEditJudul(moduleItem.judul)
    setEditDeskripsi(moduleItem.deskripsi ?? '')
    setEditVideoUrl(moduleItem.videoUrl ?? '')
    setNotice('')
  }

  async function handleAddModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!courseId || !accessToken) {
      setError('Sesi atau ID kelas tidak ditemukan. Silakan buka ulang halaman dari dashboard.')
      return
    }

    if (!judul.trim()) {
      setError('Judul modul wajib diisi.')
      return
    }

    setIsSubmitting(true)

    try {
      const createdModule = await createModule(
        {
          classId: courseId,
          urutan: modules.length + 1,
          judul: judul.trim(),
          ...(deskripsi.trim() ? { deskripsi: deskripsi.trim() } : {}),
          ...(videoUrl.trim() ? { videoUrl: videoUrl.trim() } : {}),
        },
        accessToken,
      )

      setModules((currentModules) =>
        [...currentModules, createdModule].sort((first, second) => first.urutan - second.urutan),
      )
      setJudul('')
      setDeskripsi('')
      setVideoUrl('')
      setNotice('Modul berhasil ditambahkan.')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Gagal menambahkan modul')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteModule(moduleId: string) {
    setError('')
    setNotice('')

    if (!accessToken) {
      setError('Sesi login tidak ditemukan. Silakan login ulang.')
      return
    }

    const moduleToDelete = modules.find((moduleItem) => moduleItem.id === moduleId)
    setModules((currentModules) => currentModules.filter((moduleItem) => moduleItem.id !== moduleId))
    setSelectedModule((currentModule) => (currentModule?.id === moduleId ? null : currentModule))

    try {
      await deleteModule(moduleId, accessToken)
      setNotice('Modul berhasil dihapus.')
    } catch (requestError) {
      if (moduleToDelete) {
        setModules((currentModules) =>
          [...currentModules, moduleToDelete].sort((first, second) => first.urutan - second.urutan),
        )
      }
      setError(requestError instanceof Error ? requestError.message : 'Gagal menghapus modul')
    }
  }

  async function handleMoveModule(moduleId: string, direction: 'up' | 'down') {
    if (!accessToken) {
      setError('Sesi login tidak ditemukan. Silakan login ulang.')
      return
    }

    const currentIndex = modules.findIndex((moduleItem) => moduleItem.id === moduleId)
    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= modules.length) {
      return
    }

    const previousModules = modules
    const orderedModules = [...modules]
    const selectedLesson = orderedModules[currentIndex]
    const targetLesson = orderedModules[nextIndex]
    orderedModules[currentIndex] = { ...targetLesson, urutan: selectedLesson.urutan }
    orderedModules[nextIndex] = { ...selectedLesson, urutan: targetLesson.urutan }

    setModules([...orderedModules].sort((first, second) => first.urutan - second.urutan))
    setError('')
    setNotice('')

    try {
      await Promise.all([
        updateModule(selectedLesson.id, { urutan: targetLesson.urutan }, accessToken),
        updateModule(targetLesson.id, { urutan: selectedLesson.urutan }, accessToken),
      ])
      setNotice('Urutan modul berhasil diperbarui.')
    } catch (requestError) {
      setModules(previousModules)
      setError(requestError instanceof Error ? requestError.message : 'Gagal mengubah urutan modul')
    }
  }

  async function handleEditModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!selectedModule || !accessToken) {
      setError('Modul atau sesi login tidak ditemukan.')
      return
    }

    if (!editJudul.trim()) {
      setError('Judul modul wajib diisi.')
      return
    }

    setIsSubmitting(true)

    try {
      const updatedModule = await updateModule(
        selectedModule.id,
        {
          judul: editJudul.trim(),
          deskripsi: editDeskripsi.trim(),
          videoUrl: editVideoUrl.trim() || null,
        },
        accessToken,
      )

      setModules((currentModules) =>
        currentModules
          .map((moduleItem) => (moduleItem.id === updatedModule.id ? updatedModule : moduleItem))
          .sort((first, second) => first.urutan - second.urutan),
      )
      setSelectedModule(updatedModule)
      setNotice('Modul berhasil diperbarui.')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Gagal memperbarui modul')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!accessToken) {
    return (
      <main className="mentor-class-form-page">
        <Navbar user={user} onLogout={onLogout} variant="dashboard" title="Management Module" />
        <section className="mentor-class-form-shell">
          <div className="mentor-class-form-card">
            <p>Management Module</p>
            <h1>Akses tidak tersedia</h1>
            <span>Silakan login ulang untuk mengatur modul kelas.</span>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const selectedModuleIndex = selectedModule
    ? modules.findIndex((moduleItem) => moduleItem.id === selectedModule.id) + 1
    : 0
  const selectedVideoPreview = getVideoPreview(selectedModule?.videoUrl)

  return (
    <main className="mentor-class-form-page">
      <Navbar user={user} onLogout={onLogout} variant="dashboard" title="Management Module" />

      <section className="mentor-class-form-shell">
        <div className="mentor-class-form-header">
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard')}>
            Kembali ke dashboard
          </button>
          <span className="mentor-class-form-chip">Field POST: classId, urutan, judul, deskripsi, videoUrl</span>
        </div>

        <div className="mentor-module-header">
          <div>
            <p>Management Module</p>
            <h1>{courseTitle}</h1>
            <span>Tambah, edit, hapus, dan urutkan modul yang tersambung ke backend.</span>
          </div>
          <strong>{moduleCountLabel}</strong>
        </div>

        {error ? <div className="mentor-class-form-error">{error}</div> : null}
        {notice ? <div className="mentor-module-notice">{notice}</div> : null}

        <div className="mentor-module-layout">
          <section className="mentor-module-panel" aria-label="Daftar modul">
            <div className="mentor-module-panel-head">
              <div>
                <p>Urutan Modul</p>
                <h2>Module kelas</h2>
              </div>
            </div>

            <div className="mentor-module-list">
              {isLoading ? <div className="mentor-module-empty">Memuat modul...</div> : null}

              {!isLoading && modules.length === 0 ? (
                <div className="mentor-module-empty">Belum ada modul. Tambahkan modul pertama dari form di samping.</div>
              ) : null}

              {modules.map((moduleItem, index) => (
                <article
                  className="mentor-module-item"
                  key={moduleItem.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openModuleDetail(moduleItem)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      openModuleDetail(moduleItem)
                    }
                  }}
                >
                  <span className="mentor-module-number">{index + 1}</span>
                  <div className="mentor-module-copy">
                    <h3>{moduleItem.judul}</h3>
                    <p>{moduleItem.deskripsi || 'Deskripsi modul belum diisi.'}</p>
                    {moduleItem.videoUrl ? <small>{moduleItem.videoUrl}</small> : null}
                  </div>
                  <div className="mentor-module-actions">
                    <button
                      type="button"
                      className="mentor-module-icon-button"
                      aria-label={`Naikkan ${moduleItem.judul}`}
                      title="Naik"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleMoveModule(moduleItem.id, 'up')
                      }}
                      disabled={index === 0}
                    >
                      <span className="mentor-module-arrow is-up" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="mentor-module-icon-button"
                      aria-label={`Turunkan ${moduleItem.judul}`}
                      title="Turun"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleMoveModule(moduleItem.id, 'down')
                      }}
                      disabled={index === modules.length - 1}
                    >
                      <span className="mentor-module-arrow is-down" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleDeleteModule(moduleItem.id)
                      }}
                    >
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
                <p>Tambah Modul</p>
                <h2>Modul baru</h2>
              </div>
            </div>

            <form className="mentor-module-form" onSubmit={handleAddModule}>
              <label className="mentor-class-form-field">
                <span>Judul Modul</span>
                <input
                  type="text"
                  value={judul}
                  onChange={(event) => setJudul(event.target.value)}
                  placeholder="Contoh: Setup project"
                  minLength={3}
                  required
                />
              </label>

              <label className="mentor-class-form-field">
                <span>Deskripsi</span>
                <textarea
                  value={deskripsi}
                  onChange={(event) => setDeskripsi(event.target.value)}
                  placeholder="Ringkasan singkat isi modul."
                  rows={5}
                />
              </label>

              <label className="mentor-class-form-field">
                <span>Video URL</span>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(event) => setVideoUrl(event.target.value)}
                  placeholder="https://..."
                />
              </label>

              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Tambah Modul'}
              </button>
            </form>
          </aside>
        </div>
      </section>

      {selectedModule ? (
        <div className="mentor-module-modal-backdrop" role="presentation" onClick={() => setSelectedModule(null)}>
          <section
            className="mentor-module-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mentor-module-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mentor-module-modal-head">
              <div>
                <p>Detail Modul #{selectedModuleIndex}</p>
                <h2 id="mentor-module-modal-title">{selectedModule.judul}</h2>
              </div>
              <button type="button" aria-label="Tutup detail modul" onClick={() => setSelectedModule(null)}>
                x
              </button>
            </div>

            <div className="mentor-module-detail">
              <span>Urutan: {selectedModule.urutan}</span>
              <p>{selectedModule.deskripsi || 'Deskripsi modul belum diisi.'}</p>
              {selectedVideoPreview ? (
                <div className="mentor-module-video-frame">
                  {selectedVideoPreview.type === 'video' ? (
                    <video src={selectedVideoPreview.src} controls preload="metadata" />
                  ) : (
                    <iframe
                      src={selectedVideoPreview.src}
                      title={`Video ${selectedModule.judul}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
              ) : (
                <small>Video URL belum diisi.</small>
              )}
              {selectedModule.videoUrl ? (
                <a href={selectedModule.videoUrl} target="_blank" rel="noreferrer">
                  Buka video di tab baru
                </a>
              ) : null}
            </div>

            <form className="mentor-module-form" onSubmit={handleEditModule}>
              <label className="mentor-class-form-field">
                <span>Edit Judul</span>
                <input
                  type="text"
                  value={editJudul}
                  onChange={(event) => setEditJudul(event.target.value)}
                  minLength={3}
                  required
                />
              </label>

              <label className="mentor-class-form-field">
                <span>Edit Deskripsi</span>
                <textarea
                  value={editDeskripsi}
                  onChange={(event) => setEditDeskripsi(event.target.value)}
                  rows={4}
                />
              </label>

              <label className="mentor-class-form-field">
                <span>Edit Video URL</span>
                <input
                  type="url"
                  value={editVideoUrl}
                  onChange={(event) => setEditVideoUrl(event.target.value)}
                  placeholder="https://..."
                />
              </label>

              <div className="mentor-module-modal-actions">
                <button className="btn btn-secondary" type="button" onClick={() => setSelectedModule(null)}>
                  Tutup
                </button>
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Edit Modul'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      <Footer />
    </main>
  )
}

export default MentorModuleManagementScreen
