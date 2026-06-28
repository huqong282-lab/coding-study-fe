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

  function handleOpenCourse(course: Course) {
    onOpenCourse(course)
  }

  return (
    <main className="home-page">
      <Navbar user={user ?? undefined} onLogout={onLogout} />

      <section className="home-hero" id="top" aria-labelledby="home-hero-title">
        <div className="home-hero__badge">
          <span className="home-hero__dot" aria-hidden="true" />
          Platform belajar coding terlengkap 2025
        </div>

        <div className="home-hero__layout">
          <div className="home-hero__copy">
            <p className="home-section-kicker">KOMUNITAS BELAJAR CODING</p>
            <h1 className="home-hero__title" id="home-hero-title">
              Kuasai <span>Coding</span> Bersama Komunitas.
            </h1>
            <p className="home-hero__description">
              Belajar pemrograman dengan kurikulum terstruktur, mentor berpengalaman, dan komunitas
              aktif yang mendukung perjalananmu dari nol sampai siap kerja.
            </p>

            <div className="home-hero__actions">
              <a className="btn btn-primary" href="#classes">
                Mulai Belajar Gratis
              </a>
              <a className="btn btn-secondary" href="#tech">
                Lihat Kelas
              </a>
            </div>
          </div>

          <div className="home-hero__visual" aria-hidden="true">
            <div className="home-hero__orb home-hero__orb--one" />
            <div className="home-hero__orb home-hero__orb--two" />
            <div className="home-hero__panel">
              <span className="home-hero__panel-label">Community-driven learning</span>
              <strong>Belajar lebih cepat bersama mentor, project, dan peer review.</strong>
              <div className="home-hero__panel-grid">
                <div>
                  <span>12.400+</span>
                  <small>Siswa aktif</small>
                </div>
                <div>
                  <span>80+</span>
                  <small>Kelas tersedia</small>
                </div>
                <div>
                  <span>4.9/5</span>
                  <small>Rating rata-rata</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats" aria-label="Statistik Coding Study">
        <div>
          <strong>12.400+</strong>
          <span>Siswa Aktif</span>
        </div>
        <div>
          <strong>80+</strong>
          <span>Kelas Tersedia</span>
        </div>
        <div>
          <strong>4.9/5</strong>
          <span>Rating Rata-rata</span>
        </div>
      </section>

      <section className="home-content" id="classes">
        <CourseShowcase
          courses={displayedCourses}
          onOpenCourse={handleOpenCourse}
          activeTopic={activeTopic}
          learningLanguages={learningLanguages}
          languageOptions={languageOptions}
          isInterestPanelOpen={isInterestPanelOpen}
          onToggleLanguage={onToggleLanguage}
          onOpenAllTopic={openAllTopic}
          onSelectTopic={selectTopic}
          onShowInterestPanel={showInterestPanel}
          getLanguageLabel={getLanguageLabel}
        />
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
