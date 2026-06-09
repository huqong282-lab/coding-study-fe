const testimonials = [
  {
    title: 'Alur Belajar Jelas',
    quote: 'Cocok banget untuk pemula yang butuh arahan belajar UI dan web development.',
    name: 'Rizqy',
    role: 'UI/UX Designer',
  },
  {
    title: 'Always Up to Date',
    quote: 'Materinya terasa relevan dengan tools yang dipakai di pekerjaan sekarang.',
    name: 'Edi',
    role: 'Full-Stack Developer',
  },
  {
    title: 'Discover and Learn',
    quote: 'Setiap kelas punya latihan kecil yang bikin konsepnya lebih cepat nyangkut.',
    name: 'Sharen',
    role: 'Front-End Developer',
  },
  {
    title: 'Hemat Waktu',
    quote: 'Saya tidak perlu bingung mulai dari mana karena kurikulumnya sudah rapi.',
    name: 'Aqil',
    role: 'Front-End Developer',
  },
]

function Testimonials() {
  return (
    <section className="bwa-testimonial-section" aria-labelledby="testimonial-title">
      <div className="testimonial-copy">
        <p>Trusted By 900K+ Students</p>
        <h1 id="testimonial-title">Join Our Supportive Community</h1>
        <span>Coding Study menyediakan komunitas belajar UI/UX design dan web development untuk pemula ke mahir.</span>
        <div className="testimonial-actions">
          <a className="btn btn-primary" href="#library">Katalog Kelas</a>
          <a className="btn btn-secondary" href="#testimonials">Karya Students</a>
        </div>
      </div>

      <div className="testimonial-grid" id="testimonials">
        {testimonials.map((item, index) => (
          <article className="testimonial-card" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.quote}</p>
            <div>
              <span>{item.name.charAt(0)}</span>
              <strong>{item.name}</strong>
              <small>{item.role}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
