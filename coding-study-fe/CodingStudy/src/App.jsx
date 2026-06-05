import { useMemo, useState } from 'react'
import Login from './components/forms/Login'
import Register from './components/forms/Register'
import LanguageSelectionScreen from './screens/LanguageSelection/LanguageSelectionScreen'
import './App.css'

const dummyUser = {
  name: 'Raka Pratama',
  role: 'Frontend Learner',
  email: 'raka@codingstudy.dev',
  level: 'Intermediate',
  avatar: 'RP',
  streak: 12,
  points: 2480,
  rank: 8,
}

const dummyStats = [
  { label: 'Materi selesai', value: '18/32', detail: '56% progress' },
  { label: 'Tugas aktif', value: '4', detail: '2 deadline minggu ini' },
  { label: 'Jam belajar', value: '42j', detail: '+6j dari minggu lalu' },
  { label: 'Sertifikat', value: '3', detail: '1 hampir selesai' },
]

const dummyCourses = [
  {
    id: 1,
    title: 'React Fundamental',
    category: 'Frontend',
    progress: 78,
    nextLesson: 'State management dengan hooks',
    mentor: 'Dina Laras',
  },
  {
    id: 2,
    title: 'JavaScript Async',
    category: 'Programming',
    progress: 46,
    nextLesson: 'Promise chaining dan error handling',
    mentor: 'Bagas Wicaksono',
  },
  {
    id: 3,
    title: 'UI Styling dengan Tailwind',
    category: 'Design System',
    progress: 62,
    nextLesson: 'Responsive layout pattern',
    mentor: 'Naya Putri',
  },
]

const dummyTasks = [
  {
    id: 1,
    title: 'Buat halaman profile responsive',
    course: 'React Fundamental',
    status: 'In Progress',
    dueDate: 'Hari ini',
  },
  {
    id: 2,
    title: 'Refactor fetch API ke service layer',
    course: 'JavaScript Async',
    status: 'Review',
    dueDate: 'Besok',
  },
  {
    id: 3,
    title: 'Latihan grid dan flexbox',
    course: 'UI Styling dengan Tailwind',
    status: 'Todo',
    dueDate: 'Jumat',
  },
]

const dummyActivities = [
  'Menyelesaikan materi Component Composition',
  'Mengirim tugas Login Screen',
  'Bergabung ke React Study Night',
  'Mendapat badge Consistent Learner',
]

const languageOptions = [
  { value: 'id', label: 'Indonesia' },
  { value: 'en', label: 'English' },
]

const programmerPositionOptions = [
  {
    value: 'frontend',
    label: { id: 'Frontend Developer', en: 'Frontend Developer' },
    focus: {
      id: 'Fokus belajar: React, UI component, responsive layout',
      en: 'Learning focus: React, UI components, responsive layout',
    },
    languages: ['HTML', 'CSS', 'JavaScript', 'TypeScript'],
  },
  {
    value: 'backend',
    label: { id: 'Backend Developer', en: 'Backend Developer' },
    focus: {
      id: 'Fokus belajar: REST API, database, autentikasi',
      en: 'Learning focus: REST APIs, databases, authentication',
    },
    languages: ['JavaScript', 'TypeScript', 'Python', 'Go', 'SQL'],
  },
  {
    value: 'fullstack',
    label: { id: 'Fullstack Developer', en: 'Fullstack Developer' },
    focus: {
      id: 'Fokus belajar: frontend, backend, deployment',
      en: 'Learning focus: frontend, backend, deployment',
    },
    languages: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
  },
  {
    value: 'mobile',
    label: { id: 'Mobile Developer', en: 'Mobile Developer' },
    focus: {
      id: 'Fokus belajar: React Native, state, API integration',
      en: 'Learning focus: React Native, state, API integration',
    },
    languages: ['Kotlin', 'Swift', 'Dart', 'JavaScript', 'TypeScript'],
  },
  {
    value: 'devops',
    label: { id: 'DevOps Engineer', en: 'DevOps Engineer' },
    focus: {
      id: 'Fokus belajar: CI/CD, container, monitoring',
      en: 'Learning focus: CI/CD, containers, monitoring',
    },
    languages: ['Bash', 'YAML', 'Python', 'Go'],
  },
  {
    value: 'data',
    label: { id: 'Data Engineer', en: 'Data Engineer' },
    focus: {
      id: 'Fokus belajar: pipeline data, SQL, dashboard analytics',
      en: 'Learning focus: data pipelines, SQL, analytics dashboards',
    },
    languages: ['Python', 'SQL', 'Scala', 'Java'],
  },
]

