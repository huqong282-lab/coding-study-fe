import Footer from '../../components/common/Footer'
import Navbar from '../../components/common/Navbar'
import BrandPartners from '../../components/home/BrandPartners'
import CourseShowcase from '../../components/home/CourseShowcase'
import FaqSection from '../../components/home/FaqSection'
import LanguageTracks from '../../components/home/LanguageTracks'
import Testimonials from '../../components/home/Testimonials'
import type { Course } from '../../types/product'
import type { AppUser, ProgrammerPosition } from '../../types/user'
import { useHomeCourses } from '../../hooks/useHomeCourses'

type HomeScreenProps = {
  programmerPosition: ProgrammerPosition
  user?: AppUser | null
  selectedProgrammingLanguages: string[]
  onToggleLanguage: (languageId: string) => void
  onOpenCourse: (course: Course) => void
  onLogout: () => void
}

function HomeScreen({
  programmerPosition,
  user,
  selectedProgrammingLanguages,
  onToggleLanguage,
  onOpenCourse,
  onLogout,
}: HomeScreenProps) {
  const {
    activeTopic,
    displayedCourses,
    languageOptions,
    isInterestPanelOpen,
    learningLanguages,
    getLanguageLabel,
    openAllTopic,
    selectTopic,
    showInterestPanel,
  } = useHomeCourses(selectedProgrammingLanguages, programmerPosition)
  const firstName = user?.name.trim().split(' ')[0] || 'Learner'

  function handleOpenCourse(course: Course) {
    onOpenCourse(course)
  }

  return (
    <main className="home-page">
      <Navbar user={user ?? undefined} onLogout={onLogout} />

      <section className="home-welcome" id="top">
        <div>
          <p className="home-greeting">👋 Selamat datang, {firstName}!</p>
          <p className="home-profile-email">
            {user ? user.email : 'Masuk untuk menyimpan progres, kelas, dan pengaturanmu.'}
          </p>
          <div className="home-focus-row" aria-label="Fokus belajar saat ini">
            <span>Fokus belajarmu saat ini:</span>
            {learningLanguages.slice(0, 4).map((languageId) => (
              <strong key={languageId}>{getLanguageLabel(languageId)}</strong>
            ))}
          </div>
        </div>
      </section>

      <section className="home-content" id="classes">
        <div className="topic-filter" aria-label="Pilih topik kursus">
          <span>Pilih Topik:</span>
          <button
            className={activeTopic === 'all' ? 'is-active' : ''}
            type="button"
            onClick={openAllTopic}
          >
            Semua
          </button>
          {learningLanguages.map((languageId) => (
            <button
              className={activeTopic === languageId ? 'is-active' : ''}
              key={languageId}
              type="button"
              onClick={() => selectTopic(languageId)}
            >
              {getLanguageLabel(languageId)}
            </button>
          ))}
          <button
            type="button"
            onClick={showInterestPanel}
            aria-expanded={isInterestPanelOpen}
          >
            + Tambah Minat
          </button>
        </div>

        {isInterestPanelOpen && (
          <div className="interest-panel" aria-label="Tambah minat bahasa pemrograman">
            <div>
              <strong>Pilih bahasa tambahan</strong>
              <p>Rekomendasi kursus akan langsung ikut berubah.</p>
            </div>
            <div className="interest-option-grid">
              {languageOptions.map((item) => {
                const isSelected = selectedProgrammingLanguages.includes(item.id)

                return (
                  <button
                    className={isSelected ? 'is-selected' : ''}
                    key={item.id}
                    type="button"
                    onClick={() => onToggleLanguage(item.id)}
                    aria-pressed={isSelected}
                  >
                    <span>{item.name}</span>
                    <small>{isSelected ? 'Dipilih' : 'Tambah'}</small>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <section className="course-recommendation" id="legacy-library" aria-labelledby="recommendation-title">
          <div className="recommendation-heading">
            <p className="eyebrow">🎯 Rekomendasi kursus untukmu</p>
            <h1 id="recommendation-title">Pilih kelas lalu lihat detailnya dulu</h1>
            <p className="recommendation-copy">
              Setiap kelas akan membuka halaman detail berisi ringkasan materi sebelum kamu lanjut
              belajar.
            </p>
          </div>

          <div className="course-card-grid">
            {displayedCourses.map((course) => (
              <article
                className="recommendation-card"
                key={course.id}
                role="button"
                tabIndex={0}
                aria-label={`Buka detail kursus ${course.title}`}
                onClick={() => handleOpenCourse(course)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleOpenCourse(course)
                  }
                }}
              >
                <div className="recommendation-card-top">
                  <span className="course-tag">{course.languageName}</span>
                  <span className="course-pill">Detail kursus</span>
                </div>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>⭐ {course.rating}</span>
                  <span>{course.modules} modul</span>
                  <span>{course.duration}</span>
                  <span className={`price-pill ${course.access === 'free' ? 'is-free' : 'is-paid'}`}>
                    {course.priceLabel}
                  </span>
                </div>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleOpenCourse(course)
                  }}
                >
                  Mulai Belajar
                </button>
              </article>
            ))}
          </div>
        </section>

        <CourseShowcase courses={displayedCourses} onOpenCourse={onOpenCourse} />
        <LanguageTracks />
        <BrandPartners />
        <Testimonials />
        <FaqSection />
      </section>

      <Footer />
    </main>
  )
}

export default HomeScreen
