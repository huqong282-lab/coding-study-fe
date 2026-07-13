import { useState } from 'react'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import type { AppUser } from '../../types/user'

type DashboardAdminProps = {
  user?: AppUser | null
  onLogout?: () => void
}

type NavItem = {
  label: string
  icon: string
  active?: boolean
}

type NavSection = {
  title: string
  items: NavItem[]
}

const adminNavSections: NavSection[] = [
  {
    title: 'Workspace',
    items: [{ label: 'Dashboard', icon: 'DB', active: true }],
  },
  {
    title: 'Manajemen',
    items: [
      { label: 'User', icon: 'US' },
      { label: 'Kelas', icon: 'KL' },
    ],
  },
  {
    title: 'Akun',
    items: [{ label: 'Pengaturan', icon: 'PG' }],
  },
]

function DashboardAdmin({ user, onLogout }: DashboardAdminProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  return (
    <main className="mentor-dashboard-page">
      <div className={`mentor-dashboard-layout ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
        <aside className="mentor-dashboard-sidebar">
          <div className="student-dashboard-brand">
            <span className="student-dashboard-brand-mark">CS</span>
            <div>
              <strong>Coding Study</strong>
              <p>Platform Admin</p>
            </div>
          </div>

          {adminNavSections.map((section) => (
            <div className="student-dashboard-nav-group" key={section.title}>
              <nav className="student-dashboard-nav" aria-label={section.title}>
                {section.items.map((item) => (
                  <button
                    className={`mentor-dashboard-nav-item ${item.active ? 'is-active' : ''}`}
                    type="button"
                    key={item.label}
                  >
                    <span className="mentor-dashboard-nav-icon">{item.icon}</span>
                    <span className="mentor-dashboard-nav-label">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          ))}

          <button
            className="mentor-dashboard-sidebar-toggle"
            type="button"
            aria-label={isSidebarCollapsed ? 'Buka sidebar' : 'Tutup sidebar'}
            onClick={() => setIsSidebarCollapsed((current) => !current)}
          >
            {isSidebarCollapsed ? '›' : '‹'}
          </button>
        </aside>

        <div className="mentor-dashboard-main">
          <Navbar user={user} onLogout={onLogout} variant="dashboard" title="Dashboard Admin" />

          <section className="mentor-dashboard-empty-grid" aria-label="Area dashboard admin kosong">
            <div className="mentor-dashboard-empty-bubble" aria-hidden="true" />
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default DashboardAdmin
