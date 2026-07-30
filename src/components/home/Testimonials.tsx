const benefits = [
  {
    icon: '🧰',
    title: 'Akses Lowongan Kerja',
    description: 'Dapatkan akses eksklusif ke job board khusus member dan koneksi ke recruiter.',
  },
  {
    icon: '🔎',
    title: 'Selalu Update',
    description: 'Kurikulum diperbarui mengikuti perkembangan teknologi dan kebutuhan industri.',
  },
  {
    icon: '⏱',
    title: 'Belajar Sesuai Waktu',
    description: 'Video, materi tertulis, dan latihan soal tersedia 24/7 kapan saja kamu butuh.',
  },
  {
    icon: '🧪',
    title: 'Project Nyata',
    description: 'Setiap kelas punya project portfolio yang bisa langsung masuk GitHub dan resume.',
  },
  {
    icon: '👥',
    title: 'Komunitas Aktif',
    description: 'Forum diskusi, live coding mingguan, dan peer review untuk bantu kamu konsisten.',
  },
  {
    icon: '📜',
    title: 'Sertifikat Resmi',
    description: 'Sertifikat verifikasi yang bisa dibagikan ke LinkedIn dan dipakai untuk portfolio.',
  },
]

function Testimonials() {
  return (
    <section className="home-section home-section--benefits" aria-labelledby="benefit-title">
      <div className="home-section__header home-section__header--stacked">
        <p className="home-section-kicker">MENGAPA CODING STUDY</p>
        <h2 className="home-section-title" id="benefit-title">
          Lebih dari Sekadar <span>Menonton Video</span>
        </h2>
      </div>

      <div className="benefit-grid">
        {benefits.map((item) => (
          <article className="benefit-card" key={item.title}>
            <span className="benefit-card__icon" aria-hidden="true">
              {item.icon}
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
