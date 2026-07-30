import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { createCourse } from '../../services/courseServices'
import type { AppUser, Language } from '../../types/user'

type MentorClassCreateScreenProps = {
  language: Language
  user?: AppUser | null
  accessToken: string
  onLogout: () => void
}

const copy = {
  id: {
    back: 'Kembali ke dashboard',
    title: 'Buat kelas baru',
    subtitle:
      'Isi detail kelas yang akan dipost ke backend. Mentor akan otomatis menjadi pemilik kelas saat data dikirim.',
    submit: 'Publikasikan kelas',
    saving: 'Menyimpan kelas...',
    requiredHint: 'Field utama yang dibutuhkan: title, description, dan price.',
    success: 'Kelas berhasil dibuat.',
  },
  en: {
    back: 'Back to dashboard',
    title: 'Create a new class',
    subtitle:
      'Fill in the class details and send them to the backend. The logged in mentor will automatically become the owner.',
    submit: 'Publish class',
    saving: 'Saving class...',
    requiredHint: 'Main required fields: title, description, and price.',
    success: 'Class created successfully.',
  },
}

function MentorClassCreateScreen({
  language,
  user,
  accessToken,
  onLogout,
}: MentorClassCreateScreenProps) {
  const navigate = useNavigate()
  const text = copy[language]
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!accessToken) {
      setError('Sesi login tidak ditemukan. Silakan login ulang.')
      return
    }

    const numericPrice = Number(price)
    if (!title.trim() || !description.trim() || !Number.isFinite(numericPrice)) {
      setError('Judul, deskripsi, dan harga wajib diisi dengan benar.')
      return
    }

    setIsSubmitting(true)

    try {
      await createCourse(
        {
          title: title.trim(),
          description: description.trim(),
          price: numericPrice,
          ...(thumbnailUrl.trim() ? { thumbnailUrl: thumbnailUrl.trim() } : {}),
          status,
        },
        accessToken,
      )

      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Gagal membuat kelas')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!accessToken) {
    return (
      <main className="mentor-class-form-page">
        <Navbar user={user} onLogout={onLogout} variant="dashboard" title={text.title} />
        <section className="mentor-class-form-shell">
          <div className="mentor-class-form-card">
            <p>{text.title}</p>
            <h1>Akses tidak tersedia</h1>
            <span>Silakan login ulang untuk membuat kelas baru.</span>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="mentor-class-form-page">
      <Navbar user={user} onLogout={onLogout} variant="dashboard" title={text.title} />

      <section className="mentor-class-form-shell">
        <div className="mentor-class-form-header">
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard')}>
            {text.back}
          </button>
          <span className="mentor-class-form-chip">{text.requiredHint}</span>
        </div>

        <div className="mentor-class-form-layout">
          <article className="mentor-class-form-card">
            <p className="mentor-class-form-kicker">FORM KELAS</p>
            <h1>{text.title}</h1>
            <span>{text.subtitle}</span>

            <form className="mentor-class-form" onSubmit={handleSubmit}>
              <label className="mentor-class-form-field">
                <span>Judul Kelas</span>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Contoh: React Next.js Masterclass"
                  maxLength={255}
                  required
                />
              </label>

              <label className="mentor-class-form-field">
                <span>Deskripsi</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Jelaskan isi kelas, target belajar, dan hasil yang akan didapat."
                  rows={6}
                  required
                />
              </label>

              <div className="mentor-class-form-grid">
                <label className="mentor-class-form-field">
                  <span>Harga</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="Contoh: 250000"
                    required
                  />
                </label>

                <label className="mentor-class-form-field">
                  <span>Status</span>
                  <select value={status} onChange={(event) => setStatus(event.target.value as 'DRAFT' | 'PUBLISHED')}>
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </label>
              </div>

              <label className="mentor-class-form-field">
                <span>Thumbnail URL</span>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(event) => setThumbnailUrl(event.target.value)}
                  placeholder="https://..."
                />
              </label>

              {error ? <div className="mentor-class-form-error">{error}</div> : null}

              <div className="mentor-class-form-actions">
                <button className="btn btn-secondary" type="button" onClick={() => navigate('/dashboard')}>
                  Batal
                </button>
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? text.saving : text.submit}
                </button>
              </div>
            </form>
          </article>

          <aside className="mentor-class-form-aside">
            <div className="mentor-class-form-note">
              <p>Yang akan dikirim</p>
              <strong>title, description, price, thumbnailUrl, status</strong>
              <span>{text.requiredHint}</span>
            </div>

            <div className="mentor-class-form-preview">
              <p>Preview singkat</p>
              <strong>{title.trim() || 'Judul kelas kamu akan muncul di sini'}</strong>
              <span>{description.trim() || 'Tulis deskripsi supaya siswa tahu manfaat kelas ini.'}</span>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default MentorClassCreateScreen
