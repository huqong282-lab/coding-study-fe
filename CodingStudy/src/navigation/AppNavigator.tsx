import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import CourseDetailScreen from '../screens/CourseDetail/CourseDetailScreen'
import CourseCheckoutScreen from '../screens/CourseCheckout/CourseCheckoutScreen'
import CourseLearningScreen from '../screens/CourseLearning/CourseLearningScreen'
import HomeScreen from '../screens/Home/HomeScreen'
import LanguageSelectionScreen from '../screens/LanguageSelection/LanguageSelectionScreen'
import LoginScreen from '../screens/Login/LoginScreen'
import type { Course } from '../types/product'
import type { AppFlowController } from '../types/user'

type AppNavigatorProps = AppFlowController

function AppNavigator({
  mode,
  language,
  programmerPosition,
  isAuthenticated,
  hasCompletedLanguageSelection,
  selectedProgrammingLanguages,
  currentUser,
  authError,
  isAuthLoading,
  setMode,
  setLanguage,
  setProgrammerPosition,
  toggleProgrammingLanguage,
  handleLogin,
  handleRegister,
  handleContinueLanguageSelection,
  handleLogout,
}: AppNavigatorProps) {
  const navigate = useNavigate()

  function handleOpenCourse(course: Course) {
    navigate(`/courses/${course.id}`)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/home" replace />}
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <LoginScreen
              mode="login"
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
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <LoginScreen
              mode="register"
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
            <Navigate to="/home" replace />
          )
        }
      />
      <Route
        path="/home"
        element={
          <HomeScreen
            programmerPosition={programmerPosition}
            user={currentUser}
            selectedProgrammingLanguages={selectedProgrammingLanguages}
            onToggleLanguage={toggleProgrammingLanguage}
            onOpenCourse={handleOpenCourse}
            onLogout={handleLogout}
          />
        }
      />
      <Route
        path="/courses/:courseId"
        element={<CourseDetailScreen language={language} user={currentUser} onLogout={handleLogout} />}
      />
      <Route
        path="/courses/:courseId/checkout"
        element={<CourseCheckoutScreen language={language} user={currentUser} onLogout={handleLogout} />}
      />
      <Route
        path="/courses/:courseId/learn"
        element={<CourseLearningScreen language={language} user={currentUser} onLogout={handleLogout} />}
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}

export default AppNavigator
