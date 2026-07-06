import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import type { AppUser } from '../../types/user'

type DashboardMentorProps = {
  user?: AppUser | null
  onLogout?: () => void
}

type MenteeProgress = {
  name: string
  track: string
  progress: number
  status: string
  tone: 'smooth' | 'complete' | 'stuck'
}

type ScheduleItem = {
  time: string
  title: string
  mentee: string
  action: string
}

type AssignmentItem = {
  mentee: string
  title: string
  meta: string
}

const mentorNavSections = [
  {
    title: 'Workspace',
    items: [
      { label: 'Dashboard', icon: 'DB', active: true },
      { label: 'Daftar Mentee', icon: 'MT', badge: '4' },
      { label: 'Kalender', icon: 'KL' },
      { label: 'Tugas & Nilai', icon: 'TN', badge: '3' },
    ],
  },
  {
    title: 'Konten',
    items: [
      { label: 'Materi', icon: 'MR' },
      { label: 'Pesan', icon: 'PS', badge: '5' },
    ],
  },
  {
    title: 'Akun',
    items: [{ label: 'Pengaturan', icon: 'PG' }],
  },
]

const summaryCards = [
  { label: 'Mentee Aktif', value: '4', unit: 'Mentee', accent: 'violet', detail: '+1 dari bulan lalu' },
  { label: 'Jam Mentoring', value: '12', unit: 'Jam', accent: 'sky', detail: '8 sesi selesai' },
  { label: 'Tugas Pending', value: '3', unit: 'Tugas', accent: 'rose', detail: 'Butuh review hari ini' },
  { label: 'Rating Mentor', value: '4.9', unit: '/5', accent: 'emerald', detail: 'Dari 26 ulasan' },
]

const scheduleItems: ScheduleItem[] = [
  { time: '14:00', title: 'Sesi 1-on-1', mentee: 'Andi', action: 'Masuk Zoom' },
  { time: '16:30', title: 'Evaluasi Kelompok 2', mentee: 'Susi, Budi', action: 'Lihat Agenda' },
  { time: '19:00', title: 'Office Hour React', mentee: 'Batch Frontend', action: 'Buka Room' },
]

const menteeProgress: MenteeProgress[] = [
  { name: 'Andi', track: 'React Fundamental', progress: 60, status: 'Lancar', tone: 'smooth' },
  { name: 'Susi', track: 'TypeScript Web Apps', progress: 100, status: 'Lulus', tone: 'complete' },
  { name: 'Budi', track: 'Backend API Node.js', progress: 30, status: 'Stuck', tone: 'stuck' },
  { name: 'Nadia', track: 'UI Engineering', progress: 78, status: 'Siap Review', tone: 'smooth' },
]

const assignmentInbox: AssignmentItem[] = [
  { mentee: 'Budi', title: 'Tugas Modul 2', meta: 'Masuk 24 menit lalu' },
  { mentee: 'Andi', title: 'Revisi Proposal Project', meta: 'Deadline malam ini' },
  { mentee: 'Nadia', title: 'Quiz Komponen React', meta: 'Menunggu nilai' },
]

const latestMessages = [
  {
    sender: 'Susi',
    excerpt: 'Kak, link tugasnya sudah saya update. Mohon dicek kalau sempat ya.',
    time: '10 menit lalu',
  },
  {
    sender: 'Budi',
    excerpt: 'Saya stuck waktu setup database lokal untuk modul API.',
    time: '38 menit lalu',
  },
]

const materialQueue = [
  { title: 'React State Management', status: 'Siap publish', count: '6 lesson' },
  { title: 'API Authentication', status: 'Draft review', count: '4 lesson' },
]

