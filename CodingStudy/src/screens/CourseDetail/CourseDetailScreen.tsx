import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { courseCatalog } from '../../data/courses'
import type { Course } from '../../types/product'
import type { AppUser, Language } from '../../types/user'
import CourseDetailHero from './components/CourseDetailHero'
import CourseDetailListPanel from './components/CourseDetailListPanel'
import CourseDetailStats from './components/CourseDetailStats'
import CourseTrailerPanel from './components/CourseTrailerPanel'
import CoursePurchasePanel from './components/CoursePurchasePanel'

type CourseDetailScreenProps = {
  language: Language
  user?: AppUser | null
  onLogout: () => void
}

const copy = {
  id: {
    back: 'Kembali ke beranda',
    breadcrumbHome: 'Beranda',
    outcomes: 'Yang Akan Kamu Pelajari',
    syllabus: 'Kurikulum',
    rating: 'Rating',
    modules: 'Modul',
    duration: 'Durasi',
    notFound: 'Kursus tidak ditemukan.',
    tabs: ['Ringkasan', 'Kurikulum', 'Instruktur', 'Ulasan', 'Harga'],
    previewVideo: 'Preview Video',
    lessonPreview: 'Preview lesson',
    free: 'Gratis',
    premium: 'Premium',
    startFree: 'Daftar Kelas Sekarang',
    payNow: 'Bayar Sekarang',
    lifetimeAccess: 'Akses seumur hidup',
    instantAccess: 'Langsung akses setelah daftar',
  },
  en: {
    back: 'Back to home',
    breadcrumbHome: 'Home',
    outcomes: 'What You Will Learn',
    syllabus: 'Curriculum',
    rating: 'Rating',
    modules: 'Modules',
    duration: 'Duration',
    notFound: 'Course not found.',
    tabs: ['Summary', 'Curriculum', 'Instructor', 'Reviews', 'Pricing'],
    previewVideo: 'Preview Video',
    lessonPreview: 'Lesson preview',
    free: 'Free',
    premium: 'Premium',
    startFree: 'Join Class Now',
    payNow: 'Pay Now',
    lifetimeAccess: 'Lifetime access',
    instantAccess: 'Instant access after signup',
  },
}

function CourseDetailScreen({ language, user, onLogout }: CourseDetailScreenProps) {
  const navigate = useNavigate()
  const params = useParams()
  const text = copy[language]

  const course = useMemo<Course | undefined>(
    () => courseCatalog.find((item) => String(item.id) === params.courseId),
    [params.courseId],
  )

  const lessonPreview = useMemo(
    () =>
      course?.syllabus.slice(0, 5).map((lesson, index) => {
        const isPreviewFree = course.access === 'free' || index < 2

        return {
          title: lesson,
          duration: `${Math.max(3, 5 - Math.min(index, 2))} ${language === 'id' ? 'menit' : 'mins'}`,
          accessLabel: isPreviewFree ? text.free : text.premium,
        }
      }) ?? [],
    [course, language, text.free, text.premium],
  )

  if (!course) {
    return (
      <main className="course-detail-page">
        <Navbar user={user} onLogout={onLogout} />
        <section className="course-detail-card">
          <p>{text.notFound}</p>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/home')}>
            {text.back}
          </button>
        </section>
        <Footer />
      </main>
    )
  }

  const totalMinutes = course.modules * 3
  const isFree = course.access === 'free'
  const accessLabel = isFree ? text.free : text.premium
  const ctaLabel = isFree ? text.startFree : text.payNow
  const ctaTarget = isFree ? `/courses/${course.id}/learn` : `/courses/${course.id}/checkout`
  const heroSnapshots = [
    { label: language === 'id' ? 'Rilis' : 'Released', value: 'June 2022' },
    { label: language === 'id' ? 'Update' : 'Updated', value: 'June 2026' },
  ]
  const stats = [
    { label: text.rating, value: `${course.rating.toFixed(1)} / 5` },
    {
      label: language === 'id' ? 'Siswa' : 'Students',
      value: `${(course.modules * 1650).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')}+`,
    },
    { label: text.modules, value: `${course.modules}` },
    { label: text.duration, value: course.duration },
    { label: language === 'id' ? 'Akses' : 'Access', value: course.priceLabel },
  ]

  return (
    <main className="course-detail-page">
      <Navbar user={user} onLogout={onLogout} />

      <section className="course-detail-shell">
        <div className="course-detail-page-actions">
          <button className="btn btn-secondary course-detail-back-btn" type="button" onClick={() => navigate('/home')}>
            {text.back}
          </button>
        </div>

        <nav className="course-detail-breadcrumbs" aria-label="Breadcrumb">
          <span>{text.breadcrumbHome}</span>
          <span>/</span>
          <span>{course.languageName}</span>
          <span>/</span>
          <strong>{course.title}</strong>
        </nav>

        <div className="course-detail-hero-layout">
          <CourseDetailHero
            eyebrow={course.languageName}
            title={course.title}
            description={course.description}
            snapshots={heroSnapshots}
            badges={[course.level, `${text.modules}: ${course.modules}`, course.priceLabel, course.mentor]}
          />

          <CoursePurchasePanel
            accessLabel={accessLabel}
            accessTone={course.access}
            title={course.title}
            priceLabel={course.priceLabel}
            description={course.description}
            summaryLabel={`${course.modules} lessons (${totalMinutes} mins)`}
            ctaLabel={ctaLabel}
            ctaNote={isFree ? text.instantAccess : text.lifetimeAccess}
            onCtaClick={() => navigate(ctaTarget)}
          />
        </div>

        <CourseDetailStats items={stats} />

        <div className="course-detail-tabs" role="tablist" aria-label="Course detail tabs">
          {text.tabs.map((tab, index) => (
            <button className={index === 0 ? 'is-active' : ''} key={tab} type="button">
              {tab}
            </button>
          ))}
        </div>

        <div className="course-detail-content-grid">
          <div className="course-detail-main-column">
            <CourseDetailListPanel eyebrow={text.outcomes} title={text.outcomes} items={course.outcomes} />
            <CourseDetailListPanel eyebrow={text.syllabus} title={text.syllabus} items={course.syllabus} variant="numbered" />
          </div>

          <CourseTrailerPanel
            title={text.previewVideo}
            mentor={course.mentor}
            accentLabel={text.lessonPreview}
            lessons={lessonPreview}
            accessLabel={accessLabel}
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default CourseDetailScreen
