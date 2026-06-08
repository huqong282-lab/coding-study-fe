import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [language, setLanguage] = useState('id')
  const [programmerPosition, setProgrammerPosition] = useState('frontend')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(false)
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = useState([])
  const [registeredUser, setRegisteredUser] = useState(defaultUser)
  const [currentUser, setCurrentUser] = useState(defaultUser)

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
    setMode('login')
    navigate('/', { replace: true })
  }

  function handleRegister(user) {
    setRegisteredUser(user)
    setMode('login')
  }

  function handleLogin(credentials) {
    const matchedUser =
      credentials.email.toLowerCase() === registeredUser.email.toLowerCase()
        ? registeredUser
        : { ...defaultUser, email: credentials.email }

    setCurrentUser(matchedUser)
    setIsAuthenticated(true)
    navigate('/language-selection', { replace: true })
  }

  function handleContinueLanguageSelection() {
    setHasCompletedLanguageSelection(true)
    navigate('/home', { replace: true })
  }

  function handleOpenCourse(course) {
    navigate(`/courses/${course.id}`)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={hasCompletedLanguageSelection ? '/home' : '/language-selection'} replace />
          ) : (
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
      />
      <Route
        path="/language-selection"
        element={
          isAuthenticated && !hasCompletedLanguageSelection ? (
            <LanguageSelectionScreen
              language={language}
              selectedLanguages={selectedProgrammingLanguages}
              onToggleLanguage={toggleProgrammingLanguage}
              onContinue={handleContinueLanguageSelection}
            />
          ) : (
            <Navigate to={isAuthenticated ? '/home' : '/'} replace />
          )
        }
      />
      <Route
        path="/home"
        element={
          isAuthenticated && hasCompletedLanguageSelection ? (
            <HomeScreen
              language={language}
              programmerPosition={programmerPosition}
              user={currentUser}
              selectedProgrammingLanguages={selectedProgrammingLanguages}
              onToggleLanguage={toggleProgrammingLanguage}
              onLanguageChange={setLanguage}
              onProgrammerPositionChange={setProgrammerPosition}
              onOpenCourse={handleOpenCourse}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to={isAuthenticated ? '/language-selection' : '/'} replace />
          )
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          isAuthenticated && hasCompletedLanguageSelection ? (
            <CourseDetailScreen language={language} user={currentUser} onLogout={handleLogout} />
          ) : (
            <Navigate to={isAuthenticated ? '/language-selection' : '/'} replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
