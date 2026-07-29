type CourseCheckoutOverviewProps = {
  title: string
  subtitle: string
  items: string[]
}

function CourseCheckoutOverview({ title, subtitle, items }: CourseCheckoutOverviewProps) {
  return (
    <article className="course-checkout-card course-checkout-overview">
      <p className="course-checkout-kicker">{title}</p>
      <h2>{subtitle}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}

export default CourseCheckoutOverview
