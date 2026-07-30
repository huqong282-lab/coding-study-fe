import { Link } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
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
      'Akses akun kamu sudah aktif. Kamu bisa langsung mulai belajar dan melanjutkan progress kapan saja.',
    startLearning: 'Mulai Belajar',
    dashboard: 'Dashboard',
    invoice: 'Invoice pembayaran',
    status: 'Status',
    paid: 'Berhasil',
    student: 'Siswa',
    access: 'Akses kelas',
    lifetime: 'Aktif seumur hidup',
    note: 'Detail pembayaran juga akan tersedia di dashboard akun kamu.',
    reference: 'Referensi pembayaran',
  },
  en: {
    eyebrow: 'PAYMENT COMPLETED',
    title: 'Payment Has Been Completed',
    description:
      'Your account access is now active. You can start learning right away and continue your progress anytime.',
    startLearning: 'Start Learning',
    dashboard: 'Dashboard',
    invoice: 'Payment invoice',
    status: 'Status',
    paid: 'Success',
    student: 'Student',
    access: 'Class access',
    lifetime: 'Lifetime access',
    note: 'Payment details will also be available in your account dashboard.',
    reference: 'Payment reference',
  },
}

function PaymentCompleteScreen({ language, user, onLogout }: PaymentCompleteScreenProps) {
  const text = copy[language]
  const paymentReference = new Date().toISOString().slice(0, 10).replaceAll('-', '')

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
              <Link className="btn btn-primary" to="/home">
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
              <strong>#{paymentReference}</strong>
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
                <dt>{text.student}</dt>
                <dd>{user?.name || 'Coding Study Learner'}</dd>
              </div>
              <div>
                <dt>{text.access}</dt>
                <dd>{text.lifetime}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{text.paid}</dd>
              </div>
              <div>
                <dt>{text.reference}</dt>
                <dd>{paymentReference}</dd>
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
