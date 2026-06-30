import { courseCatalog } from '../../data/courses'

const languageTracks = [
  { name: 'React', label: 'Frontend', icon: '⚛', color: '#8b6dff', ids: ['javascript', 'typescript'] },
  { name: 'Python', label: 'Data & AI', icon: '◉', color: '#6ee7a8', ids: ['python'] },
  { name: 'JavaScript', label: 'Web Dasar', icon: '●', color: '#ffd166', ids: ['javascript'] },
  { name: 'Node.js', label: 'Backend', icon: '⬢', color: '#61d56f', ids: ['javascript', 'go'] },
  { name: 'Flutter', label: 'Mobile', icon: '▣', color: '#ffb74d', ids: ['dart', 'kotlin'] },
  { name: 'TypeScript', label: 'Scalable App', icon: '◈', color: '#a78bfa', ids: ['typescript'] },
  { name: 'PHP', label: 'Web App', icon: '⚙', color: '#f59e0b', ids: ['php'] },
  { name: 'Golang', label: 'Performance', icon: '✦', color: '#38bdf8', ids: ['go'] },
  { name: 'Kotlin', label: 'Android', icon: '◌', color: '#c084fc', ids: ['kotlin'] },
  { name: 'Laravel', label: 'Backend PHP', icon: '♦', color: '#fb7185', ids: ['php'] },
  { name: 'Blender', label: '3D Design', icon: '⬟', color: '#f97316', ids: [] },
  { name: 'AI / ML', label: 'Machine Learning', icon: '⌬', color: '#22d3ee', ids: ['python', 'sql'] },
]

function getClassCount(ids: string[]) {
  if (ids.length === 0) {
    return 3
  }

  return courseCatalog.filter((course) => ids.includes(course.languageId)).length
}

function LanguageTracks() {
  return (
    <section className="home-section home-section--languages" id="tech" aria-labelledby="language-title">
      <div className="home-section__header home-section__header--stacked">
        <p className="home-section-kicker">TEKNOLOGI</p>
        <h2 className="home-section-title" id="language-title">
          Semua Bahasa & <span>Framework Populer</span>
        </h2>
      </div>

      <div className="language-track-grid" aria-label="Daftar bahasa pemrograman dan framework">
        {languageTracks.map((track) => (
          <article className="language-track-card" key={track.name}>
            <span className="language-track-card__icon" style={{ color: track.color }}>
              {track.icon}
            </span>
            <strong>{track.name}</strong>
            <p>{getClassCount(track.ids)} kelas</p>
            <small>{track.label}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LanguageTracks
