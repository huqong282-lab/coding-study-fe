import { Link } from 'react-router-dom'

const productLinks = ['Katalog Kelas', 'Roadmap Belajar', 'Komunitas', 'Blog']
const companyLinks = ['Tentang Kami', 'Karir', 'Press Kit', 'Kontak']
const legalLinks = ['Syarat & Ketentuan', 'Kebijakan Privasi', 'Refund Policy']
const socialLinks = ['Instagram', 'Twitter', 'YouTube', 'Discord']

function Footer() {
  return (
    <footer className="site-footer" id="footer">
      <div className="site-footer__grid">
        <section className="site-footer__brand" aria-label="Coding Study information">
          <Link className="site-footer__logo" to="/home" aria-label="Coding Study home">
            <span className="brand-mark" aria-hidden="true">
              CS
            </span>
            <strong>Coding Study HQ</strong>
          </Link>
          <p>
            Platform belajar coding terlengkap untuk pemula hingga profesional di Indonesia.
          </p>
        </section>

        <nav className="site-footer__column" aria-label="Produk">
          <h2>Produk</h2>
          {productLinks.map((item) => (
            <a href="/home" key={item}>
              {item}
            </a>
          ))}
        </nav>

        <nav className="site-footer__column" aria-label="Perusahaan">
          <h2>Perusahaan</h2>
          {companyLinks.map((item) => (
            <a href="/home" key={item}>
              {item}
            </a>
          ))}
        </nav>

        <nav className="site-footer__column" aria-label="Legal">
          <h2>Legal</h2>
          {legalLinks.map((item) => (
            <a href="/home" key={item}>
              {item}
            </a>
          ))}
        </nav>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 Coding Study HQ. All rights reserved.</p>

        <div className="site-footer__social" aria-label="Ikuti kami">
          {socialLinks.map((item) => (
            <a href="/home" key={item} aria-label={item}>
              {item.slice(0, 2)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
