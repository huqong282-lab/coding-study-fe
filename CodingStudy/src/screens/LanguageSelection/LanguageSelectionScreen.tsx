import type { Language } from '../../types/user'

type LanguageOption = {
  id: string
  name: string
  description: string
  icon: string
  tag: string
  tone: string
}

type LanguageSelectionScreenProps = {
  language?: Language
  selectedLanguages: string[]
  onToggleLanguage: (languageId: string) => void
  onContinue: () => void
}

const programmingLanguageOptions: LanguageOption[] = [
  { id: 'javascript', name: 'JavaScript', description: 'Bahasa utama untuk web', icon: 'JS', tag: 'Terpopuler', tone: 'amber' },
  { id: 'python', name: 'Python', description: 'Data, AI, dan scripting', icon: 'PY', tag: 'Mudah dipelajari', tone: 'cyan' },
  { id: 'typescript', name: 'TypeScript', description: 'JS dengan tipe data kuat', icon: 'TS', tag: 'Pro', tone: 'blue' },
  { id: 'php', name: 'PHP / Laravel', description: 'Backend web paling luas', icon: 'PHP', tag: 'Terpopuler', tone: 'purple' },
  { id: 'kotlin', name: 'Kotlin', description: 'Android native & backend', icon: 'KT', tag: 'Pro', tone: 'violet' },
  { id: 'go', name: 'Golang', description: 'Performa tinggi, backend', icon: 'GO', tag: 'Pro', tone: 'sky' },
  { id: 'flutter', name: 'Flutter', description: 'Aplikasi iOS dan Android', icon: 'FL', tag: 'Mudah dipelajari', tone: 'teal' },
  { id: 'sql', name: 'SQL', description: 'Query dan kelola database', icon: 'DB', tag: 'Mudah dipelajari', tone: 'emerald' },
]

const copy = {
  id: {
    progress: 'Langkah 1 dari 3',
    title: 'Mau belajar bahasa apa?',
    description: 'Pilih satu atau lebih - bisa diubah kapan saja',
    selected: 'bahasa dipilih',
    continue: 'Lanjut',
    skip: 'Lewati',
  },
  en: {
    progress: 'Step 1 of 3',
    title: 'Which languages do you want to learn?',
    description: 'Pick one or more - you can change it anytime',
    selected: 'languages selected',
    continue: 'Continue',
    skip: 'Skip',
  },
}

function LanguageSelectionScreen({
  language = 'id',
  selectedLanguages,
  onToggleLanguage,
  onContinue,
}: LanguageSelectionScreenProps) {
  const text = copy[language]
  const hasSelection = selectedLanguages.length > 0

  return (
    <main className="onboarding-screen">
      <section className="onboarding-shell">
        <div className="onboarding-shell__glow onboarding-shell__glow--left" />
        <div className="onboarding-shell__glow onboarding-shell__glow--right" />
        <div className="onboarding-shell__topbar">
          <span className="onboarding-shell__progress" />
        </div>

        <div className="onboarding-shell__content">
          <header className="onboarding-header">
            <p className="onboarding-eyebrow">{text.progress}</p>
            <h1 className="onboarding-title">{text.title}</h1>
            <p className="onboarding-description">{text.description}</p>
          </header>

          <div className="onboarding-grid">
            {programmingLanguageOptions.map((item, index) => {
              const isSelected = selectedLanguages.includes(item.id)

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onToggleLanguage(item.id)}
                  aria-pressed={isSelected}
                  className={`onboarding-card onboarding-card--${item.tone} ${
                    isSelected ? 'is-selected' : ''
                  }`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <span className="onboarding-card__glow" />
                  <div className="onboarding-card__top">
                    <span className="onboarding-card__icon">{item.icon}</span>
                    <span className={`onboarding-card__tag onboarding-card__tag--${item.tone}`}>
                      {item.tag}
                    </span>
                  </div>

                  <div className="onboarding-card__body">
                    <strong>{item.name}</strong>
                    <p>{item.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <footer className="onboarding-footer">
          <p className="onboarding-footer__count">
            <span>{selectedLanguages.length}</span> {text.selected}
          </p>

          <button
            type="button"
            onClick={onContinue}
            className={`onboarding-footer__continue ${hasSelection ? 'is-active' : ''}`}
          >
            {hasSelection ? text.continue : text.skip}
          </button>
        </footer>
      </section>
    </main>
  )
}

export default LanguageSelectionScreen
