import { Link, useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { useCourse } from '../../hooks/useCourse'
import type { AppUser, Language } from '../../types/user'

type PaymentCompleteScreenProps = {
  language: Language
  user?: AppUser | null
  onLogout: () => void
}

const copy = {
  id: {
    eyebrow: 'PEMBAYARAN SELESAI',
    title: 'Pembayaran Telah Selesai Dilakukan',
    description:
      'Akses kelas kamu sudah aktif. Kamu bisa langsung mulai belajar dan melanjutkan progress kapan saja.',
    loading: 'Memuat konfirmasi pembayaran...',
    notFound: 'Data kelas tidak ditemukan.',
    startLearning: 'Mulai Belajar',
    dashboard: 'Dashboard',
    invoice: 'Invoice pembayaran',
    status: 'Status',
    paid: 'Berhasil',
    course: 'Kelas',
    student: 'Siswa',
    access: 'Akses kelas',
    lifetime: 'Aktif seumur hidup',
    note: 'Detail pembayaran juga akan tersedia di dashboard akun kamu.',
  },
  en: {
    eyebrow: 'PAYMENT COMPLETED',
    title: 'Payment Has Been Completed',
    description:
      'Your class access is now active. You can start learning right away and continue your progress anytime.',
    loading: 'Loading payment confirmation...',
    notFound: 'Course data not found.',
    startLearning: 'Start Learning',
    dashboard: 'Dashboard',
    invoice: 'Payment invoice',
    status: 'Status',
    paid: 'Success',
    course: 'Class',
    student: 'Student',
    access: 'Class access',
    lifetime: 'Lifetime access',
    note: 'Payment details will also be available in your account dashboard.',
  },
}

function PaymentCompleteScreen({ language, user, onLogout }: PaymentCompleteScreenProps) {
  const navigate = useNavigate()
  const params = useParams()
  const text = copy[language]
  const { course, isLoading, error } = useCourse(params.courseId)

  if (isLoading) {
    return (
      <main className="payment-complete-page">
        <Navbar user={user} onLogout={onLogout} variant="checkout" />
        <section className="payment-complete-shell">
          <div className="payment-complete-panel">
            <p>{text.loading}</p>
          </div>
        </section>
      </main>
    )
  }

  if (!course) {
    return (
      <main className="payment-complete-page">
        <Navbar user={user} onLogout={onLogout} variant="checkout" />
        <section className="payment-complete-shell">
          <div className="payment-complete-panel">
            <p>{error || text.notFound}</p>
            <button className="btn btn-secondary" type="button" onClick={() => navigate('/home')}>
              {text.dashboard}
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="payment-complete-page">
      <Navbar user={user} onLogout={onLogout} variant="checkout" />

      <section className="payment-complete-shell">
        <div className="payment-complete-panel">
          <div className="payment-complete-copy">
            <div className="payment-complete-badge" aria-hidden="true">
              <span>OK</span>
            </div>
            <p className="payment-complete-eyebrow">{text.eyebrow}</p>
            <h1>{text.title}</h1>
            <p className="payment-complete-description">{text.description}</p>

            <div className="payment-complete-actions">
              <Link className="btn btn-primary" to={`/courses/${course.id}/learn`}>
                {text.startLearning}
              </Link>
              <Link className="btn btn-secondary" to="/dashboard">
                {text.dashboard}
              </Link>
            </div>
          </div>

          <aside className="payment-complete-receipt" aria-label={text.invoice}>
            <div className="payment-complete-receipt__head">
              <span>{text.invoice}</span>
              <strong>#{String(course.id).slice(0, 8).toUpperCase()}</strong>
            </div>

            <div className="payment-complete-receipt__success">
              <span aria-hidden="true">✓</span>
              <div>
                <small>{text.status}</small>
                <strong>{text.paid}</strong>
              </div>
            </div>

            <dl className="payment-complete-details">
              <div>
                <dt>{text.course}</dt>
                <dd>{course.title}</dd>
              </div>
              <div>
                <dt>{text.student}</dt>
                <dd>{user?.name || 'Coding Study Learner'}</dd>
              </div>
              <div>
                <dt>{text.access}</dt>
                <dd>{text.lifetime}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{course.priceLabel}</dd>
              </div>
            </dl>

            <p>{text.note}</p>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default PaymentCompleteScreen
