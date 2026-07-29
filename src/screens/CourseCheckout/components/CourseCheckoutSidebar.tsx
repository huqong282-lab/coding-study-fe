type CourseCheckoutSidebarProps = {
  badge: string
  title: string
  priceLabel: string
  note: string
  details: Array<{ label: string; value: string }>
  highlights: string[]
  actionLabel: string
  onActionClick: () => void
}

function CourseCheckoutSidebar({
  badge,
  title,
  priceLabel,
  note,
  details,
  highlights,
  actionLabel,
  onActionClick,
}: CourseCheckoutSidebarProps) {
  return (
    <aside className="course-checkout-sidebar">
      <div className="course-checkout-card course-checkout-sticky-card">
        <p className="course-checkout-sidebar-kicker">{badge}</p>
        <h2>{title}</h2>
        <strong className="course-checkout-sidebar-price">{priceLabel}</strong>
        <p className="course-checkout-note">{note}</p>

        <div className="course-checkout-details">
          {details.map((detail) => (
            <div key={detail.label}>
              <small>{detail.label}</small>
              <strong>{detail.value}</strong>
            </div>
          ))}
        </div>

        <div className="course-checkout-highlights" aria-label="Keuntungan pembayaran">
          {highlights.map((item) => (
            <div className="course-checkout-highlight" key={item}>
              <span aria-hidden="true">+</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-primary course-checkout-action" type="button" onClick={onActionClick}>
          {actionLabel}
        </button>
      </div>
    </aside>
  )
}

export default CourseCheckoutSidebar
