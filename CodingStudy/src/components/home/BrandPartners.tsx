const partners = ['BCA', 'J&T Express', 'tokopedia', 'tiket.com', 'Kawan Lama', 'traveloka', 'Grab', 'Bluebird', 'Telkomsel', 'BANK DKI', '30+ More']

function BrandPartners() {
  return (
    <section className="bwa-section bwa-partner-section" aria-labelledby="partner-title">
      <div className="bwa-section-heading">
        <p>Mengikuti Jejak Orang Sukses</p>
        <h1 id="partner-title">Alumni Coding Study Bekerja Pada Perusahaan Besar dan Terkenal</h1>
      </div>

      <div className="partner-grid" aria-label="Brand partner dan perusahaan alumni">
        {partners.map((partner) => (
          <div className="partner-logo-card" key={partner}>
            {partner}
          </div>
        ))}
      </div>
    </section>
  )
}

export default BrandPartners
