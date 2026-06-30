import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import { courseCatalog } from '../../data/courses'
import type { Course } from '../../types/product'
import type { AppUser } from '../../types/user'

type DashboardStudentProps = {
  user?: AppUser | null
  selectedProgrammingLanguages?: string[]
  onLogout?: () => void
}

type DashboardView = 'overview' | 'courses'
type CourseFilter = 'all' | 'premium' | 'free' | 'started' | 'finished'

type EnrolledCourse = Course & {
  progress: number
  lessonsFinished: number
  learningMinutes: number
}

const courseFilters: { id: CourseFilter; label: string }[] = [
  { id: 'all', label: 'Semua Kelas' },
  { id: 'premium', label: 'Premium' },
  { id: 'free', label: 'Free' },
  { id: 'started', label: 'Berjalan' },
  { id: 'finished', label: 'Selesai' },
]

const sidebarSections = [
  {
    title: 'Menu Utama',
    items: [
      { label: 'Beranda', active: true },
      { label: 'Kelas Saya', badge: '3' },
      { label: 'Jelajahi Kelas' },
      { label: 'Roadmap' },
      { label: 'Latihan Soal' },
    ],
  },
  {
    title: 'Komunitas',
    items: [
      { label: 'Forum Diskusi', badge: '12' },
      { label: 'Leaderboard' },
      { label: 'Study Group' },
    ],
  },
  {
    title: 'Akun',
    items: [
      { label: 'Profil Saya' },
      { label: 'Sertifikat' },
      { label: 'Pengaturan' },
    ],
  },
]

const activityItems = [
  { icon: 'Play', title: 'Menonton useState Hook di kelas React', meta: '2j lalu' },
  { icon: 'Done', title: 'Menyelesaikan Quiz JavaScript ES6 dengan skor 95%', meta: '5j lalu' },
  { icon: 'Award', title: 'Mendapatkan badge "Streak 14 Hari"', meta: 'Kemarin' },
  { icon: 'Talk', title: 'Komentar dijawab di Forum React Hooks', meta: '2 hari lalu' },
  { icon: 'Cert', title: 'Sertifikat JavaScript Dasar diterbitkan', meta: '3 hari lalu' },
]

const achievements = [
  { icon: 'Rocket', title: 'Pertama!', muted: false },
  { icon: 'Fire', title: 'Streak 7 Hari', muted: false },
  { icon: 'Star', title: 'Level 10', muted: false },
  { icon: 'Cert', title: '5 Sertifikat', muted: false },
  { icon: 'Gem', title: 'Streak 30', muted: true },
  { icon: 'Cup', title: 'Top 3', muted: true },
  { icon: 'Bolt', title: '10 Kelas', muted: true },
  { icon: 'Medal', title: '100 Jam', muted: true },
]

const certificateItems = [
  { title: 'JavaScript Dasar ke Mahir', date: 'Diterbitkan 15 Jan 2026', icon: 'Cert' },
  { title: 'UI/UX untuk Developer', date: 'Diterbitkan 3 Feb 2026', icon: 'Design' },
  { title: 'Node.js & Express API', date: 'Diterbitkan 20 Feb 2026', icon: 'Node' },
  { title: 'Python Fundamental', date: 'Diterbitkan 10 Mar 2026', icon: 'Py' },
]

function buildEnrolledCourses(selectedLanguages: string[]): EnrolledCourse[] {
  if (selectedLanguages.length === 0) {
    return []
  }

  return courseCatalog
    .filter((course) => selectedLanguages.includes(course.languageId))
    .slice(0, 4)
    .map((course, index) => {
      const progress = [68, 91, 32, 15][index] ?? 22
      const lessonsFinished = Math.max(1, Math.round((course.modules * progress) / 100))

      return {
        ...course,
        progress,
        lessonsFinished,
        learningMinutes: 85 + index * 45,
      }
    })
}

