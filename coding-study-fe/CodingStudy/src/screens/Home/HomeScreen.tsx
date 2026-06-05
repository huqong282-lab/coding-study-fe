import { useMemo, useState } from 'react'
import {
  appCopy,
  dummyActivities,
  dummyCourses,
  dummyStats,
  dummyTasks,
  dummyUser,
  languageOptions,
  programmerPositionOptions,
} from '../../data/appData'

type HomeScreenProps = {
  language: 'id' | 'en'
  programmerPosition: string
  onLanguageChange: (language: 'id' | 'en') => void
  onProgrammerPositionChange: (position: string) => void
  onLogout: () => void
}

function HomeScreen({
  language,
  programmerPosition,
  onLanguageChange,
  onProgrammerPositionChange,
  onLogout,
}: HomeScreenProps) {
  const [selectedCourseId, setSelectedCourseId] = useState(dummyCourses[0].id)
  const text = appCopy[language]
  const selectedPosition = programmerPositionOptions.find(
    (position) => position.value === programmerPosition,
  )

  const selectedCourse = useMemo(
    () => dummyCourses.find((course) => course.id === selectedCourseId),
    [selectedCourseId],
  )

  return (
    <main className="dashboard-page">
      <nav className="dashboard-topbar" aria-label="Dashboard navigation">
        <div>
          <p className="eyebrow">CodingStudy</p>
          <h1>{text.dashboardTitle}</h1>
        </div>
        <div className="profile-actions">
          <label className="language-select">
            <span>{text.language}</span>
            <select
              value={language}
              onChange={(event) => onLanguageChange(event.target.value as 'id' | 'en')}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="language-select">
            <span>{text.programmerPosition}</span>
            <select
              value={programmerPosition}
              onChange={(event) => onProgrammerPositionChange(event.target.value)}
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
          <button className="btn btn-secondary" type="button" onClick={onLogout}>
            {text.logout}
          </button>
        </div>
      </nav>

      <section className="dashboard-hero">
        <div className="dashboard-copy">
          <p className="eyebrow">{text.greeting}</p>
          <h2>{text.dashboardHeadline}</h2>
          <p>{text.dashboardDescription}</p>
          <div className="dashboard-actions">
            <button className="btn btn-primary" type="button">
              {text.continueLearning}
            </button>
            <button className="btn btn-secondary" type="button">
              {text.viewTasks}
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
            <span>{text.programmingLanguages}</span>
            <div>
              {selectedPosition?.languages.map((item) => (
                <strong key={item}>{item}</strong>
              ))}
            </div>
          </div>
          <dl className="profile-metrics">
            <div>
              <dt>{text.streak}</dt>
              <dd>
                {dummyUser.streak} {text.days}
              </dd>
            </div>
            <div>
              <dt>{text.points}</dt>
              <dd>{dummyUser.points}</dd>
            </div>
            <div>
              <dt>Rank</dt>
              <dd>#{dummyUser.rank}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="stats-grid" aria-label={text.progressSummary}>
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
              <p className="eyebrow">{text.activeClasses}</p>
              <h2>{text.learningMaterials}</h2>
            </div>
            <span>
              {dummyCourses.length} {text.classes}
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
                    {text.mentor}: {course.mentor}
                  </p>
                </div>
                <small>{course.progress}%</small>
              </button>
            ))}
          </div>

          {selectedCourse && (
            <div className="lesson-preview">
              <div>
                <p className="eyebrow">{text.nextLesson}</p>
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
              <p className="eyebrow">{text.taskEyebrow}</p>
              <h2>{text.deadline}</h2>
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
              <p className="eyebrow">{text.programmerPosition}</p>
              <h2>{text.languagesByPosition}</h2>
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
              <p className="eyebrow">{text.timeline}</p>
              <h2>{text.latestActivity}</h2>
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

export default HomeScreen
