import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import CourseDetailScreen from '../screens/CourseDetail/CourseDetailScreen'
import CourseCheckoutScreen from '../screens/CourseCheckout/CourseCheckoutScreen'
import CourseLearningScreen from '../screens/CourseLearning/CourseLearningScreen'
import DashboardStudent from '../screens/DashboardStudent/DashboardStudent'
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
  handleContinueLanguageSelection: completeLanguageSelection,
  handleLogout,
}: AppNavigatorProps) {
  const navigate = useNavigate()
  const shouldCompleteLanguageSelection = isAuthenticated && !hasCompletedLanguageSelection
  const postAuthRedirectPath = shouldCompleteLanguageSelection ? '/language-selection' : '/home'

  function handleOpenCourse(course: Course) {
    navigate(`/courses/${course.id}`)
  }

  function handleContinueLanguageSelection() {
    completeLanguageSelection()
    navigate('/home')
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={postAuthRedirectPath} replace />}
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={postAuthRedirectPath} replace />
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
            <Navigate to={postAuthRedirectPath} replace />
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
          shouldCompleteLanguageSelection ? (
            <LanguageSelectionScreen
              language={language}
              selectedLanguages={selectedProgrammingLanguages}
              onToggleLanguage={toggleProgrammingLanguage}
              onContinue={handleContinueLanguageSelection}
            />
          ) : (
            <Navigate to={isAuthenticated ? '/home' : '/login'} replace />
          )
        }
      />
      <Route
        path="/home"
        element={
          shouldCompleteLanguageSelection ? (
            <Navigate to="/language-selection" replace />
          ) : (
            <HomeScreen
              programmerPosition={programmerPosition}
              user={currentUser}
              selectedProgrammingLanguages={selectedProgrammingLanguages}
              onToggleLanguage={toggleProgrammingLanguage}
              onOpenCourse={handleOpenCourse}
              onLogout={handleLogout}
            />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          shouldCompleteLanguageSelection ? (
            <Navigate to="/language-selection" replace />
          ) : (
            <DashboardStudent
              user={currentUser}
              selectedProgrammingLanguages={selectedProgrammingLanguages}
              onLogout={handleLogout}
            />
          )
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          shouldCompleteLanguageSelection ? (
            <Navigate to="/language-selection" replace />
          ) : (
            <CourseDetailScreen language={language} user={currentUser} onLogout={handleLogout} />
          )
        }
      />
      <Route
        path="/courses/:courseId/checkout"
        element={
          shouldCompleteLanguageSelection ? (
            <Navigate to="/language-selection" replace />
          ) : (
            <CourseCheckoutScreen language={language} user={currentUser} onLogout={handleLogout} />
          )
        }
      />
      <Route
        path="/courses/:courseId/learn"
        element={
          shouldCompleteLanguageSelection ? (
            <Navigate to="/language-selection" replace />
          ) : (
            <CourseLearningScreen language={language} user={currentUser} onLogout={handleLogout} />
          )
        }
      />
      <Route path="*" element={<Navigate to={postAuthRedirectPath} replace />} />
    </Routes>
  )
}

export default AppNavigator
