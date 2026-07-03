import type { Language, OnboardingCategory } from '../../types/user'

type LanguageOption = OnboardingCategory & {
  icon: string
  tag: string
  tone: string
}

type LanguageSelectionScreenProps = {
  language?: Language
  selectedLanguages: string[]
  categories: OnboardingCategory[]
  onToggleLanguage: (languageId: string) => void
  onContinue: () => Promise<boolean>
  onSkip: () => void
  isLoading?: boolean
  error?: string
}

const categoryMeta: Record<string, Pick<LanguageOption, 'icon' | 'tag' | 'tone'>> = {
  javascript: { icon: 'JS', tag: 'Terpopuler', tone: 'amber' },
  typescript: { icon: 'TS', tag: 'Pro', tone: 'blue' },
  python: { icon: 'PY', tag: 'Mudah dipelajari', tone: 'cyan' },
  php: { icon: 'PHP', tag: 'Web Legacy', tone: 'amber' },
  go: { icon: 'GO', tag: 'Pro', tone: 'sky' },
  java: { icon: 'JV', tag: 'Enterprise', tone: 'amber' },
  kotlin: { icon: 'KT', tag: 'Pro', tone: 'violet' },
  dart: { icon: 'DT', tag: 'Mobile', tone: 'teal' },
  sql: { icon: 'DB', tag: 'Mudah dipelajari', tone: 'emerald' },
}

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
  categories,
  onToggleLanguage,
  onContinue,
  onSkip,
  isLoading = false,
  error = '',
}: LanguageSelectionScreenProps) {
  const text = copy[language]
  const hasSelection = selectedLanguages.length > 0

  const onboardingOptions: LanguageOption[] = categories.map((category) => {
    const normalizedName = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '')
    const fallbackIcon = category.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    return {
      ...category,
      icon: categoryMeta[normalizedName]?.icon ?? fallbackIcon,
      tag: categoryMeta[normalizedName]?.tag ?? 'Kategori',
      tone: categoryMeta[normalizedName]?.tone ?? 'violet',
    }
  })

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
            {error ? (
              <p className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </p>
            ) : null}
          </header>

          <div className="onboarding-grid">
            {onboardingOptions.map((item, index) => {
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

            {!isLoading && onboardingOptions.length === 0 ? (
              <div className="col-span-full rounded-[28px] border border-white/10 bg-white/5 px-6 py-8 text-sm text-slate-300">
                Kategori belum tersedia. Coba muat ulang halaman.
              </div>
            ) : null}
          </div>
        </div>

        <footer className="onboarding-footer">
          <p className="onboarding-footer__count">
            <span>{selectedLanguages.length}</span> {text.selected}
          </p>

          <button
            type="button"
            onClick={onContinue}
            disabled={!hasSelection || isLoading}
            className={`onboarding-footer__continue ${hasSelection && !isLoading ? 'is-active' : ''}`}
          >
            {isLoading ? 'Menyimpan...' : text.continue}
          </button>

          <button
            type="button"
            onClick={onSkip}
            className="onboarding-footer__skip"
          >
            {text.skip}
          </button>
        </footer>
      </section>
    </main>
  )
}

export default LanguageSelectionScreen
