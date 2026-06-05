import { useState } from 'react'
import Login from './components/forms/Login'
import Register from './components/forms/Register'
import './App.css'

function App() {
  const [mode, setMode] = useState('login')
  const isLogin = mode === 'login'

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Coding Study introduction">
        <p className="eyebrow">Learning dashboard</p>
        <h1>Coding Study</h1>
        <p className="hero-copy">
          Masuk ke ruang belajar tim untuk mengelola materi, latihan, dan progres
          coding dalam satu tempat.
        </p>

        <div className="feature-grid" aria-label="Coding Study highlights">
          <div>
            <span>01</span>
            <strong>Track Progress</strong>
            <p>Pantau modul dan latihan yang sedang berjalan.</p>
          </div>
          <div>
            <span>02</span>
            <strong>Team Notes</strong>
            <p>Simpan catatan belajar agar mudah dibagikan.</p>
          </div>
          <div>
            <span>03</span>
            <strong>Daily Practice</strong>
            <p>Bangun kebiasaan latihan dengan alur yang jelas.</p>
          </div>
        </div>
      </section>

      <section className="auth-card" aria-label={`${isLogin ? 'Login' : 'Register'} form`}>
        <div className="auth-card-header">
          <div>
            <p className="eyebrow">{isLogin ? 'Welcome back' : 'Create account'}</p>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
          </div>
          <div className="mode-toggle" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              className={isLogin ? 'active' : ''}
              onClick={() => setMode('login')}
              role="tab"
              aria-selected={isLogin}
            >
              Login
            </button>
            <button
              type="button"
              className={!isLogin ? 'active' : ''}
              onClick={() => setMode('register')}
              role="tab"
              aria-selected={!isLogin}
            >
              Register
            </button>
          </div>
        </div>

        {isLogin ? (
          <Login onSwitchToRegister={() => setMode('register')} />
        ) : (
          <Register onSwitchToLogin={() => setMode('login')} />
        )}
      </section>
    </main>
  )
}

export default App