function DashboardStudent({
  user,
  selectedProgrammingLanguages = [],
  onLogout,
}: DashboardStudentProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeView: DashboardView = tabParam === 'courses' ? 'courses' : 'overview'
  const [activeFilter, setActiveFilter] = useState<CourseFilter>('all')
  const enrolledCourses = useMemo(
    () => buildEnrolledCourses(selectedProgrammingLanguages),
    [selectedProgrammingLanguages],
  )

  const visibleCourses = enrolledCourses.filter((course) => {
    if (activeFilter === 'premium') {
      return course.access === 'paid'
    }

    if (activeFilter === 'free') {
      return course.access === 'free'
    }

    if (activeFilter === 'started') {
      return course.progress > 0 && course.progress < 100
    }

    if (activeFilter === 'finished') {
      return course.progress === 100
    }

    return true
  })

  const stats = {
    myCourses: enrolledCourses.length,
    lessonsFinished: enrolledCourses.reduce((total, course) => total + course.lessonsFinished, 0),
    learningTime: enrolledCourses.reduce((total, course) => total + course.learningMinutes, 0),
  }

  const firstName = user?.name.trim().split(' ')[0] || 'Learner'
  const userInitials = user
    ? user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'RH'

  return (
    <main className="student-dashboard-page">
      <div className="student-dashboard-layout">
        <aside className="student-dashboard-sidebar">
          <div className="student-dashboard-brand">
            <span className="student-dashboard-brand-mark">CS</span>
            <div>
              <strong>Coding Study</strong>
              <p>Dashboard</p>
            </div>
          </div>

          {sidebarSections.map((section) => (
            <div className="student-dashboard-nav-group" key={section.title}>
              <p className="student-dashboard-nav-title">{section.title}</p>
              <nav className="student-dashboard-nav" aria-label={section.title}>
                {section.items.map((item) => (
                  <button
                    className={`student-dashboard-nav-item ${item.active ? 'is-active' : ''}`}
                    type="button"
                    key={item.label}
                  >
                    <span>{item.label}</span>
                    {item.badge ? <strong>{item.badge}</strong> : null}
                  </button>
                ))}
              </nav>
            </div>
          ))}

          <div className="student-dashboard-sidebar-footer">
            <div className="student-dashboard-user">
              <span className="student-dashboard-user-avatar">{userInitials}</span>
              <div>
                <strong>{firstName}</strong>
                <p>{user?.role || 'Frontend Dev'}</p>
              </div>
            </div>

            <button className="student-dashboard-logout" type="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </aside>

        <div className="student-dashboard-main">
          <Navbar user={user} onLogout={onLogout} variant="dashboard" title="Profil & Dashboard" />

          <section className="student-dashboard-hero">
            <div className="student-dashboard-hero-cover">
              <button className="student-dashboard-cover-action" type="button">
                Ubah cover
              </button>
            </div>

            <div className="student-dashboard-hero-body">
              <div className="student-dashboard-hero-row">
                <div className="student-dashboard-profile">
                  <div className="student-dashboard-profile-avatar-wrap">
                    <div className="student-dashboard-profile-avatar">{userInitials}</div>
                    <span className="student-dashboard-online" />
                  </div>

                  <div className="student-dashboard-profile-copy">
                    <h2>{user?.name || 'Prototype'}</h2>
                    <p>@{user?.email?.split('@')[0] || 'prototype'} - Frontend Developer</p>
                    <span>
                      Belajar coding dari nol, sekarang fokus di React & Next.js. Open to work & kolaborasi project!
                    </span>
                  </div>
                </div>
              </div>

              <div className="student-dashboard-tags" aria-label="Programming interests">
                {selectedProgrammingLanguages.slice(0, 5).map((language) => (
                  <span key={language}>{language}</span>
                ))}
              </div>

              <div className="student-dashboard-hero-meta">
                <span>Lokasi: Sidoarjo, Indonesia</span>
                <span>Bergabung: Jan 2025</span>
                <span>Streak: 14 hari</span>
                <span>Level 12 - 4.820 XP</span>
              </div>
            </div>
          </section>

          <section className="student-dashboard-stats-grid" aria-label="Ringkasan statistik">
            <article className="student-dashboard-stat-card">
              <p>KELAS SELESAI</p>
              <strong>7</strong>
              <span>+2 bulan ini</span>
            </article>
            <article className="student-dashboard-stat-card">
              <p>JAM BELAJAR</p>
              <strong>{stats.learningTime}</strong>
              <span>+18 jam minggu ini</span>
            </article>
            <article className="student-dashboard-stat-card">
              <p>SERTIFIKAT</p>
              <strong>5</strong>
              <span>2 dalam progress</span>
            </article>
            <article className="student-dashboard-stat-card">
              <p>STREAK HARIAN</p>
              <strong>14</strong>
              <span>Terbaik: 21 hari</span>
            </article>
          </section>

          {activeView === 'overview' ? (
            <div className="student-dashboard-grid">
              <section className="student-dashboard-panel student-dashboard-activity-panel" aria-labelledby="activity-title">
                <div className="student-dashboard-panel-head">
                  <h2 id="activity-title">Aktivitas Belajar</h2>
                  <button type="button">Lihat Detail</button>
                </div>

                <div className="student-dashboard-activity-chart" aria-hidden="true">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'].map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                  <div className="student-dashboard-heatmap">
                    {Array.from({ length: 30 }).map((_, index) => (
                      <i key={index} className={`intensity-${(index % 4) + 1}`} />
                    ))}
                  </div>
                  <div className="student-dashboard-heatmap-legend">
                    <span>Kurang</span>
                    <i className="intensity-1" />
                    <i className="intensity-2" />
                    <i className="intensity-3" />
                    <i className="intensity-4" />
                    <span>Banyak</span>
                  </div>
                </div>
              </section>

              <section className="student-dashboard-panel student-dashboard-progress-panel" aria-labelledby="progress-title">
                <h2 id="progress-title">Progress Keseluruhan</h2>
                <div className="student-dashboard-ring">
                  <span>75%</span>
                  <small>Target</small>
                </div>
                <div className="student-dashboard-progress-summary">
                  <div>
                    <span>Target bulan ini</span>
                    <strong>3/4 kelas</strong>
                  </div>
                  <div>
                    <span>Latihan soal</span>
                    <strong>68%</strong>
                  </div>
                  <div>
                    <span>Waktu hari ini</span>
                    <strong>2j 14m</strong>
                  </div>
                </div>
              </section>

              <section className="student-dashboard-panel student-dashboard-achievement-panel" aria-labelledby="achievement-title">
                <div className="student-dashboard-panel-head">
                  <h2 id="achievement-title">Pencapaian</h2>
                  <button type="button">Lihat Semua</button>
                </div>

                <div className="student-dashboard-achievement-grid">
                  {achievements.map((item) => (
                    <article
                      className={`student-dashboard-achievement-card ${item.muted ? 'is-muted' : ''}`}
                      key={item.title}
                    >
                      <span>{item.icon}</span>
                      <strong>{item.title}</strong>
                    </article>
                  ))}
                </div>
              </section>

              <section className="student-dashboard-panel student-dashboard-activity-list-panel" aria-labelledby="recent-title">
                <h2 id="recent-title">Aktivitas Terbaru</h2>
                <div className="student-dashboard-activity-list">
                  {activityItems.map((item) => (
                    <div className="student-dashboard-activity-row" key={item.title}>
                      <span className="student-dashboard-activity-icon">{item.icon}</span>
                      <p>{item.title}</p>
                      <small>{item.meta}</small>
                    </div>
                  ))}
                </div>
              </section>

              <section className="student-dashboard-panel student-dashboard-certificates-panel" aria-labelledby="certificate-title">
                <div className="student-dashboard-panel-head">
                  <h2 id="certificate-title">Sertifikat Saya</h2>
                  <button type="button">Lihat Semua</button>
                </div>

                <div className="student-dashboard-certificate-grid">
                  {certificateItems.map((item) => (
                    <article className="student-dashboard-certificate-card" key={item.title}>
                      <span className="student-dashboard-certificate-icon">{item.icon}</span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.date}</p>
                      </div>
                      <span className="student-dashboard-certificate-action">Go</span>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <section className="student-dashboard-panel student-dashboard-courses-panel" aria-labelledby="student-courses-title">
              <div className="student-dashboard-panel-head">
                <h2 id="student-courses-title">Kelas Sedang Berjalan</h2>
                <button type="button">Semua Kelas</button>
              </div>

              <div className="student-course-filters" aria-label="Filter my courses">
                {courseFilters.map((filter) => (
                  <button
                    className={activeFilter === filter.id ? 'is-active' : ''}
                    key={filter.id}
                    type="button"
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {visibleCourses.length > 0 ? (
                <div className="student-course-list">
                  {visibleCourses.map((course) => (
                    <article className="student-course-card" key={course.id}>
                      <div className="student-course-card__header">
                        <span className="course-tag">{course.access === 'paid' ? 'Premium' : 'Free'}</span>
                        <strong>{course.progress}%</strong>
                      </div>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="student-course-meta">
                        <span>
                          {course.lessonsFinished}/{course.modules} lessons
                        </span>
                        <span>{course.learningMinutes} menit</span>
                        <span>{course.progress === 100 ? 'Finished' : 'Started'}</span>
                      </div>
                      <div className="student-progress-track" aria-label={`${course.progress}% progress`}>
                        <span style={{ width: `${course.progress}%` }} />
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="student-empty-state">
                  <strong>Kamu belum mengikuti kelas</strong>
                  <p>Pilih kelas dari halaman Library dulu, nanti kelas yang kamu ikuti akan muncul di sini.</p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default DashboardStudent
