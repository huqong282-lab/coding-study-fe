export const dummyUser = {
  name: 'Raka Pratama',
  role: 'Frontend Learner',
  email: 'raka@codingstudy.dev',
  level: 'Intermediate',
  avatar: 'RP',
  streak: 12,
  points: 2480,
  rank: 8,
}

export const dummyStats = [
  { label: 'Materi selesai', value: '18/32', detail: '56% progress' },
  { label: 'Tugas aktif', value: '4', detail: '2 deadline minggu ini' },
  { label: 'Jam belajar', value: '42j', detail: '+6j dari minggu lalu' },
  { label: 'Sertifikat', value: '3', detail: '1 hampir selesai' },
]

export const dummyCourses = [
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

export const dummyTasks = [
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

export const dummyActivities = [
  'Menyelesaikan materi Component Composition',
  'Mengirim tugas Login Screen',
  'Bergabung ke React Study Night',
  'Mendapat badge Consistent Learner',
]

export const languageOptions = [
  { value: 'id', label: 'Indonesia' },
  { value: 'en', label: 'English' },
]

export const programmerPositionOptions = [
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

export const appCopy = {
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
