const partners = ['BCA', 'J&T Express', 'Telkom', 'UberLearn', 'Kawan Lama', 'Iconlabs', 'Grab', 'Bluebird', 'TaRumsel', 'BANK DKI']

function BrandPartners() {
  return (
    <section className="home-section home-section--partners" id="community" aria-labelledby="partner-title">
      <div className="home-section__header home-section__header--center">
        <p className="home-section-kicker">ALUMNI BEKERJA DI</p>
        <h2 className="home-section-title home-section-title--compact" id="partner-title">
          Ribuan alumni Coding Study sudah berkarir di perusahaan ternama
        </h2>
      </div>

      <div className="partner-marquee" aria-label="Brand partner dan perusahaan alumni">
        {partners.map((partner) => (
          <div className="partner-marquee__item" key={partner}>
            {partner}
          </div>
        ))}
      </div>
    </section>
  )
}

export default BrandPartners
