type CourseLesson = {
  title: string
  duration: string
}

type CourseLessonsPanelProps = {
  heading: string
  lessons: CourseLesson[]
  moreLessonsLabel: string
  ctaLabel: string
  onCtaClick: () => void
}

function CourseLessonsPanel({
  heading,
  lessons,
  moreLessonsLabel,
  ctaLabel,
  onCtaClick,
}: CourseLessonsPanelProps) {
  return (
    <aside className="course-detail-lessons" aria-labelledby="course-lessons-title">
      <div className="course-detail-lessons-head">
        <h2 id="course-lessons-title">{heading}</h2>
      </div>

      <div className="course-detail-lessons-list">
        {lessons.map((lesson) => (
          <button className="course-detail-lesson-item" type="button" key={lesson.title}>
            <span className="course-detail-lesson-play" aria-hidden="true">
              ▶
            </span>
            <span className="course-detail-lesson-title">{lesson.title}</span>
            <strong>{lesson.duration}</strong>
          </button>
        ))}

        {moreLessonsLabel ? (
          <button className="course-detail-lesson-item course-detail-lesson-item-more" type="button">
            <span className="course-detail-lesson-play" aria-hidden="true">
              ▶
            </span>
            <span className="course-detail-lesson-title">{moreLessonsLabel}</span>
          </button>
        ) : null}
      </div>

      <button className="btn btn-primary course-detail-cta" type="button" onClick={onCtaClick}>
        {ctaLabel}
      </button>
    </aside>
  )
}

export default CourseLessonsPanel
