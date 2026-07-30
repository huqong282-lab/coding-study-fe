type CourseCheckoutStat = {
  label: string
  value: string
}

type CourseCheckoutHeroProps = {
  eyebrow: string
  title: string
  description: string
  stats: CourseCheckoutStat[]
}

function CourseCheckoutHero({ eyebrow, title, description, stats }: CourseCheckoutHeroProps) {
  return (
    <section className="course-checkout-hero" aria-labelledby="course-checkout-title">
      <div className="course-checkout-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="course-checkout-title">{title}</h1>
        <p className="course-checkout-copy">{description}</p>
      </div>

      <div className="course-checkout-summary" aria-label="Ringkasan kelas">
        {stats.map((stat) => (
          <div key={stat.label}>
            <small>{stat.label}</small>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CourseCheckoutHero
