type CourseLessonPreview = {
  title: string
  duration: string
  accessLabel: string
}

type CourseTrailerPanelProps = {
  title: string
  mentor: string
  accentLabel: string
  lessons: CourseLessonPreview[]
  accessLabel: string
}

function CourseTrailerPanel({ title, mentor, accentLabel, lessons, accessLabel }: CourseTrailerPanelProps) {
  return (
    <section className="course-detail-trailer" aria-labelledby="course-trailer-title">
      <div className="course-detail-trailer-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h2 id="course-trailer-title">{accentLabel}</h2>
          <p>{mentor}</p>
        </div>
        <span className="course-detail-trailer-chip">{accessLabel}</span>
      </div>

      <div className="course-detail-preview-list" aria-label="Preview lesson">
        {lessons.map((lesson, index) => (
          <article className="course-detail-preview-item" key={`${lesson.title}-${index}`}>
            <div className="course-detail-preview-thumb" aria-hidden="true">
              <span>PLAY</span>
            </div>

            <div className="course-detail-preview-copy">
              <strong>{lesson.title}</strong>
              <p>{lesson.duration}</p>
              <span className={`course-detail-preview-badge ${lesson.accessLabel === 'Free' || lesson.accessLabel === 'Gratis' ? 'is-free' : 'is-paid'}`}>
                {lesson.accessLabel}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="course-detail-trailer-footer">
        <span />
        <strong>{mentor}</strong>
      </div>
    </section>
  )
}

export default CourseTrailerPanel
