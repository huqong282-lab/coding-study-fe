const languageTracks = [
  { name: 'Flutter', field: 'Mobile Development', mark: 'F', color: '#48c7f4' },
  { name: 'Python', field: 'Data Science', mark: 'Py', color: '#ffd64a' },
  { name: 'Laravel', field: 'Back-End Development', mark: 'L', color: '#ff4438' },
  { name: 'React JS', field: 'Front-End Development', mark: 'R', color: '#61dafb' },
  { name: 'Kotlin', field: 'Android Development', mark: 'K', color: '#ff8c2a' },
  { name: 'Golang', field: 'Back-End Development', mark: 'Go', color: '#00add8' },
  { name: 'Blender', field: '3D UI Design', mark: 'B', color: '#ff7a1a' },
]

function LanguageTracks() {
  return (
    <section className="bwa-section bwa-language-section" aria-labelledby="language-title">
      <div className="bwa-section-heading">
        <p>Mastering Freelancer Tools</p>
        <h1 id="language-title">Kelas Online Coding Study. Materi Paling Update.</h1>
      </div>

      <div className="language-track-rail">
        {languageTracks.map((track) => (
          <article className="language-track-card" key={track.name}>
            <span style={{ color: track.color }}>{track.mark}</span>
            <div>
              <h2>{track.name}</h2>
              <p>{track.field}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LanguageTracks