const appCopy = {
  id: {
    dashboardTitle: 'Dashboard belajar',
    logout: 'Logout',
    greeting: `Halo, ${dummyUser.name}`,
    dashboardHeadline: 'Fitur utama sudah bisa dicoba dengan data dummy.',
    dashboardDescription:
      'Kamu bisa melihat progress kelas, tugas, grup belajar, aktivitas, dan ringkasan profil tanpa menunggu koneksi backend.',
    continueLearning: 'Lanjut belajar',
    viewTasks: 'Lihat tugas',
    streak: 'Streak',
    days: 'hari',
    points: 'Poin',
    activeClasses: 'Kelas aktif',
    learningMaterials: 'Materi belajar',
    classes: 'kelas',
    mentor: 'Mentor',
    nextLesson: 'Materi berikutnya',
    progressSummary: 'Ringkasan progress',
    taskEyebrow: 'Tugas',
    deadline: 'Deadline',
    community: 'Komunitas',
    studyGroups: 'Grup belajar',
    members: 'member',
    timeline: 'Timeline',
    latestActivity: 'Aktivitas terbaru',
    language: 'Bahasa',
    programmerPosition: 'Posisi programmer',
    positionFocus: 'Fokus posisi',
    programmingLanguages: 'Bahasa yang digunakan',
    languagesByPosition: 'Bahasa per posisi',
    authEyebrow: 'Learning dashboard',
    authDescription:
      'Masuk ke ruang belajar tim untuk mengelola materi, latihan, dan progres coding dalam satu tempat.',
    highlights: 'Coding Study highlights',
    trackProgress: 'Track Progress',
    trackProgressDescription: 'Pantau modul dan latihan yang sedang berjalan.',
    teamNotes: 'Team Notes',
    teamNotesDescription: 'Simpan catatan belajar agar mudah dibagikan.',
    dailyPractice: 'Daily Practice',
    dailyPracticeDescription: 'Bangun kebiasaan latihan dengan alur yang jelas.',
    welcomeBack: 'Welcome back',
    createAccount: 'Create account',
  },
  en: {
    dashboardTitle: 'Learning dashboard',
    logout: 'Logout',
    greeting: `Hi, ${dummyUser.name}`,
    dashboardHeadline: 'Core features are ready to try with dummy data.',
    dashboardDescription:
      'You can inspect course progress, tasks, study groups, activity, and profile summaries without waiting for the backend.',
    continueLearning: 'Continue learning',
    viewTasks: 'View tasks',
    streak: 'Streak',
    days: 'days',
    points: 'Points',
    activeClasses: 'Active classes',
    learningMaterials: 'Learning materials',
    classes: 'classes',
    mentor: 'Mentor',
    nextLesson: 'Next lesson',
    progressSummary: 'Progress summary',
    taskEyebrow: 'Tasks',
    deadline: 'Deadlines',
    community: 'Community',
    studyGroups: 'Study groups',
    members: 'members',
    timeline: 'Timeline',
    latestActivity: 'Latest activity',
    language: 'Language',
    programmerPosition: 'Programmer position',
    positionFocus: 'Position focus',
    programmingLanguages: 'Languages used',
    languagesByPosition: 'Languages by position',
    authEyebrow: 'Learning dashboard',
    authDescription:
      'Sign in to manage learning materials, practice tasks, and coding progress in one place.',
    highlights: 'Coding Study highlights',
    trackProgress: 'Track Progress',
    trackProgressDescription: 'Monitor modules and exercises currently in progress.',
    teamNotes: 'Team Notes',
    teamNotesDescription: 'Save study notes so they are easy to share.',
    dailyPractice: 'Daily Practice',
    dailyPracticeDescription: 'Build a daily practice habit with a clear flow.',
    welcomeBack: 'Welcome back',
    createAccount: 'Create account',
  },
}

