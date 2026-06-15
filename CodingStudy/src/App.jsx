import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import CourseDetailScreen from './screens/CourseDetail/CourseDetailScreen'
import HomeScreen from './screens/Home/HomeScreen'
import LanguageSelectionScreen from './screens/LanguageSelection/LanguageSelectionScreen'
import LoginScreen from './screens/Login/LoginScreen'
import * as authServices from './services/authServices'
import './App.css'

function App() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [language, setLanguage] = useState('id')
  const [programmerPosition, setProgrammerPosition] = useState('frontend')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [, setAuthToken] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(false)
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  function toggleProgrammingLanguage(languageId) {
    setSelectedProgrammingLanguages((currentLanguages) =>
      currentLanguages.includes(languageId)
        ? currentLanguages.filter((item) => item !== languageId)
        : [...currentLanguages, languageId],
    )
  }

  function handleLogout() {
    setIsAuthenticated(false)
    setAuthToken('')
    setCurrentUser(null)
    setHasCompletedLanguageSelection(false)
    setSelectedProgrammingLanguages([])
    setMode('login')
    navigate('/', { replace: true })
  }

  async function handleRegister(user) {
    setAuthError('')
    setIsAuthLoading(true)

    try {
      await authServices.register(user)
      setMode('login')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Register gagal')
    } finally {
      setIsAuthLoading(false)
    }
  }

  async function handleLogin(credentials) {
    setAuthError('')
    setIsAuthLoading(true)

    try {
      const result = await authServices.login(credentials)

      setCurrentUser(result.user)
      setAuthToken(result.accessToken)
      setIsAuthenticated(true)
      navigate('/language-selection', { replace: true })
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Login gagal')
    } finally {
      setIsAuthLoading(false)
    }
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
              authError={authError}
              isAuthLoading={isAuthLoading}
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
