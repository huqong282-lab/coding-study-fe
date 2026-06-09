import type { Course } from '../../data/courses'

type CourseShowcaseProps = {
  courses: Course[]
  onOpenCourse?: (course: Course) => void
}

const thumbnailThemes = [
  {
    accent: '#36d1dc',
    panel: '#201a4d',
    shape: 'Web',
  },
  {
    accent: '#ffb84d',
    panel: '#133f63',
    shape: 'Code',
  },
  {
    accent: '#7c5cff',
    panel: '#263d2d',
    shape: 'API',
  },
  {
    accent: '#2ed47a',
    panel: '#412143',
    shape: 'Data',
  },
]

function CourseThumbnail({ index, title }: { index: number; title: string }) {
  const theme = thumbnailThemes[index % thumbnailThemes.length]

  return (
    <div className="bwa-course-thumbnail" style={{ backgroundColor: theme.panel }}>
      <div className="thumbnail-window">
        <span />
        <span />
        <span />
      </div>
      <div className="thumbnail-card-main" style={{ borderColor: theme.accent }}>
        <strong>{theme.shape}</strong>
        <small>{title.split(' ').slice(0, 2).join(' ')}</small>
      </div>
      <div className="thumbnail-code-lines" aria-hidden="true">
        <span style={{ width: '72%' }} />
        <span style={{ width: '54%' }} />
        <span style={{ width: '84%' }} />
      </div>
    </div>
  )
}

function CourseShowcase({ courses, onOpenCourse }: CourseShowcaseProps) {
  const carouselCourses = [...courses, ...courses]

  return (
    <section className="bwa-section bwa-course-section" id="library" aria-labelledby="bwa-course-title">
      <div className="bwa-section-heading">
        <p>Rekomendasi Kelas</p>
        <h1 id="bwa-course-title">Kelas Online Sesuai Dengan Karirmu</h1>
      </div>

      <div className="bwa-course-rail" aria-label="Daftar kelas pilihan">
        {carouselCourses.map((course, index) => (
          <article className="bwa-course-card" key={`${course.id}-${index}`}>
            <button
              className="bwa-course-media"
              type="button"
              onClick={() => onOpenCourse?.(course)}
              aria-label={`Lihat video dan detail ${course.title}`}
            >
              <CourseThumbnail index={index} title={course.title} />
              <span className="bwa-video-overlay">
                <span className="bwa-play-icon">▶</span>
                Mulai Video
              </span>
            </button>

            <div className="bwa-course-body">
              <h2>{course.title}</h2>
              <p>{course.duration} belajar intensif</p>
              <div className="bwa-course-rating" aria-label={`Rating ${course.rating}`}>
                <span>★★★★★</span>
                <strong>({course.rating})</strong>
              </div>
              <div className="bwa-course-footer">
                <span>{course.level}</span>
                <span>{course.modules} materi</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CourseShowcase
