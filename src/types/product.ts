export type Course = {
  id: string | number
  languageId: string
  languageName: string
  title: string
  rating: number
  modules: number
  level: string
  duration: string
  access: 'free' | 'paid'
  priceLabel: string
  mentor: string
  description: string
  outcomes: string[]
  syllabus: string[]
}
