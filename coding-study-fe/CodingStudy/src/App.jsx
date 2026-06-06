import { useState } from 'react'
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

  if (isAuthenticated) {
    return (
      <HomeScreen
        language={language}
        programmerPosition={programmerPosition}
        user={currentUser}
        selectedProgrammingLanguages={selectedProgrammingLanguages}
        onToggleLanguage={toggleProgrammingLanguage}
        onLanguageChange={setLanguage}
        onProgrammerPositionChange={setProgrammerPosition}
        onLogout={handleLogout}
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
