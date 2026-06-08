type LanguageOption = {
  id: string
  name: string
  description: string
  icon: string
}

type LanguageSelectionScreenProps = {
  language?: 'id' | 'en'
  selectedLanguages: string[]
  onToggleLanguage: (languageId: string) => void
  onContinue: () => void
}

const programmingLanguageOptions: LanguageOption[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    description: 'Web, frontend, backend',
    icon: 'JS',
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Data, backend, automation',
    icon: 'PY',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    description: 'React, Node.js, scalable app',
    icon: 'TS',
  },
  {
    id: 'java',
    name: 'Java',
    description: 'Enterprise, Android, backend',
    icon: 'JV',
  },
  {
    id: 'go',
    name: 'Go',
    description: 'API, cloud, microservices',
    icon: 'GO',
  },
  {
    id: 'sql',
    name: 'SQL',
    description: 'Database, analytics, reporting',
    icon: 'DB',
  },
  {
    id: 'dart',
    name: 'Dart',
    description: 'Flutter, mobile app',
    icon: 'DT',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    description: 'Android, mobile app',
    icon: 'KT',
  },
]

const copy = {
  id: {
    progress: 'Langkah 1 dari 2',
    title: 'Pilih bahasa pemrograman yang ingin kamu pelajari',
    description:
      'Pilih satu atau beberapa bahasa. Ini hanya dummy onboarding supaya dashboard bisa menyesuaikan minat belajar kamu.',
    selected: 'dipilih',
    continue: 'Lanjutkan',
    skip: 'Skip',
  },
  en: {
    progress: 'Step 1 of 2',
    title: 'Choose programming languages you want to learn',
    description:
      'Pick one or more languages. This is dummy onboarding so the dashboard can match your learning interests.',
    selected: 'selected',
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
    <main className="language-page">
      <section className="language-panel" aria-label="Programming language selection">
        <div className="language-progress">
          <span aria-hidden="true" />
        </div>

        <div className="language-header">
          <p className="eyebrow">{text.progress}</p>
          <h1>{text.title}</h1>
          <p>{text.description}</p>
        </div>

        <div className="language-option-grid">
          {programmingLanguageOptions.map((item) => {
            const isSelected = selectedLanguages.includes(item.id)

            return (
              <button
                className={`programming-language-card ${isSelected ? 'is-selected' : ''}`}
                key={item.id}
                type="button"
                onClick={() => onToggleLanguage(item.id)}
                aria-pressed={isSelected}
              >
                <span className="programming-language-icon">{item.icon}</span>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                {isSelected && <span className="selected-check">✓</span>}
              </button>
            )
          })}
        </div>
      </section>

      <footer className="language-footer">
        <span>
          {selectedLanguages.length} {text.selected}
        </span>
        <button
          className={`btn ${hasSelection ? 'btn-primary' : 'btn-secondary'}`}
          type="button"
          onClick={onContinue}
        >
          {hasSelection ? text.continue : text.skip}
        </button>
      </footer>
    </main>
  )
}

export default LanguageSelectionScreen
