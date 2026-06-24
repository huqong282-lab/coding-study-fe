import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { courseCatalog } from '../../data/courses'
import type { Course } from '../../types/product'
import type { AppUser, Language } from '../../types/user'
import CourseCheckoutHero from './components/CourseCheckoutHero'
import CourseCheckoutOverview from './components/CourseCheckoutOverview'
import CourseCheckoutSidebar from './components/CourseCheckoutSidebar'

type CourseCheckoutScreenProps = {
  language: Language
  user?: AppUser | null
  onLogout: () => void
}

const copy = {
  id: {
    back: 'Kembali ke detail kelas',
    title: 'Checkout Kelas',
    subtitle: 'Selesaikan pembayaran tanpa kehilangan konteks belajar.',
    summary: 'Ringkasan pembayaran',
    payNow: 'Bayar Sekarang',
    startFree: 'Masuk ke Kelas',
    notFound: 'Kursus tidak ditemukan.',
    freeNotice: 'Kelas ini gratis, jadi kamu bisa langsung masuk tanpa pembayaran.',
    access: 'Akses seumur hidup',
    includes: 'Yang kamu dapatkan',
    payment: 'Metode pembayaran',
    security: 'Aman dan cepat',
  },
  en: {
    back: 'Back to class detail',
    title: 'Class Checkout',
    subtitle: 'Finish the payment without losing the learning flow.',
    summary: 'Payment summary',
    payNow: 'Pay Now',
    startFree: 'Enter Class',
    notFound: 'Course not found.',
    freeNotice: 'This class is free, so you can enter it without payment.',
    access: 'Lifetime access',
    includes: 'What you get',
    payment: 'Payment method',
    security: 'Safe and fast',
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
  const totalModules = course.modules
  const totalMinutes = totalModules * 3
  const heroStats = [
    { label: language === 'id' ? 'Harga' : 'Price', value: course.priceLabel },
    { label: language === 'id' ? 'Mentor' : 'Mentor', value: course.mentor },
    { label: language === 'id' ? 'Modul' : 'Modules', value: `${totalModules}` },
    { label: language === 'id' ? 'Durasi' : 'Duration', value: course.duration },
  ]
  const checkoutDetails = [
    { label: language === 'id' ? 'Format' : 'Format', value: language === 'id' ? 'Video course' : 'Video course' },
    { label: language === 'id' ? 'Total lesson' : 'Total lessons', value: `${totalModules}` },
    { label: language === 'id' ? 'Perkiraan durasi' : 'Approx. duration', value: `${totalMinutes} mins` },
  ]
  const checkoutHighlights = [
    language === 'id' ? 'Akses langsung setelah pembayaran' : 'Instant access after payment',
    language === 'id' ? 'Instruksi pembayaran yang jelas' : 'Clear payment instructions',
    language === 'id' ? 'Siap lanjut ke halaman belajar' : 'Ready to continue to the learning page',
  ]
  const overviewItems = [
    language === 'id'
      ? 'Checkout ini mengikuti gaya visual kelas yang sudah ada, jadi transisinya terasa konsisten.'
      : 'This checkout keeps the existing class visual language, so the transition feels consistent.',
    language === 'id'
      ? 'Panel kanan dibuat sticky agar tetap terlihat saat kamu scroll ke bawah.'
      : 'The right panel is sticky so it stays visible while you scroll down.',
    language === 'id'
      ? 'Warna aksen tetap mengikuti tema gelap biru yang dipakai aplikasi.'
      : 'The accent colors stay aligned with the existing dark blue app theme.',
  ]
  const paymentMethods = [
    language === 'id' ? 'Transfer bank' : 'Bank transfer',
    language === 'id' ? 'E-wallet' : 'E-wallet',
    language === 'id' ? 'Kartu debit/kredit' : 'Debit/credit card',
  ]

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

        <CourseCheckoutHero
          eyebrow={text.title}
          title={course.title}
          description={`${text.subtitle} ${course.description}`}
          stats={heroStats}
        />

        <div className="course-checkout-layout">
          <div className="course-checkout-main">
            <CourseCheckoutOverview title={text.includes} subtitle={text.access} items={overviewItems} />

            <article className="course-checkout-card course-checkout-payment-card">
              <p className="course-checkout-kicker">{text.payment}</p>
              <h2>{isFree ? text.startFree : text.payNow}</h2>
              <div className="course-checkout-payment-methods">
                {paymentMethods.map((method) => (
                  <span key={method}>{method}</span>
                ))}
              </div>
              <p className="course-checkout-note">
                {isFree ? text.freeNotice : language === 'id' ? 'Setelah bayar, kamu akan diarahkan ke halaman belajar.' : 'After payment, you will be redirected to the learning page.'}
              </p>
              <div className="course-checkout-steps">
                <div>
                  <strong>1</strong>
                  <span>{language === 'id' ? 'Pilih metode pembayaran' : 'Choose a payment method'}</span>
                </div>
                <div>
                  <strong>2</strong>
                  <span>{language === 'id' ? 'Selesaikan pembayaran' : 'Complete the payment'}</span>
                </div>
                <div>
                  <strong>3</strong>
                  <span>{language === 'id' ? 'Masuk ke materi kelas' : 'Enter the class material'}</span>
                </div>
              </div>
            </article>
          </div>

          <CourseCheckoutSidebar
            badge={text.summary}
            title={course.title}
            priceLabel={course.priceLabel}
            note={isFree ? text.freeNotice : language === 'id' ? 'Bayar sekali untuk akses seumur hidup.' : 'Pay once for lifetime access.'}
            details={checkoutDetails}
            highlights={checkoutHighlights}
            actionLabel={isFree ? text.startFree : text.payNow}
            onActionClick={() => navigate(`/courses/${course.id}/learn`)}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CourseCheckoutScreen
