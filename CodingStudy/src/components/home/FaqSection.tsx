const faqs = [
  {
    question: 'Apakah saya harus punya pengalaman coding sebelumnya?',
    answer: 'Tidak perlu. Jalur belajar dimulai dari fundamental dan naik bertahap sampai project nyata.',
  },
  {
    question: 'Apakah Coding Study menyediakan sertifikasi?',
    answer: 'Ya, beberapa kelas punya sertifikat penyelesaian yang bisa dipakai untuk portfolio.',
  },
  {
    question: 'Bagaimana cara memilih jalur yang tepat untuk switch career?',
    answer: 'Mulai dari posisi yang paling dekat dengan targetmu, lalu ikuti roadmap bertahap yang disarankan.',
  },
  {
    question: 'Bisakah saya akses materi setelah kelas selesai?',
    answer: 'Bisa. Akses materi tetap tersedia selama akun aktif sesuai paket yang kamu pilih.',
  },
  {
    question: 'Apa itu program komunitas Coding Study?',
    answer: 'Komunitas adalah ruang diskusi, peer review, live coding, dan networking antar member.',
  },
]

function FaqSection() {
  return (
    <section className="home-section home-section--faq" aria-labelledby="faq-title">
      <div className="home-section__header home-section__header--stacked">
        <p className="home-section-kicker">FAQ</p>
        <h2 className="home-section-title" id="faq-title">
          Pertanyaan yang <span>Sering Ditanya</span>
        </h2>
      </div>

      <div className="faq-stack">
        {faqs.map((faq) => (
          <details className="faq-item" key={faq.question}>
            <summary>
              <span>{faq.question}</span>
              <span aria-hidden="true">+</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default FaqSection
