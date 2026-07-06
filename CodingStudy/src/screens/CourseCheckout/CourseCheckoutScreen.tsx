import { useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import type { AppUser, Language } from '../../types/user'
import { useCourse } from '../../hooks/useCourse'

type CourseCheckoutScreenProps = {
  language: Language
  user?: AppUser | null
  onLogout: () => void
}

const copy = {
  id: {
    back: 'Kembali ke detail kelas',
    title: 'Checkout Kelas',
    subtitle: 'Bergabung dengan kelas premium dan mulai bangun portofolio nyata kamu',
    notFound: 'Kursus tidak ditemukan.',
    summary: 'Ringkasan pembayaran',
    freeLabel: 'Gratis',
    payNow: 'Bayar & Gabung Kelas',
    changeClass: 'Ganti kelas',
    selectedClass: 'Kelas yang Kamu Pilih',
    content: 'Course Content',
    benefits: 'Special Benefits untuk Kamu',
    assets: 'Bonus Assets Belajar',
    reviews: 'Yang Siswa Bilang',
    payment: 'Metode Pembayaran',
    paymentDetails: 'Payment Details',
    transfer: 'Transfer',
    card: 'Kartu',
    ewallet: 'E-Wallet',
    minimarket: 'Minimarket',
    usePromo: 'Pakai',
    normalPrice: 'Harga normal',
    classPrice: 'Harga kelas',
    uniqueCode: 'Kode unik',
    serviceFee: 'Service fee per student',
    totalTransfer: 'Total transfer',
    totalPay: 'Total Bayar',
    trust: 'Dipercaya oleh 12.400+ siswa',
    security: 'Pembayaran Aman & Terenkripsi',
  },
  en: {
    back: 'Back to class detail',
    title: 'Class Checkout',
    subtitle: 'Join a premium class and start building your real portfolio',
    notFound: 'Course not found.',
    summary: 'Payment summary',
    freeLabel: 'Free',
    payNow: 'Pay & Join Class',
    changeClass: 'Change class',
    selectedClass: 'Selected Class',
    content: 'Course Content',
    benefits: 'Special Benefits',
    assets: 'Learning Bonus Assets',
    reviews: 'What Students Say',
    payment: 'Payment Method',
    paymentDetails: 'Payment Details',
    transfer: 'Transfer',
    card: 'Card',
    ewallet: 'E-Wallet',
    minimarket: 'Minimarket',
    usePromo: 'Apply',
    normalPrice: 'Normal price',
    classPrice: 'Class price',
    uniqueCode: 'Unique code',
    serviceFee: 'Service fee per student',
    totalTransfer: 'Total transfer',
    totalPay: 'Total Pay',
    trust: 'Trusted by 12,400+ students',
    security: 'Secure & Encrypted Payments',
  },
}

type ContentCard = {
  title: string
  description: string
  icon: string
  tag?: string
}

type BenefitCard = {
  title: string
  description: string
  icon: string
}

function CourseCheckoutScreen({ language, user, onLogout }: CourseCheckoutScreenProps) {
  const navigate = useNavigate()
  const params = useParams()
  const text = copy[language]
  const { course, isLoading, error } = useCourse(params.courseId)

  if (isLoading) {
    return (
      <main className="course-checkout-page">
        <Navbar user={user} onLogout={onLogout} variant="checkout" />
        <section className="course-checkout-shell">
          <div className="course-checkout-card">
            <p>Memuat halaman checkout...</p>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (!course) {
    return (
      <main className="course-checkout-page">
        <Navbar user={user} onLogout={onLogout} variant="checkout" />
        <section className="course-checkout-shell">
          <div className="course-checkout-card">
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

  const isFree = course.access === 'free'
  const normalPrice = isFree ? 'Rp 399.000' : 'Rp 399.000'
  const classPrice = isFree ? 'Rp 0' : course.priceLabel
  const uniqueCode = isFree ? '— Rp 121' : '— Rp 121'
  const serviceFee = '— Rp 0'
  const totalTransfer = isFree ? 'Rp 1.264.537' : 'Rp 1.264.537'
  const totalPay = isFree ? 'Rp 1.264.537' : 'Rp 1.264.537'

  const selectedClassStats = [
    { label: language === 'id' ? 'Frontend Development' : 'Frontend Development', value: course.languageName },
    { label: language === 'id' ? 'Oleh' : 'By', value: course.mentor },
    { label: language === 'id' ? 'Rating' : 'Rating', value: `${course.rating.toFixed(1)} (${course.modules} modules)` },
  ]

  const contentCards: ContentCard[] = [
    {
      title: `${course.modules} Lessons`,
      description: 'Video pembelajaran terstruktur',
      icon: '▣',
      tag: 'Free',
    },
    {
      title: `${Math.round(course.modules * 3.8)} Hours`,
      description: 'Total durasi pembelajaran',
      icon: '⌚',
      tag: 'Free',
    },
    {
      title: 'Video Only',
      description: 'Tonton kapan saja',
      icon: '▶',
      tag: 'Lifetime',
    },
    {
      title: 'Akses Seumur Hidup',
      description: 'Termasuk update gratis',
      icon: '∞',
      tag: 'Update',
    },
    {
      title: 'Multi Device',
      description: 'HP, laptop, tablet',
      icon: '▣',
      tag: 'Sync',
    },
    {
      title: 'Sertifikat Resmi',
      description: 'Diakui industri',
      icon: '🏆',
      tag: 'Cert',
    },
  ]

  const benefits: BenefitCard[] = [
    {
      title: 'Forum konsultasi mentor',
      description: 'Tanya jawab langsung dengan mentor Premium',
      icon: '👤',
    },
    {
      title: 'Sertifikat berkedalaman resmi',
      description: 'Bisa langsung share ke LinkedIn',
      icon: '🎓',
    },
    {
      title: 'Kesempatan magang & kerja',
      description: 'Akses eksklusif job board mitra',
      icon: '💼',
    },
    {
      title: 'Well-prepared assets',
      description: 'Source code, template, dan design file',
      icon: '📦',
    },
    {
      title: '30 Days Bonus Consultation',
      description: 'Konsultasi 1-on-1 selama 30 hari pertama',
      icon: '🗓',
    },
  ]

  const assets = [
    { title: 'Strategy Freelancer Merangkap Setiap Elements.pdf', tag: 'PDF', icon: '📄' },
    { title: 'Template Document Siap Pakai', tag: 'DOCX', icon: '📋' },
    { title: 'Your First $1,000 on Upwork — eBook', tag: 'eBook', icon: '💰' },
    { title: 'React Component Library Starter Kit', tag: 'ZIP', icon: '🧩' },
    { title: 'Figma Design System Template', tag: 'Figma', icon: '🎨' },
  ]

  const reviews = [
    {
      name: 'Yaji Dzeams of Coding',
      role: 'Frontend Trainee',
      date: '27 Mei 2026',
      quote:
        'Kelas ini mengubah cara aku belajar coding. Penjelasannya sangat detail dan proyeknya langsung bisa dipakai portfolio. Ahmad sabar banget jelasin setiap konsep dari yang paling dasar.',
    },
    {
      name: 'Tini Ardenwati',
      role: 'Career Switcher',
      date: '14 Jun 2026',
      quote:
        'Dari background non-IT, sekarang sudah bisa bikin web app sendiri pakai React. Forum diskusinya juga aktif banget, jadi nggak pernah stuck terlalu lama. Highly recommended!',
    },
    {
      name: 'Haryo Wicaksono',
      role: 'Fullstack Dev',
      date: '18 Jun 2026',
      quote:
        'Materi Next.js App Router-nya paling lengkap yang pernah aku temukan. Project dashboard admin di module 5 langsung aku jadikan bahan interview dan diterima kerja. Thank you!',
    },
  ]

  return (
    <main className="course-checkout-page">
      <Navbar user={user} onLogout={onLogout} variant="checkout" />

      <section className="course-checkout-shell">
        <div className="course-checkout-page-actions">
          <button className="btn btn-secondary course-checkout-back-btn" type="button" onClick={() => navigate(`/courses/${course.id}`)}>
            {text.back}
          </button>
          <span className="course-checkout-chip">{text.summary}</span>
        </div>

        <header className="course-checkout-hero">
          <p className="course-checkout-kicker">{text.title}</p>
          <h1>{text.title}</h1>
          <p className="course-checkout-copy">{text.subtitle}</p>
          <div className="course-checkout-breadcrumbs" aria-label="Breadcrumb">
            <span>Beranda</span>
            <span>□</span>
            <span>{course.languageName}</span>
            <span>□</span>
            <span>{course.title}</span>
            <span>□</span>
            <strong>{text.title}</strong>
          </div>
        </header>

        <div className="course-checkout-layout">
          <div className="course-checkout-main">
            <article className="course-checkout-card course-checkout-selected-card">
              <div className="course-checkout-card__head">
                <div>
                  <p className="course-checkout-card__eyebrow">{text.selectedClass}</p>
                </div>
                <button className="course-checkout-link-button" type="button" onClick={() => navigate(`/courses/${course.id}`)}>
                  {text.changeClass}
                </button>
              </div>

              <div className="course-checkout-selected">
                <div className="course-checkout-selected__thumb" aria-hidden="true">
                  <span>▶</span>
                </div>

                <div className="course-checkout-selected__body">
                  <span className="course-checkout-badge">{course.languageName}</span>
                  <h2>{course.title} — Dari Nol ke Production Ready</h2>
                  <p>oleh {course.mentor} · Senior Frontend Engineer</p>
                  <div className="course-checkout-rating">
                    <span>★★★★★</span>
                    <strong>{course.rating.toFixed(1)}</strong>
                    <small>(2.341 ulasan)</small>
                  </div>
                  <div className="course-checkout-pills">
                    <span>🔥 Terlaris</span>
                    <span>✅ Update Jan 2026</span>
                    <span>{course.modules * 4} jam video</span>
                  </div>
                </div>
              </div>

              <div className="course-checkout-meta-grid">
                {selectedClassStats.map((item) => (
                  <div className="course-checkout-meta-card" key={item.label}>
                    <small>{item.label}</small>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="course-checkout-card course-checkout-content-card">
              <div className="course-checkout-card__head">
                <p className="course-checkout-card__eyebrow">{text.content}</p>
              </div>

              <div className="course-checkout-content-grid">
                {contentCards.map((card) => (
                  <div className="course-checkout-content-item" key={card.title}>
                    <div className="course-checkout-content-icon" aria-hidden="true">
                      {card.icon}
                    </div>
                    <div>
                      <strong>{card.title}</strong>
                      <p>{card.description}</p>
                    </div>
                    <span className="course-checkout-content-tag">{card.tag}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="course-checkout-card course-checkout-benefits-card">
              <div className="course-checkout-card__head">
                <p className="course-checkout-card__eyebrow">{text.benefits}</p>
              </div>

              <div className="course-checkout-benefits-list">
                {benefits.map((item) => (
                  <div className="course-checkout-benefit-item" key={item.title}>
                    <div className="course-checkout-benefit-icon" aria-hidden="true">
                      {item.icon}
                    </div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                    <span>□</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="course-checkout-card course-checkout-assets-card">
              <div className="course-checkout-card__head">
                <p className="course-checkout-card__eyebrow">{text.assets}</p>
              </div>

              <div className="course-checkout-assets-list">
                {assets.map((item) => (
                  <div className="course-checkout-asset-item" key={item.title}>
                    <span className="course-checkout-asset-icon">{item.icon}</span>
                    <strong>{item.title}</strong>
                    <span className="course-checkout-asset-tag">{item.tag}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="course-checkout-card course-checkout-reviews-card">
              <div className="course-checkout-card__head course-checkout-card__head--split">
                <p className="course-checkout-card__eyebrow">{text.reviews}</p>
                <div className="course-checkout-card__rating">
                  <strong>4.9</strong>
                  <span>★★★★★</span>
                  <small>(2.341 ulasan)</small>
                </div>
              </div>

              <div className="course-checkout-reviews-list">
                {reviews.map((review) => (
                  <article className="course-checkout-review-card" key={review.name}>
                    <div className="course-checkout-review-top">
                      <div className="course-checkout-review-avatar">{review.name.slice(0, 2).toUpperCase()}</div>
                      <div>
                        <strong>{review.name}</strong>
                        <p>{review.role}</p>
                      </div>
                      <span>★★★★★</span>
                    </div>
                    <p>{review.quote}</p>
                    <small>{review.date}</small>
                  </article>
                ))}
              </div>
            </article>
          </div>

          <aside className="course-checkout-sidebar">
            <div className="course-checkout-card course-checkout-sticky-card">
              <p className="course-checkout-sidebar-kicker">{text.payment}</p>
              <h2>{text.payment}</h2>

              <div className="course-checkout-payment-methods">
                {[text.transfer, text.card, text.ewallet, text.minimarket].map((method, index) => (
                  <button className={`course-checkout-method ${index === 0 ? 'is-active' : ''}`} key={method} type="button">
                    <span aria-hidden="true">□</span>
                    <strong>{method}</strong>
                  </button>
                ))}
              </div>

              <div className="course-checkout-promo">
                <label htmlFor="promo-code">Kode Promo</label>
                <div className="course-checkout-promo-row">
                  <input id="promo-code" type="text" placeholder="Masukkan kode promo kamu" />
                  <button type="button">{text.usePromo}</button>
                </div>
              </div>

              <div className="course-checkout-payment-details">
                <h3>{text.paymentDetails}</h3>
                <div>
                  <span>{text.normalPrice}</span>
                  <del>{normalPrice}</del>
                </div>
                <div>
                  <span>{text.classPrice}</span>
                  <strong className="is-free">{isFree ? text.freeLabel : course.priceLabel}</strong>
                </div>
                <div>
                  <span>{text.uniqueCode}</span>
                  <strong>{uniqueCode}</strong>
                </div>
                <div>
                  <span>{text.serviceFee}</span>
                  <strong>{serviceFee}</strong>
                </div>
                <div className="course-checkout-payment-details__total">
                  <span>{text.totalTransfer}</span>
                  <strong>{totalTransfer}</strong>
                </div>
              </div>

              <div className="course-checkout-total">
                <span>{text.totalPay}</span>
                <strong>{totalPay}</strong>
              </div>

              <p className="course-checkout-name">
                RH
                <span>
                  Didaftarkan atas nama {user?.name || 'Prototype'} · {user?.email || 'prototype@example.com'}
                </span>
              </p>

              <button className="btn btn-primary course-checkout-action" type="button" onClick={() => navigate(`/courses/${course.id}/learn`)}>
                {text.payNow}
              </button>

              <p className="course-checkout-security">
                <span aria-hidden="true">□</span>
                <strong>{text.security}</strong>
              </p>

              <div className="course-checkout-trust-grid">
                <div>Garansi uang kembali 30 hari</div>
                <div>Akses seumur hidup</div>
                <div>Dukungan 24/7</div>
                <div>Sertifikat resmi</div>
              </div>

              <p className="course-checkout-terms">
                Dengan melanjutkan, kamu menyetujui <strong>Syarat & Ketentuan</strong> dan <strong>Kebijakan Privasi</strong> Coding Study.
              </p>

              <div className="course-checkout-proof">
                <strong>{text.trust}</strong>
                <div>
                  <span>Rating 4.9/5</span>
                  <span>12k+ Alumni</span>
                  <span>Top Platform 2025</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CourseCheckoutScreen
