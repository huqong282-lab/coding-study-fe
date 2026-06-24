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
    overview: 'Ringkasan kursus',
    released: 'Rilis',
    updated: 'Terakhir diperbarui',
    members: 'Member',
    lessonType: 'Tipe lesson',
    certificate: 'Sertifikat',
    consultation: 'Konsultasi',
    outcomes: 'Hasil belajar',
    syllabus: 'Silabus',
    mentor: 'Mentor',
    modules: 'Modul',
    duration: 'Durasi',
    rating: 'Rating',
    courseType: 'Video Only',
    joinCourse: 'Gabung Kelas',
    payCourse: 'Bayar',
    moreLessons: 'lebih banyak lesson',
    watchOnYoutube: 'Tonton di YouTube',
    notFound: 'Kursus tidak ditemukan.',
  },
  en: {
    back: 'Back to home',
    overview: 'Course overview',
    released: 'Released',
    updated: 'Last updated',
    members: 'Members',
    lessonType: 'Lesson type',
    certificate: 'Certificate',
    consultation: 'Consultation',
    outcomes: 'Learning outcomes',
    syllabus: 'Syllabus',
    mentor: 'Mentor',
    modules: 'Modules',
    duration: 'Duration',
    rating: 'Rating',
    courseType: 'Video Only',
    joinCourse: 'Join Class',
    payCourse: 'Pay',
    moreLessons: 'more lessons',
    watchOnYoutube: 'Watch on YouTube',
    notFound: 'Course not found.',
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
      course?.syllabus.slice(0, 4).map((lesson, index) => ({
        title: lesson,
        duration: `${Math.max(3, 5 - Math.min(index, 2))} ${language === 'id' ? 'menit' : 'mins'}`,
      })) ?? [],
    [course, language],
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

  const remainingLessons = Math.max(course.modules - lessonPreview.length, 0)
  const totalMinutes = course.modules * 3
  const heroSnapshots = [
    { label: text.released, value: 'June 2022' },
    { label: text.updated, value: 'June 2026' },
  ]
  const stats = [
    { label: text.members, value: `${(course.modules * 1650).toLocaleString(language === 'id' ? 'id-ID' : 'en-US')} enrolled` },
    { label: text.lessonType, value: text.courseType },
    { label: language === 'id' ? 'Tingkatan' : 'Level', value: course.level },
    { label: language === 'id' ? 'Akses' : 'Access', value: course.priceLabel },
    { label: text.certificate, value: '✓' },
  ]

  const ctaLabel = course.access === 'free' ? text.joinCourse : text.payCourse
  const ctaTarget = course.access === 'free' ? `/courses/${course.id}/learn` : `/courses/${course.id}/checkout`
  const accessLabel = course.access === 'paid' ? (language === 'id' ? 'Selamanya' : 'Lifetime access') : (language === 'id' ? 'Gratis' : 'Free')

  return (
    <main className="course-detail-page">
      <Navbar user={user} onLogout={onLogout} />
      <section className="course-detail-shell">
        <div className="course-detail-page-actions">
          <button
            className="btn btn-secondary course-detail-back-btn course-detail-back-btn-floating"
            type="button"
            onClick={() => navigate('/home')}
          >
            {text.back}
          </button>
        </div>

        <CourseDetailHero
          eyebrow={text.overview}
          title={course.title}
          description={course.description}
          snapshots={heroSnapshots}
          badges={[course.languageName, course.level, `${text.modules}: ${course.modules}`, course.priceLabel]}
        />

        <CourseDetailStats items={stats} />

        <div className="course-detail-main-grid">
          <CourseTrailerPanel
            title={`Trailer Kelas ${course.title} [Gratis]`}
            mentor={course.mentor}
            accentLabel={text.watchOnYoutube}
          />

          <CoursePurchasePanel
            accessLabel={accessLabel}
            title={course.title}
            priceLabel={course.priceLabel}
            description={course.description}
            summaryLabel={`${course.modules} lessons (${totalMinutes} mins)`}
            lessons={lessonPreview}
            remainingLessonsLabel={remainingLessons > 0 ? `${remainingLessons} ${text.moreLessons}` : ''}
            ctaLabel={ctaLabel}
            onCtaClick={() => navigate(ctaTarget)}
          />
        </div>

        <div className="course-detail-content-grid">
          <CourseDetailListPanel eyebrow={text.outcomes} title={text.outcomes} items={course.outcomes} />
          <CourseDetailListPanel eyebrow={text.syllabus} title={text.syllabus} items={course.syllabus} variant="numbered" />
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default CourseDetailScreen
