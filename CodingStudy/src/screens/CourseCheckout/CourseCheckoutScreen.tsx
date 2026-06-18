import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { courseCatalog } from '../../data/courses'
import type { Course } from '../../types/product'
import type { AppUser, Language } from '../../types/user'

type CourseCheckoutScreenProps = {
  language: Language
  user?: AppUser | null
  onLogout: () => void
}

const copy = {
  id: {
    back: 'Kembali ke detail kelas',
    title: 'Checkout Kelas',
    summary: 'Ringkasan pembayaran',
    payNow: 'Bayar Sekarang',
    startFree: 'Masuk ke Kelas',
    notFound: 'Kursus tidak ditemukan.',
    freeNotice: 'Kelas ini gratis, jadi kamu bisa langsung masuk tanpa pembayaran.',
  },
  en: {
    back: 'Back to class detail',
    title: 'Class Checkout',
    summary: 'Payment summary',
    payNow: 'Pay Now',
    startFree: 'Enter Class',
    notFound: 'Course not found.',
    freeNotice: 'This class is free, so you can enter it without payment.',
  },
}

function CourseCheckoutScreen({ language, user, onLogout }: CourseCheckoutScreenProps) {
  const navigate = useNavigate()
  const params = useParams()
  const text = copy[language]

  const course = useMemo<Course | undefined>(
    () => courseCatalog.find((item) => String(item.id) === params.courseId),
    [params.courseId],
  )

  if (!course) {
    return (
      <main className="course-checkout-page">
        <Navbar user={user} onLogout={onLogout} />
        <section className="course-checkout-shell">
          <div className="course-checkout-card">
            <p>{text.notFound}</p>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/home')}>
              {text.back}
            </button>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const isFree = course.access === 'free'

  return (
    <main className="course-checkout-page">
      <Navbar user={user} onLogout={onLogout} />

      <section className="course-checkout-shell">
        <div className="course-checkout-page-actions">
          <button className="btn btn-secondary course-checkout-back-btn" type="button" onClick={() => navigate(`/courses/${course.id}`)}>
            {text.back}
          </button>
          <span className="course-checkout-chip">{text.summary}</span>
        </div>

        <div className="course-checkout-hero">
          <div>
            <p className="eyebrow">{course.languageName}</p>
            <h1>{course.title}</h1>
            <p className="course-checkout-copy">{course.description}</p>
          </div>

          <div className="course-checkout-summary">
            <div>
              <small>{language === 'id' ? 'Harga' : 'Price'}</small>
              <strong>{course.priceLabel}</strong>
            </div>
            <div>
              <small>{language === 'id' ? 'Mentor' : 'Mentor'}</small>
              <strong>{course.mentor}</strong>
            </div>
            <div>
              <small>{language === 'id' ? 'Modul' : 'Modules'}</small>
              <strong>{course.modules}</strong>
            </div>
            <div>
              <small>{language === 'id' ? 'Durasi' : 'Duration'}</small>
              <strong>{course.duration}</strong>
            </div>
          </div>
        </div>

        <div className="course-checkout-grid">
          <article className="course-checkout-card course-checkout-main-card">
            <p className="course-checkout-kicker">{text.summary}</p>
            <h2>{course.title}</h2>
            <ul>
              <li>{course.description}</li>
              <li>{language === 'id' ? 'Akses modul penuh setelah pembayaran' : 'Full module access after payment'}</li>
              <li>{language === 'id' ? 'Prototype checkout untuk alur demo' : 'Prototype checkout for the demo flow'}</li>
            </ul>
          </article>

          <aside className="course-checkout-card course-checkout-side-card">
            <p className="course-checkout-kicker">{isFree ? (language === 'id' ? 'Gratis' : 'Free') : text.summary}</p>
            <strong className="course-checkout-price">{course.priceLabel}</strong>
            <p className="course-checkout-note">
              {isFree ? text.freeNotice : language === 'id' ? 'Setelah bayar, kamu akan diarahkan ke isi kelas.' : 'After payment, you will be sent to the class content.'}
            </p>
            <button
              className="btn btn-primary course-checkout-action"
              type="button"
              onClick={() => navigate(`/courses/${course.id}/learn`)}
            >
              {isFree ? text.startFree : text.payNow}
            </button>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CourseCheckoutScreen
