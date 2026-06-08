import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

type NavbarProps = {
  user?: {
    name: string
    email: string
  }
  onLogout?: () => void
}

function Navbar({ user = { name: 'Raka Pratama', email: 'raka@codingstudy.dev' }, onLogout }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const firstName = user.name.trim().split(' ')[0] || 'Learner'
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

  return (
    <header className="home-navbar" aria-label="Main navigation">
      <Link className="home-logo" to="/home" aria-label="Coding Study home">
        <span>CS</span>
        Coding Study
      </Link>

      <nav className="home-nav-links" aria-label="Learning navigation">
        <NavLink to="/home">Kelas Saya</NavLink>
        <Link to="/home#library">Library</Link>
      </nav>

      <div className="home-nav-actions">
        <label className="home-search">
          <span>Cari kursus</span>
          <input type="search" placeholder="React, Python, SQL..." />
        </label>

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
              <button type="button" onClick={handleLogoutClick} role="menuitem">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
