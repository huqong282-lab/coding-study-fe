import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { courseCatalog } from '../../data/courses'

type Language = 'id' | 'en'

type Course = (typeof courseCatalog)[number]

type CourseDetailScreenProps = {
  language?: Language
}

const copy = {
  id: {
    back: 'Kembali ke beranda',
    overview: 'Ringkasan kursus',
    outcomes: 'Hasil belajar',
    syllabus: 'Silabus',
    mentor: 'Mentor',
    modules: 'Modul',
    duration: 'Durasi',
    rating: 'Rating',
    notFound: 'Kursus tidak ditemukan.',
  },
  en: {
    back: 'Back to home',
    overview: 'Course overview',
    outcomes: 'Learning outcomes',
    syllabus: 'Syllabus',
    mentor: 'Mentor',
    modules: 'Modules',
    duration: 'Duration',
    rating: 'Rating',
    notFound: 'Course not found.',
  },
}

function CourseDetailScreen({ language = 'id' }: CourseDetailScreenProps) {
  const navigate = useNavigate()
  const params = useParams()
  const text = copy[language]
  const course = useMemo<Course | undefined>(
    () => courseCatalog.find((item) => String(item.id) === params.courseId),
    [params.courseId],
  )

  if (!course) {
    return (
      <main className="course-detail-page">
        <section className="course-detail-card">
          <p>{text.notFound}</p>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/home')}>
            {text.back}
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="course-detail-page">
      <section className="course-detail-card">
        <div className="course-detail-header">
          <div>
            <p className="eyebrow">{text.overview}</p>
            <h1>{course.title}</h1>
            <p className="course-detail-description">{course.description}</p>
          </div>

          <button className="btn btn-secondary" type="button" onClick={() => navigate('/home')}>
            {text.back}
          </button>
        </div>

        <div className="course-detail-meta">
          <span>{course.languageName}</span>
          <span>{course.level}</span>
          <span>
            {text.rating}: {course.rating}
          </span>
          <span>
            {text.modules}: {course.modules}
          </span>
          <span>
            {text.duration}: {course.duration}
          </span>
          <span>
            {text.mentor}: {course.mentor}
          </span>
        </div>

        <div className="course-detail-grid">
          <section className="course-detail-panel">
            <h2>{text.outcomes}</h2>
            <ul>
              {course.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="course-detail-panel">
            <h2>{text.syllabus}</h2>
            <ol>
              {course.syllabus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
        </div>
      </section>
    </main>
  )
}

export default CourseDetailScreen