function App() {
  const [mode, setMode] = useState('login')
  const [language, setLanguage] = useState('id')
  const [programmerPosition, setProgrammerPosition] = useState('frontend')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(false)
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = useState([])
  const [selectedCourseId, setSelectedCourseId] = useState(dummyCourses[0].id)
  const isLogin = mode === 'login'
  const t = appCopy[language]
  const selectedPosition = programmerPositionOptions.find(
    (position) => position.value === programmerPosition,
  )

  const selectedCourse = useMemo(
    () => dummyCourses.find((course) => course.id === selectedCourseId),
    [selectedCourseId],
  )

  function toggleProgrammingLanguage(languageId) {
    setSelectedProgrammingLanguages((currentLanguages) =>
      currentLanguages.includes(languageId)
        ? currentLanguages.filter((item) => item !== languageId)
        : [...currentLanguages, languageId],
    )
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setHasCompletedLanguageSelection(false)
    setSelectedProgrammingLanguages([])
  }

  if (isAuthenticated && !hasCompletedLanguageSelection) {
    return (
      <LanguageSelectionScreen
        language={language}
        selectedLanguages={selectedProgrammingLanguages}
        onToggleLanguage={toggleProgrammingLanguage}
        onContinue={() => setHasCompletedLanguageSelection(true)}
      />
    )
  }

  if (isAuthenticated) {
    return (
      <main className="dashboard-page">
        <nav className="dashboard-topbar" aria-label="Dashboard navigation">
          <div>
            <p className="eyebrow">CodingStudy</p>
            <h1>{t.dashboardTitle}</h1>
          </div>
          <div className="profile-actions">
            <label className="language-select">
              <span>{t.language}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="language-select">
              <span>{t.programmerPosition}</span>
              <select
                value={programmerPosition}
                onChange={(event) => setProgrammerPosition(event.target.value)}
              >
                {programmerPositionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[language]}
                  </option>
                ))}
              </select>
            </label>
            <div className="profile-pill">
              <span className="avatar" aria-hidden="true">
                {dummyUser.avatar}
              </span>
              <div>
                <strong>{dummyUser.name}</strong>
                <span>{selectedPosition?.label[language]}</span>
              </div>
            </div>
            <button className="btn btn-secondary" type="button" onClick={handleLogout}>
              {t.logout}
            </button>
          </div>
        </nav>

        <section className="dashboard-hero">
          <div className="dashboard-copy">
            <p className="eyebrow">{t.greeting}</p>
            <h2>{t.dashboardHeadline}</h2>
            <p>{t.dashboardDescription}</p>
            <div className="dashboard-actions">
              <button className="btn btn-primary" type="button">
                {t.continueLearning}
              </button>
              <button className="btn btn-secondary" type="button">
                {t.viewTasks}
              </button>
            </div>
          </div>
          <div className="dashboard-profile-card">
            <span className="avatar avatar-large" aria-hidden="true">
              {dummyUser.avatar}
            </span>
            <h3>{selectedPosition?.label[language]}</h3>
            <p>{dummyUser.email}</p>
            <p className="position-focus">{selectedPosition?.focus[language]}</p>
            <div className="language-stack">
              <span>{t.programmingLanguages}</span>
              <div>
                {selectedPosition?.languages.map((item) => (
                  <strong key={item}>{item}</strong>
                ))}
              </div>
            </div>
            <dl className="profile-metrics">
              <div>
                <dt>{t.streak}</dt>
                <dd>
                  {dummyUser.streak} {t.days}
                </dd>
              </div>
              <div>
                <dt>{t.points}</dt>
                <dd>{dummyUser.points}</dd>
              </div>
              <div>
                <dt>Rank</dt>
                <dd>#{dummyUser.rank}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="stats-grid" aria-label={t.progressSummary}>
          {dummyStats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel panel-large">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.activeClasses}</p>
                <h2>{t.learningMaterials}</h2>
              </div>
              <span>
                {dummyCourses.length} {t.classes}
              </span>
            </div>

            <div className="course-list">
              {dummyCourses.map((course) => (
                <button
                  className={`course-item ${selectedCourseId === course.id ? 'is-active' : ''}`}
                  key={course.id}
                  type="button"
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <div>
                    <span>{course.category}</span>
                    <strong>{course.title}</strong>
                    <p>
                      {t.mentor}: {course.mentor}
                    </p>
                  </div>
                  <small>{course.progress}%</small>
                </button>
              ))}
            </div>

            {selectedCourse && (
              <div className="lesson-preview">
                <div>
                  <p className="eyebrow">{t.nextLesson}</p>
                  <h3>{selectedCourse.nextLesson}</h3>
                </div>
                <div className="progress-track" aria-label={`Progress ${selectedCourse.progress}%`}>
                  <span style={{ width: `${selectedCourse.progress}%` }} />
                </div>
              </div>
            )}
          </div>

          <aside className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.taskEyebrow}</p>
                <h2>{t.deadline}</h2>
              </div>
            </div>
            <div className="task-list">
              {dummyTasks.map((task) => (
                <article className="task-item" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <p>{task.course}</p>
                  </div>
                  <span>{task.status}</span>
                  <small>{task.dueDate}</small>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.programmerPosition}</p>
                <h2>{t.languagesByPosition}</h2>
              </div>
            </div>
            <div className="position-language-list">
              {programmerPositionOptions.map((position) => (
                <article className="position-language-item" key={position.value}>
                  <strong>{position.label[language]}</strong>
                  <div>
                    {position.languages.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="panel panel-large">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{t.timeline}</p>
                <h2>{t.latestActivity}</h2>
              </div>
            </div>
            <ol className="activity-list">
              {dummyActivities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ol>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Coding Study introduction">
        <p className="eyebrow">{t.authEyebrow}</p>
        <h1>Coding Study</h1>
        <p className="hero-copy">{t.authDescription}</p>

        <div className="feature-grid" aria-label={t.highlights}>
          <div>
            <span>01</span>
            <strong>{t.trackProgress}</strong>
            <p>{t.trackProgressDescription}</p>
          </div>
          <div>
            <span>02</span>
            <strong>{t.teamNotes}</strong>
            <p>{t.teamNotesDescription}</p>
          </div>
          <div>
            <span>03</span>
            <strong>{t.dailyPractice}</strong>
            <p>{t.dailyPracticeDescription}</p>
          </div>
        </div>
      </section>

      <section className="auth-card" aria-label={`${isLogin ? 'Login' : 'Register'} form`}>
        <div className="auth-card-header">
          <div>
            <p className="eyebrow">{isLogin ? t.welcomeBack : t.createAccount}</p>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
          </div>
          <div className="auth-controls">
            <label className="language-select">
              <span>{t.language}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)}>
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="language-select">
              <span>{t.programmerPosition}</span>
              <select
                value={programmerPosition}
                onChange={(event) => setProgrammerPosition(event.target.value)}
              >
                {programmerPositionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label[language]}
                  </option>
                ))}
              </select>
            </label>
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
        </div>

        {isLogin ? (
          <Login
            language={language}
            onSwitchToRegister={() => setMode('register')}
            onLogin={() => setIsAuthenticated(true)}
          />
        ) : (
          <Register language={language} onSwitchToLogin={() => setMode('login')} />
        )}
      </section>
    </main>
  )
}

export default App
