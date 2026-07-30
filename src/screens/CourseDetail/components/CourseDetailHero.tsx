type CourseDetailSnapshot = {
  label: string
  value: string
}

type CourseDetailHeroProps = {
  eyebrow: string
  title: string
  description: string
  snapshots: CourseDetailSnapshot[]
  badges: string[]
}

function CourseDetailHero({
  eyebrow,
  title,
  description,
  snapshots,
  badges,
}: CourseDetailHeroProps) {
  return (
    <section className="course-detail-hero" aria-labelledby="course-detail-title">
      <div className="course-detail-hero-top">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="course-detail-title">{title}</h1>
          <p className="course-detail-description">{description}</p>
        </div>
      </div>

      <div className="course-detail-release-row" aria-label="Informasi kursus">
        {snapshots.map((snapshot) => (
          <div className="course-detail-release-pill" key={snapshot.label}>
            <span className="course-detail-release-icon" aria-hidden="true">
              {snapshot.label.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <small>{snapshot.label}</small>
              <strong>{snapshot.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="course-detail-badges" aria-label="Ringkasan kursus">
        {badges.map((badge) => (
          <span key={badge}>{badge}</span>
        ))}
      </div>
    </section>
  )
}

export default CourseDetailHero
