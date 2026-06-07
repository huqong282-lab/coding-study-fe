import { useState } from 'react'
import { courseLookup } from './data/courseCatalog'
import CourseDetailScreen from './screens/CourseDetail/CourseDetailScreen'
import HomeScreen from './screens/Home/HomeScreen'
import LanguageSelectionScreen from './screens/LanguageSelection/LanguageSelectionScreen'
import LoginScreen from './screens/Login/LoginScreen'
import './App.css'

const defaultUser = {
  name: 'Raka Pratama',
  email: 'raka@codingstudy.dev',
}

function App() {
  const [mode, setMode] = useState('login')
  const [language, setLanguage] = useState('id')
  const [programmerPosition, setProgrammerPosition] = useState('frontend')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(false)
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = useState([])
  const [registeredUser, setRegisteredUser] = useState(defaultUser)
  const [currentUser, setCurrentUser] = useState(defaultUser)
  const [selectedCourseId, setSelectedCourseId] = useState(null)

  function toggleProgrammingLanguage(languageId) {
    setSelectedProgrammingLanguages((currentLanguages) =>
      currentLanguages.includes(languageId)
        ? currentLanguages.filter((item) => item !== languageId)
        : [...currentLanguages, languageId],
    )
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setHasCompletedLanguageSelection(false)
    setSelectedProgrammingLanguages([])
    setSelectedCourseId(null)
    setMode('login')
  }

  function handleRegister(user) {
    setRegisteredUser(user)
    setCurrentUser(user)
    setIsAuthenticated(true)
    setHasCompletedLanguageSelection(false)
    setSelectedCourseId(null)
  }

  function handleLogin(credentials) {
    const matchedUser =
      credentials.email.toLowerCase() === registeredUser.email.toLowerCase()
        ? registeredUser
        : { ...defaultUser, email: credentials.email }

    setCurrentUser(matchedUser)
    setIsAuthenticated(true)
    setHasCompletedLanguageSelection(false)
    setSelectedCourseId(null)
  }

  function handleOpenCourse(courseId) {
    setSelectedCourseId(courseId)
  }

  function handleBackFromCourse() {
    setSelectedCourseId(null)
  }

  if (isAuthenticated && !hasCompletedLanguageSelection) {
    return (
      <LanguageSelectionScreen
        language={language}
        selectedLanguages={selectedProgrammingLanguages}
        onToggleLanguage={toggleProgrammingLanguage}
        onContinue={() => setHasCompletedLanguageSelection(true)}
      />
    )
  }

  if (isAuthenticated && selectedCourseId) {
    const selectedCourse = courseLookup[selectedCourseId]

    if (selectedCourse) {
      return <CourseDetailScreen course={selectedCourse} onBack={handleBackFromCourse} />
    }
  }

  if (isAuthenticated) {
    return (
      <HomeScreen
        language={language}
        programmerPosition={programmerPosition}
        user={currentUser}
        selectedProgrammingLanguages={selectedProgrammingLanguages}
        onToggleLanguage={toggleProgrammingLanguage}
        onLogout={handleLogout}
        onOpenCourse={handleOpenCourse}
      />
    )
  }

  return (
    <LoginScreen
      mode={mode}
      language={language}
      programmerPosition={programmerPosition}
      onModeChange={setMode}
      onLanguageChange={setLanguage}
      onProgrammerPositionChange={setProgrammerPosition}
      onLogin={handleLogin}
      onRegister={handleRegister}
    />
  )
}

export default App
