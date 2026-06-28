type CoursePurchasePanelProps = {
  accessLabel: string
  accessTone: 'free' | 'paid'
  title: string
  priceLabel: string
  description: string
  summaryLabel: string
  ctaLabel: string
  ctaNote: string
  onCtaClick: () => void
}

function CoursePurchasePanel({
  accessLabel,
  accessTone,
  title,
  priceLabel,
  description,
  summaryLabel,
  ctaLabel,
  ctaNote,
  onCtaClick,
}: CoursePurchasePanelProps) {
  return (
    <aside className="course-purchase-card" aria-labelledby="course-purchase-title">
      <div className={`course-purchase-header ${accessTone === 'free' ? 'is-free' : 'is-paid'}`}>
        <div className="course-purchase-stage" aria-hidden="true">
          <span className="course-purchase-stage__line course-purchase-stage__line--top" />
          <span className="course-purchase-stage__line course-purchase-stage__line--bottom" />
          <span className="course-purchase-stage__play">PLAY</span>
        </div>
        <p className="course-purchase-stage-copy">
          {accessTone === 'free' ? 'Preview kelas gratis - 3:24' : 'Preview premium - 3:24'}
        </p>
      </div>

      <div className="course-purchase-heading">
        <p className={`course-purchase-kicker ${accessTone === 'free' ? 'is-free' : 'is-paid'}`}>{accessLabel}</p>
        <h2 id="course-purchase-title">{title}</h2>
        <div className="course-purchase-price-row">
          <strong className="course-purchase-price">{priceLabel}</strong>
          <span className={`course-purchase-offer ${accessTone === 'free' ? 'is-free' : 'is-paid'}`}>
            {accessTone === 'free' ? '100% OFF' : 'Lifetime access'}
          </span>
        </div>
        <p className="course-purchase-description">{description}</p>
      </div>

      <p className="course-purchase-note">{ctaNote}</p>

      <button className="btn btn-primary course-purchase-action" type="button" onClick={onCtaClick}>
        {ctaLabel}
      </button>

      <div className="course-purchase-summary-card">
        <p className="course-purchase-summary-label">{summaryLabel}</p>
        <p className="course-purchase-summary-copy">
          {accessTone === 'free' ? 'Cocok untuk mulai cepat tanpa biaya.' : 'Bayar sekali, akses materi selamanya.'}
        </p>
      </div>
    </aside>
  )
}

export default CoursePurchasePanel
