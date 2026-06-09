const faqs = [
  {
    question: 'Apakah seorang pemula bisa ikut belajar?',
    answer: 'Bisa. Materi dimulai dari fundamental, lalu naik bertahap ke project sederhana.',
  },
  {
    question: 'Apakah Coding Study menyediakan beasiswa?',
    answer: 'Beasiswa dibuka berkala melalui program promo, komunitas, dan partner tertentu.',
  },
  {
    question: 'Apakah tersedia komunitas kelas belajar?',
    answer: 'Tersedia komunitas diskusi untuk tanya jawab, feedback project, dan networking.',
  },
  {
    question: 'Privilege lain apa lagi yang bisa saya dapatkan?',
    answer: 'Kamu mendapat materi update, akses detail kelas, latihan project, dan rekomendasi belajar.',
  },
  {
    question: 'Bagaimana cara memulai switch career?',
    answer: 'Mulai dari kelas dasar sesuai role, susun portfolio kecil, lalu lanjut ke kelas project.',
  },
]

function FaqSection() {
  return (
    <section className="bwa-section bwa-faq-section" aria-labelledby="faq-title">
      <div className="bwa-section-heading">
        <p>Tanya Coding Study</p>
        <h1 id="faq-title">Frequently Asked Questions</h1>
      </div>

      <div className="faq-grid">
        {faqs.map((faq) => (
          <details className="faq-item" key={faq.question}>
            <summary>
              {faq.question}
              <span>+</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default FaqSection
