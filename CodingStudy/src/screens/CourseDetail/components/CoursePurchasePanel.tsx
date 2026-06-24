type CourseLessonPreview = {
  title: string
  duration: string
}

type CoursePurchasePanelProps = {
  accessLabel: string
  title: string
  priceLabel: string
  description: string
  summaryLabel: string
  lessons: CourseLessonPreview[]
  remainingLessonsLabel: string
  ctaLabel: string
  onCtaClick: () => void
}

function CoursePurchasePanel({
  accessLabel,
  title,
  priceLabel,
  description,
  summaryLabel,
  lessons,
  remainingLessonsLabel,
  ctaLabel,
  onCtaClick,
}: CoursePurchasePanelProps) {
  return (
    <aside className="course-purchase-card" aria-labelledby="course-purchase-title">
      <div className="course-purchase-header">
        <span className="course-purchase-icon" aria-hidden="true">
          *
        </span>

        <div className="course-purchase-heading">
          <p className="course-purchase-kicker">{accessLabel}</p>
          <h2 id="course-purchase-title">{title}</h2>
          <strong className="course-purchase-price">{priceLabel}</strong>
          <p className="course-purchase-description">{description}</p>
        </div>
      </div>

      <div className="course-purchase-divider" />

      <p className="course-purchase-summary">{summaryLabel}</p>

      <div className="course-purchase-lessons" aria-label="Preview lesson">
        {lessons.map((lesson) => (
          <div className="course-purchase-lesson" key={lesson.title}>
            <span className="course-purchase-lesson-bullet" aria-hidden="true">
              ▶
            </span>
            <span className="course-purchase-lesson-title">{lesson.title}</span>
            <strong>{lesson.duration}</strong>
          </div>
        ))}

        {remainingLessonsLabel ? (
          <div className="course-purchase-lesson course-purchase-lesson-more">
            <span className="course-purchase-lesson-bullet" aria-hidden="true">
              ▶
            </span>
            <span className="course-purchase-lesson-title">{remainingLessonsLabel}</span>
          </div>
        ) : null}
      </div>

      <button className="btn btn-primary course-purchase-action" type="button" onClick={onCtaClick}>
        {ctaLabel}
      </button>
    </aside>
  )
}

export default CoursePurchasePanel
