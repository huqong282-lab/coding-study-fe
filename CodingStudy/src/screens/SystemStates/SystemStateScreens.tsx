import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type IllustrationVariant = 'not-found' | 'server' | 'maintenance' | 'forbidden' | 'unauthorized' | 'forum' | 'soon'

type SystemStateLayoutProps = {
  eyebrow: string
  title: string
  subtitle?: string
  description: string
  variant: IllustrationVariant
  children: ReactNode
}

function StateIllustration({ variant }: { variant: IllustrationVariant }) {
  return (
    <div className={`state-illustration state-illustration--${variant}`} aria-hidden="true">
      <div className="state-illustration__glow" />
      <div className="state-illustration__screen">
        <div className="state-illustration__bar">
          <span />
          <span />
          <span />
        </div>
        <div className="state-illustration__terminal">
          <code>{variant === 'not-found' ? 'Page Not Found' : variant === 'server' ? 'SERVER_ERROR' : 'ACCESS_CHECK'}</code>
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="state-illustration__bot">
        <span />
        <strong />
      </div>
      <div className="state-illustration__orbit state-illustration__orbit--one" />
      <div className="state-illustration__orbit state-illustration__orbit--two" />
    </div>
  )
}

function SystemStateLayout({ eyebrow, title, subtitle, description, variant, children }: SystemStateLayoutProps) {
  return (
    <main className={`system-state-page system-state-page--${variant}`}>
      <section className="system-state-panel" aria-labelledby={`${variant}-title`}>
        <div className="system-state-copy">
          <p className="home-section-kicker">{eyebrow}</p>
          <h1 id={`${variant}-title`}>{title}</h1>
          {subtitle && <h2>{subtitle}</h2>}
          <p>{description}</p>
          <div className="system-state-actions">{children}</div>
        </div>
        <StateIllustration variant={variant} />
      </section>
    </main>
  )
}

export function NotFoundScreen() {
  return (
    <SystemStateLayout
      eyebrow="404 ERROR"
      title="404"
      subtitle="Halaman yang kamu cari tidak ditemukan."
      description="Mungkin halaman dipindahkan atau URL yang dimasukkan salah."
      variant="not-found"
    >
      <Link className="btn btn-primary" to="/home">
        Kembali ke Beranda
      </Link>
      <Link className="btn btn-secondary" to="/home#classes">
        Jelajahi Kelas
      </Link>
    </SystemStateLayout>
  )
}

export function InternalServerErrorScreen() {
  return (
    <SystemStateLayout
      eyebrow="TERMINAL ERROR"
      title="500"
      subtitle="Server sedang mengalami gangguan."
      description="Tim kami sedang memperbaiki masalah ini."
      variant="server"
    >
      <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
        Coba Lagi
      </button>
      <Link className="btn btn-secondary" to="/home">
        Kembali ke Beranda
      </Link>
    </SystemStateLayout>
  )
}

export function MaintenanceScreen() {
  return (
    <SystemStateLayout
      eyebrow="SYSTEM UPGRADE"
      title="Kami Sedang Melakukan Peningkatan Sistem"
      description="Kami sedang menambahkan fitur baru agar pengalaman belajar semakin baik."
      variant="maintenance"
    >
      <span className="system-state-note">Upgrade sedang berjalan di background.</span>
    </SystemStateLayout>
  )
}

export function ForbiddenScreen() {
  const navigate = useNavigate()

  return (
    <SystemStateLayout
      eyebrow="SECURITY GATE"
      title="403 Access Denied"
      description="Kamu tidak memiliki izin untuk mengakses halaman ini."
      variant="forbidden"
    >
      <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>
        Kembali
      </button>
      <Link className="btn btn-primary" to="/dashboard">
        Dashboard
      </Link>
    </SystemStateLayout>
  )
}

export function UnauthorizedScreen() {
  return (
    <SystemStateLayout
      eyebrow="LOGIN REQUIRED"
      title="Silakan Login Terlebih Dahulu"
      description="Halaman ini hanya dapat diakses oleh pengguna yang sudah login."
      variant="unauthorized"
    >
      <Link className="btn btn-primary" to="/login">
        Login
      </Link>
      <Link className="btn btn-secondary" to="/register">
        Daftar Akun
      </Link>
    </SystemStateLayout>
  )
}

export function ForumEmptyScreen() {
  return (
    <SystemStateLayout
      eyebrow="FORUM CODING STUDY"
      title="Belum ada diskusi."
      description="Jadilah orang pertama yang memulai diskusi."
      variant="forum"
    >
      <Link className="btn btn-primary" to="/forum/new">
        Buat Diskusi Baru
      </Link>
    </SystemStateLayout>
  )
}

export function ComingSoonClassScreen() {
  return (
    <SystemStateLayout
      eyebrow="CLASS ROADMAP"
      title="Kelas Segera Hadir"
      description="Tim mentor sedang mempersiapkan materi terbaik untukmu."
      variant="soon"
    >
      <div className="coming-soon-progress" aria-label="Progress persiapan kelas">
        <span>
          <i />
        </span>
        <small>72% materi sedang diproduksi</small>
      </div>
      <button className="btn btn-primary" type="button">
        Beritahu Saya Saat Rilis
      </button>
    </SystemStateLayout>
  )
}
