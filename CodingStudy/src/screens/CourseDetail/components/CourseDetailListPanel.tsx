type CourseDetailListPanelProps = {
  eyebrow: string
  title: string
  items: string[]
  variant?: 'bullet' | 'numbered'
}

function CourseDetailListPanel({ eyebrow, title, items, variant = 'bullet' }: CourseDetailListPanelProps) {
  const panelId = title.toLowerCase().replace(/\s+/g, '-')

  return (
    <section className="course-detail-list-panel" aria-labelledby={panelId}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={panelId}>{title}</h2>

      {variant === 'numbered' ? (
        <ol className="course-detail-list-numbered">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="course-detail-list-bullets">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default CourseDetailListPanel
