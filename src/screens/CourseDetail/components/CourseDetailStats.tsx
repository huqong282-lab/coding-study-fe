type CourseDetailStat = {
  label: string
  value: string
}

type CourseDetailStatsProps = {
  items: CourseDetailStat[]
}

function CourseDetailStats({ items }: CourseDetailStatsProps) {
  return (
    <section className="course-detail-stats" aria-label="Statistik kursus">
      {items.map((item) => (
        <article className="course-detail-stat-card" key={item.label}>
          <p>{item.label}</p>
          <strong>{item.value}</strong>
        </article>
      ))}
    </section>
  )
}

export default CourseDetailStats
