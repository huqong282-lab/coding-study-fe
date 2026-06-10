type CourseTrailerPanelProps = {
  title: string
  mentor: string
  accentLabel: string
}

function CourseTrailerPanel({ title, mentor, accentLabel }: CourseTrailerPanelProps) {
  return (
    <section className="course-detail-trailer" aria-labelledby="course-trailer-title">
      <div className="course-detail-trailer-header">
        <div>
          <p className="eyebrow">Trailer</p>
          <h2 id="course-trailer-title">{title}</h2>
          <p>{mentor}</p>
        </div>
        <span className="course-detail-trailer-chip">{accentLabel}</span>
      </div>

      <div className="course-detail-trailer-stage" aria-hidden="true">
        <span className="course-detail-trailer-line course-detail-line-left-top" />
        <span className="course-detail-trailer-line course-detail-line-left-middle" />
        <span className="course-detail-trailer-line course-detail-line-left-bottom" />
        <span className="course-detail-trailer-line course-detail-line-right-top" />
        <span className="course-detail-trailer-line course-detail-line-right-middle" />
        <span className="course-detail-trailer-line course-detail-line-right-bottom" />

        <span className="course-detail-tech-node course-detail-tech-node-left-top">F</span>
        <span className="course-detail-tech-node course-detail-tech-node-left-middle">L</span>
        <span className="course-detail-tech-node course-detail-tech-node-left-bottom">C</span>
        <span className="course-detail-tech-node course-detail-tech-node-center">
          <span>▶</span>
        </span>
        <span className="course-detail-tech-node course-detail-tech-node-right-top">T</span>
        <span className="course-detail-tech-node course-detail-tech-node-right-middle">R</span>
        <span className="course-detail-tech-node course-detail-tech-node-right-bottom">V</span>
      </div>

      <div className="course-detail-trailer-footer">
        <span />
        <strong>Tonton di YouTube</strong>
      </div>
    </section>
  )
}

export default CourseTrailerPanel
