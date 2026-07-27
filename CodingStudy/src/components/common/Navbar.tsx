import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import type { AppUser } from '../../types/user'

type NavbarProps = {
  user?: AppUser | null
  onLogout?: () => void
  variant?: 'default' | 'dashboard' | 'checkout'
  title?: string
}

const navItems = [
  { label: 'Kelas', to: '/classes' },
  { label: 'Komunitas', href: '#community' },
  { label: 'Roadmap', href: '#tech' },
  { label: 'Tentang Kami', href: '#footer' },
]

function Navbar({ user, onLogout, variant = 'default', title = 'Profil & Dashboard' }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const firstName = user?.name.trim().split(' ')[0] || 'Learner'
  const avatarInitial = firstName.charAt(0).toUpperCase()

  useEffect(() => {
    if (!isProfileOpen) {
      return
    }

    function handleDocumentClick(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isProfileOpen])

  function handleLogoutClick() {
    setIsProfileOpen(false)
    onLogout?.()
  }

  if (variant === 'dashboard') {
    return (
      <header className="dashboard-navbar" aria-label="Dashboard navigation">
        <Link className="home-logo" to="/home" aria-label="Kembali ke beranda utama">
          <span className="brand-mark" aria-hidden="true">
            CS
          </span>
          <strong className="home-logo-text">Coding Study</strong>
        </Link>

        <div className="dashboard-navbar__title">
          <h1>{title}</h1>
        </div>

        <div className="dashboard-navbar__actions">
          {user ? (
            <>
              <button className="dashboard-navbar__icon-button" type="button" aria-label="Notifikasi">
                <span className="dashboard-navbar__dot" />
                ◦
              </button>
              <button className="dashboard-navbar__icon-button" type="button" aria-label="Shortcut">
                ◻
              </button>
              <div className="profile-menu" ref={profileMenuRef}>
                <button
                  className="dashboard-navbar__avatar"
                  type="button"
                  aria-label={`Profil ${user.name}`}
                  aria-haspopup="menu"
                  aria-expanded={isProfileOpen}
                  onClick={() => setIsProfileOpen((current) => !current)}
                >
                  {avatarInitial}
                </button>

                {isProfileOpen && (
                  <div className="profile-popover" role="menu">
                    <div className="profile-popover-header">
                      <span className="profile-popover-avatar">{avatarInitial}</span>
                      <div>
                        <strong>{user.name}</strong>
                        <p>{user.email}</p>
                      </div>
                    </div>
                    <nav className="profile-popover-nav" aria-label="Profile dashboard navigation">
                      <Link to="/dashboard" role="menuitem" onClick={() => setIsProfileOpen(false)}>
                        Dashboard
                      </Link>
                      <NavLink
                        to="/dashboard?tab=courses"
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Kelas Saya
                      </NavLink>
                    </nav>
                    <button className="profile-logout-button" type="button" onClick={handleLogoutClick} role="menuitem">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="profile-guest-actions">
              <Link className="home-nav-link" to="/login">
                Masuk
              </Link>
              <Link className="btn btn-primary profile-guest-button" to="/register">
                Daftar Gratis
              </Link>
            </div>
          )}
        </div>
      </header>
    )
  }

  if (variant === 'checkout') {
    return (
      <header className="checkout-navbar" aria-label="Checkout navigation">
        <Link className="home-logo" to="/home" aria-label="Coding Study home">
          <span className="brand-mark" aria-hidden="true">
            CS
          </span>
          <strong className="home-logo-text">Coding Study</strong>
        </Link>

        <div className="checkout-navbar__steps" aria-label="Checkout progress">
          <span className="checkout-navbar__step">
            <i>□</i>
            <strong>Pilih Kelas</strong>
          </span>
          <span className="checkout-navbar__step is-active">
            <i>2</i>
            <strong>Checkout</strong>
          </span>
          <span className="checkout-navbar__step">
            <i>3</i>
            <strong>Konfirmasi</strong>
          </span>
        </div>

        <div className="checkout-navbar__security">
          <span aria-hidden="true">□</span>
          <strong>Pembayaran Aman & Terenkripsi</strong>
        </div>
      </header>
    )
  }

  return (
    <header className="home-navbar" aria-label="Main navigation">
      <Link className="home-logo" to="/home" aria-label="Coding Study home">
        <span className="brand-mark" aria-hidden="true">
          CS
        </span>
        <strong className="home-logo-text">Coding Study</strong>
      </Link>

      <nav className="home-nav-links" aria-label="Learning navigation">
        {navItems.map((item) =>
          'to' in item ? (
            <Link key={item.label} to={item.to}>
              {item.label}
            </Link>
          ) : (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ),
        )}
      </nav>

      <div className="home-nav-actions">
        {user ? (
          <div className="profile-menu" ref={profileMenuRef}>
            <button
              className="home-avatar-button"
              type="button"
              aria-label={`Profil ${user.name}`}
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((current) => !current)}
            >
              {avatarInitial}
            </button>

            {isProfileOpen && (
              <div className="profile-popover" role="menu">
                <div className="profile-popover-header">
                  <span className="profile-popover-avatar">{avatarInitial}</span>
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                </div>
                <nav className="profile-popover-nav" aria-label="Profile dashboard navigation">
                  <Link to="/dashboard" role="menuitem" onClick={() => setIsProfileOpen(false)}>
                    Dashboard
                  </Link>
                  <NavLink
                    to="/dashboard?tab=courses"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Kelas Saya
                  </NavLink>
                </nav>
                <button className="profile-logout-button" type="button" onClick={handleLogoutClick} role="menuitem">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="profile-guest-actions">
            <Link className="home-nav-link" to="/login">
              Masuk
            </Link>
            <Link className="btn btn-primary profile-guest-button" to="/register">
              Daftar Gratis
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
