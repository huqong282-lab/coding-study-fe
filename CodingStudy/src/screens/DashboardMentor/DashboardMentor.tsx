import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { listCourses, type BackendCourse } from '../../services/courseServices'
import type { AppUser } from '../../types/user'

type DashboardMentorProps = {
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

const mentorNavSections: NavSection[] = [
  {
    title: 'Workspace',
    items: [{ label: 'Dashboard', icon: 'DB', active: true }],
  },
  {
    title: 'Konten',
    items: [{ label: 'Kelas', icon: 'KL' }],
  },
  {
    title: 'Akun',
    items: [{ label: 'Pengaturan', icon: 'PG' }],
  },
]

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

function formatPrice(price: string) {
  const numericPrice = Number(price)

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return 'Gratis'
  }

  return currencyFormatter.format(numericPrice)
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
  }).format(new Date(dateValue))
}

function getCourseStatusLabel(status: BackendCourse['status']) {
  return status === 'PUBLISHED' ? 'Published' : 'Draft'
}

function DashboardMentor({ user, onLogout }: DashboardMentorProps) {
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [courses, setCourses] = useState<BackendCourse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadMentorCourses() {
      if (!user?.id) {
        if (isActive) {
          setCourses([])
          setIsLoading(false)
        }
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const result = await listCourses({
          mentorId: user.id,
          limit: 100,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        })

        if (!isActive) {
          return
        }

        setCourses(result.courses)
      } catch (requestError) {
        if (!isActive) {
          return
        }

        setError(requestError instanceof Error ? requestError.message : 'Gagal memuat kelas mentor')
        setCourses([])
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadMentorCourses()

    return () => {
      isActive = false
    }
  }, [user?.id])

  const summary = useMemo(() => {
    const publishedCount = courses.filter((course) => course.status === 'PUBLISHED').length
    const draftCount = courses.filter((course) => course.status === 'DRAFT').length

    return {
      total: courses.length,
      publishedCount,
      draftCount,
    }
  }, [courses])

  const hasCourses = courses.length > 0

  return (
    <main className="mentor-dashboard-page">
      <div className={`mentor-dashboard-layout ${isSidebarCollapsed ? 'is-sidebar-collapsed' : ''}`}>
        <aside className="mentor-dashboard-sidebar">
          <div className="student-dashboard-brand">
            <span className="student-dashboard-brand-mark">CS</span>
            <div>
              <strong>Coding Study</strong>
              <p>Platform Mentor</p>
            </div>
          </div>

          {mentorNavSections.map((section) => (
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
          <Navbar user={user} onLogout={onLogout} variant="dashboard" title="Dashboard Mentor" />

          <section className="mentor-dashboard-hero" aria-label="Ringkasan kelas mentor">
            <div>
              <p>Kelola kelas</p>
              <h2>Kelas yang kamu buat</h2>
              <span>
                Lihat semua kelas yang sudah pernah kamu buat, cek status publikasinya, dan buat
                kelas baru langsung dari dashboard ini.
              </span>
            </div>

            <div className="mentor-dashboard-hero-action">
              <button type="button" onClick={() => navigate('/dashboard/classes/new')}>
                Buat Kelas
              </button>
            </div>
          </section>

          <section className="mentor-dashboard-summary-grid" aria-label="Ringkasan kelas mentor">
            <article className="mentor-dashboard-summary-card is-violet">
              <p>Total Kelas</p>
              <div>
                <strong>{summary.total}</strong>
                <span>kelas</span>
              </div>
              <small>Kelas yang tersimpan untuk akun mentor ini.</small>
            </article>
            <article className="mentor-dashboard-summary-card is-sky">
              <p>Published</p>
              <div>
                <strong>{summary.publishedCount}</strong>
                <span>kelas</span>
              </div>
              <small>Kelas yang sudah siap dilihat siswa.</small>
            </article>
            <article className="mentor-dashboard-summary-card is-rose">
              <p>Draft</p>
              <div>
                <strong>{summary.draftCount}</strong>
                <span>kelas</span>
              </div>
              <small>Kelas yang masih bisa kamu edit sebelum rilis.</small>
            </article>
            <article className="mentor-dashboard-summary-card is-emerald">
              <p>Status akun</p>
              <div>
                <strong>{user?.role ?? 'MENTOR'}</strong>
              </div>
              <small>Role login aktif saat ini.</small>
            </article>
          </section>

          <section className="mentor-dashboard-content-grid" aria-label="Daftar kelas mentor">
            <div className="mentor-dashboard-panel">
              <div className="mentor-dashboard-panel-head">
                <div>
                  <p>Daftar Kelas</p>
                  <h2>Kelas yang pernah kamu buat</h2>
                </div>
                <button type="button" onClick={() => navigate('/dashboard/classes/new')}>
                  Buat Kelas
                </button>
              </div>

              {isLoading ? (
                <div className="mentor-dashboard-empty-grid">
                  <div className="mentor-dashboard-empty-bubble" />
                  <div className="mentor-dashboard-empty-content">
                    <strong>Memuat kelas mentor...</strong>
                    <span>Mohon tunggu sebentar saat kami mengambil data kelas yang sudah dibuat.</span>
                  </div>
                </div>
              ) : error ? (
                <div className="mentor-dashboard-empty-grid">
                  <div className="mentor-dashboard-empty-bubble" />
                  <div className="mentor-dashboard-empty-content">
                    <strong>Gagal memuat kelas</strong>
                    <span>{error}</span>
                    <button type="button" onClick={() => window.location.reload()}>
                      Muat Ulang
                    </button>
                  </div>
                </div>
              ) : !hasCourses ? (
                <div className="mentor-dashboard-empty-grid">
                  <div className="mentor-dashboard-empty-bubble" />
                  <div className="mentor-dashboard-empty-content">
                    <strong>Belum ada kelas yang dibuat</strong>
                    <span>
                      Mulai dari satu kelas dulu. Setelah kelas dibuat, data kelas akan tampil di
                      sini dan bisa kamu pantau dari dashboard ini.
                    </span>
                    <button type="button" onClick={() => navigate('/dashboard/classes/new')}>
                      Buat Kelas
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mentor-dashboard-course-grid">
                  {courses.map((course) => (
                    <article className="mentor-dashboard-course-card" key={course.id}>
                      <div className="mentor-dashboard-course-card__head">
                        <div>
                          <p>{getCourseStatusLabel(course.status)}</p>
                          <h3>{course.title}</h3>
                        </div>
                        <span className={`mentor-dashboard-course-badge is-${course.status.toLowerCase()}`}>
                          {course.status}
                        </span>
                      </div>

                      <p className="mentor-dashboard-course-description">{course.description}</p>

                      <div className="mentor-dashboard-course-meta">
                        <span>{formatPrice(course.price)}</span>
                        <span>{formatDate(course.createdAt)}</span>
                      </div>

                      <div className="mentor-dashboard-course-footer">
                        <small>Mentor: {course.mentor?.name ?? user?.name ?? 'Mentor'}</small>
                        <button type="button" onClick={() => navigate(`/courses/${course.id}`)}>
                          Lihat Detail
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default DashboardMentor
