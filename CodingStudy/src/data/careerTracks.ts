export type CareerTrack = {
  id: string
  name: string
  summary: string
  courseLanguageIds: string[]
}

export const careerTracks: CareerTrack[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    summary: 'Bangun website modern dari frontend sampai backend.',
    courseLanguageIds: ['javascript', 'typescript', 'php', 'go'],
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    summary: 'Olah data, baca insight, dan susun laporan analitik.',
    courseLanguageIds: ['python', 'sql'],
  },
  {
    id: 'apps-development',
    name: 'Apps Development',
    summary: 'Buat aplikasi mobile dan produk lintas platform.',
    courseLanguageIds: ['dart', 'kotlin', 'javascript'],
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    summary: 'Rancang pengalaman produk digital yang nyaman dipakai.',
    courseLanguageIds: ['typescript', 'javascript'],
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    summary: 'Bangun visual brand, konten, dan aset kreatif.',
    courseLanguageIds: ['javascript', 'typescript'],
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    summary: 'Kelola deployment, container, dan workflow infrastruktur.',
    courseLanguageIds: ['go', 'python'],
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    summary: 'Pelajari fondasi keamanan aplikasi dan sistem.',
    courseLanguageIds: ['python', 'go', 'sql'],
  },
  {
    id: 'digital-product',
    name: 'Digital Product',
    summary: 'Susun strategi produk, riset user, dan delivery fitur.',
    courseLanguageIds: ['javascript', 'python', 'sql'],
  },
]

export const careerTrackMap = new Map(careerTracks.map((track) => [track.id, track]))
