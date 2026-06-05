import { useState } from 'react'
import HomeScreen from './screens/Home/HomeScreen'
import LanguageSelectionScreen from './screens/LanguageSelection/LanguageSelectionScreen'
import LoginScreen from './screens/Login/LoginScreen'
import './App.css'

function App() {
  const [mode, setMode] = useState('login')
  const [language, setLanguage] = useState('id')
  const [programmerPosition, setProgrammerPosition] = useState('frontend')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(false)
  const [selectedProgrammingLanguages, setSelectedProgrammingLanguages] = useState([])

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
      onLogin={() => setIsAuthenticated(true)}
    />
  )
}

export default App