function DashboardMentor({ user, onLogout }: DashboardMentorProps) {
  const firstName = user?.name.trim().split(' ')[0] || 'Mentor'
  const mentorInitials = user
    ? user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'MT'

  return (
    <main className="mentor-dashboard-page">
      <div className="mentor-dashboard-layout">
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
              <p className="student-dashboard-nav-title">{section.title}</p>
              <nav className="student-dashboard-nav" aria-label={section.title}>
                {section.items.map((item) => (
                  <button
                    className={`mentor-dashboard-nav-item ${item.active ? 'is-active' : ''}`}
                    type="button"
                    key={item.label}
                  >
                    <span className="mentor-dashboard-nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge ? <strong>{item.badge}</strong> : null}
                  </button>
                ))}
              </nav>
            </div>
          ))}

          <div className="mentor-dashboard-sidebar-card">
            <span>Live mentoring</span>
            <strong>2 sesi tersisa hari ini</strong>
            <button type="button">Buka Jadwal</button>
          </div>

          <div className="student-dashboard-sidebar-footer">
            <div className="student-dashboard-user">
              <span className="student-dashboard-user-avatar">{mentorInitials}</span>
              <div>
                <strong>{firstName}</strong>
                <p>Mentor</p>
              </div>
            </div>

            <button className="student-dashboard-logout" type="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </aside>

        <div className="mentor-dashboard-main">
          <Navbar user={user} onLogout={onLogout} variant="dashboard" title="Dashboard Mentor" />

          <section className="mentor-dashboard-hero">
            <div>
              <p>Ringkasan Bulan Ini</p>
              <h2>Selamat datang kembali, {firstName}!</h2>
              <span>
                Pantau aktivitas mentoring, progres mentee, tugas pending, dan percakapan penting dari satu tempat.
              </span>
            </div>
            <div className="mentor-dashboard-hero-action">
              <button type="button">Buka Slot Waktu</button>
              <button type="button">Buat Materi</button>
            </div>
          </section>

          <section className="mentor-dashboard-summary-grid" aria-label="Ringkasan mentor">
            {summaryCards.map((card) => (
              <article className={`mentor-dashboard-summary-card is-${card.accent}`} key={card.label}>
                <p>{card.label}</p>
                <div>
                  <strong>{card.value}</strong>
                  <span>{card.unit}</span>
                </div>
                <small>{card.detail}</small>
              </article>
            ))}
          </section>

          <div className="mentor-dashboard-content-grid">
            <section className="mentor-dashboard-panel mentor-dashboard-schedule-panel" aria-labelledby="mentor-schedule-title">
              <div className="mentor-dashboard-panel-head">
                <div>
                  <p>Jadwal Hari Ini</p>
                  <h2 id="mentor-schedule-title">Sesi mentoring</h2>
                </div>
                <button type="button">Tambah Slot</button>
              </div>

              <div className="mentor-dashboard-schedule-list">
                {scheduleItems.map((item) => (
                  <article className="mentor-dashboard-schedule-item" key={`${item.time}-${item.title}`}>
                    <time>{item.time}</time>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.mentee}</span>
                    </div>
                    <button type="button">{item.action}</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="mentor-dashboard-panel" aria-labelledby="mentee-progress-title">
              <div className="mentor-dashboard-panel-head">
                <div>
                  <p>Perkembangan Mentee</p>
                  <h2 id="mentee-progress-title">Progress aktif</h2>
                </div>
                <button type="button">Lihat Semua</button>
              </div>

              <div className="mentor-dashboard-progress-list">
                {menteeProgress.map((mentee) => (
                  <article className="mentor-dashboard-progress-item" key={mentee.name}>
                    <div>
                      <strong>{mentee.name}</strong>
                      <span>{mentee.track}</span>
                    </div>
                    <div className="mentor-dashboard-progress-track" aria-label={`${mentee.progress}% progress`}>
                      <span className={`is-${mentee.tone}`} style={{ width: `${mentee.progress}%` }} />
                    </div>
                    <small>
                      {mentee.progress}% · {mentee.status}
                    </small>
                  </article>
                ))}
              </div>
            </section>

            <section className="mentor-dashboard-panel" aria-labelledby="assignment-inbox-title">
              <div className="mentor-dashboard-panel-head">
                <div>
                  <p>Kotak Masuk Tugas</p>
                  <h2 id="assignment-inbox-title">Review pending</h2>
                </div>
                <button type="button">Urutkan</button>
              </div>

              <div className="mentor-dashboard-task-list">
                {assignmentInbox.map((assignment) => (
                  <article className="mentor-dashboard-task-item" key={`${assignment.mentee}-${assignment.title}`}>
                    <div>
                      <strong>{assignment.mentee}</strong>
                      <span>{assignment.title}</span>
                      <small>{assignment.meta}</small>
                    </div>
                    <button type="button">Periksa & Nilai</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="mentor-dashboard-panel mentor-dashboard-message-panel" aria-labelledby="latest-message-title">
              <div className="mentor-dashboard-panel-head">
                <div>
                  <p>Pesan Terbaru</p>
                  <h2 id="latest-message-title">Butuh balasan</h2>
                </div>
                <button type="button">Buka Pesan</button>
              </div>

              <div className="mentor-dashboard-message-list">
                {latestMessages.map((message) => (
                  <article className="mentor-dashboard-message-item" key={message.sender}>
                    <span>{message.sender.charAt(0)}</span>
                    <div>
                      <strong>{message.sender}</strong>
                      <p>{message.excerpt}</p>
                      <small>{message.time}</small>
                    </div>
                    <button type="button">Balas</button>
                  </article>
                ))}
              </div>
            </section>

            <section className="mentor-dashboard-panel mentor-dashboard-material-panel" aria-labelledby="mentor-material-title">
              <div className="mentor-dashboard-panel-head">
                <div>
                  <p>Materi</p>
                  <h2 id="mentor-material-title">Antrian konten</h2>
                </div>
                <button type="button">Kelola</button>
              </div>

              <div className="mentor-dashboard-material-list">
                {materialQueue.map((material) => (
                  <article key={material.title}>
                    <div>
                      <strong>{material.title}</strong>
                      <span>{material.count}</span>
                    </div>
                    <small>{material.status}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="mentor-dashboard-panel mentor-dashboard-calendar-panel" aria-labelledby="mentor-calendar-title">
              <div className="mentor-dashboard-panel-head">
                <div>
                  <p>Kalender</p>
                  <h2 id="mentor-calendar-title">Minggu ini</h2>
                </div>
              </div>

              <div className="mentor-dashboard-calendar-grid" aria-label="Jadwal minggu ini">
                {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, index) => (
                  <span className={index === 2 || index === 4 ? 'is-busy' : ''} key={day}>
                    {day}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default DashboardMentor
