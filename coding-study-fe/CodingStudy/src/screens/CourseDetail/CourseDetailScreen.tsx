import { useMemo, useState } from 'react'

type Course = {
  id: string
  languageId: string
  languageName: string
  title: string
  level: string
  category: string
  rating: number
  modules: number
  duration: string
  access: 'free' | 'paid'
  priceLabel: string
  mentor: string
  description: string
  outcomes: string[]
  curriculum: string[]
  requirements: string[]
}

type CourseDetailScreenProps = {
  course: Course
  onBack: () => void
}

function CourseDetailScreen({ course, onBack }: CourseDetailScreenProps) {
  const [isActionPressed, setIsActionPressed] = useState(false)

  const ctaLabel = useMemo(
    () => (course.access === 'free' ? 'Mulai Belajar' : 'Bayar Sekarang'),
    [course.access],
  )

  const actionMessage = useMemo(() => {
    if (!isActionPressed) {
      return ''
    }

    return course.access === 'free'
      ? 'Kelas ini gratis, jadi kamu bisa mulai belajar setelah implementasi lesson page aktif.'
      : 'Kelas ini berbayar. Dummy checkout belum dihubungkan, tapi status pembayaran sudah terlihat di sini.'
  }, [course.access, isActionPressed])

  return (
    <main className="course-detail-page">
      <header className="course-detail-navbar">
        <button className="btn btn-secondary course-back-button" type="button" onClick={onBack}>
          ← Kembali
        </button>
        <div className="course-detail-brand">
          <span>CS</span>
          Coding Study
        </div>
      </header>

      <section className="course-detail-hero">
        <div className="course-detail-hero-copy">
          <p className="eyebrow">
            {course.languageName} • {course.category}
          </p>
          <h1>{course.title}</h1>
          <p className="course-detail-description">{course.description}</p>

          <div className="course-detail-badges">
            <span className={course.access === 'free' ? 'price-pill is-free' : 'price-pill is-paid'}>
              {course.priceLabel}
            </span>
            <span className="detail-chip">{course.level}</span>
            <span className="detail-chip">⭐ {course.rating}</span>
            <span className="detail-chip">{course.modules} modul</span>
            <span className="detail-chip">{course.duration}</span>
          </div>
        </div>

        <aside className="course-detail-action-card" aria-label="Informasi akses kelas">
          <strong>{course.access === 'free' ? 'Akses gratis' : 'Kelas premium'}</strong>
          <p>{course.access === 'free' ? 'Tidak ada biaya untuk membuka kelas ini.' : 'Sebelum belajar, kamu perlu menyelesaikan pembayaran.'}</p>
          <div>
            <span>Mentor</span>
            <strong>{course.mentor}</strong>
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setIsActionPressed(true)}
          >
            {ctaLabel}
          </button>
          {actionMessage && <p className="course-detail-feedback">{actionMessage}</p>}
        </aside>
      </section>

      <section className="course-detail-grid">
        <article className="course-detail-panel">
          <p className="eyebrow">Yang akan kamu pelajari</p>
          <ul className="course-detail-list">
            {course.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="course-detail-panel">
          <p className="eyebrow">Kurikum</p>
          <ol className="course-detail-list course-detail-list-numbered">
            {course.curriculum.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </article>

        <article className="course-detail-panel">
          <p className="eyebrow">Syarat awal</p>
          <ul className="course-detail-list">
            {course.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  )
}

export default CourseDetailScreen
