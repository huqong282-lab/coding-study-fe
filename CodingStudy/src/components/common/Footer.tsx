import { Link } from 'react-router-dom'

const socialLinks = [
  { label: 'Instagram', initial: 'IG' },
  { label: 'Facebook', initial: 'f' },
  { label: 'X', initial: 'X' },
  { label: 'YouTube', initial: '▶' },
  { label: 'LinkedIn', initial: 'in' },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <section className="footer-brand" aria-label="Coding Study information">
          <Link className="footer-logo" to="/home" aria-label="Coding Study home">
            <span>CS</span>
            Coding Study
          </Link>
          <strong>Coding Study HQ</strong>
          <p>
            Jl. Belajar Digital No. 18, Jakarta Selatan 12860. Kelas coding
            terarah untuk pelajar, career switcher, dan developer pemula.
          </p>

          <div className="footer-apps" aria-label="Download app">
            <span>Coba GRATIS aplikasi Coding Study</span>
            <a href="/home">Google Play</a>
            <a href="/home">App Store</a>
          </div>
        </section>

        <section className="footer-contact" aria-label="Hubungi kami">
          <h2>Hubungi Kami</h2>
          <a href="https://wa.me/6281574410000">
            <span>WA</span>
            +62 815-7441-0000
          </a>
          <a href="mailto:support@codingstudy.dev">
            <span>@</span>
            support@codingstudy.dev
          </a>
          <a href="tel:+622140008000">
            <span>☎</span>
            021-4000-8000
          </a>

          <div className="footer-social">
            <h2>Ikuti Kami</h2>
            <div>
              {socialLinks.map((item) => (
                <a key={item.label} href="/home" aria-label={item.label}>
                  {item.initial}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      <p className="footer-copyright">©2026 Coding Study. All Rights Reserved</p>
    </footer>
  )
}

export default Footer
