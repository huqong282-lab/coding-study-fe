import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import CourseDetailScreen from '../screens/CourseDetail/CourseDetailScreen'
import CourseCheckoutScreen from '../screens/CourseCheckout/CourseCheckoutScreen'
import CourseLearningScreen from '../screens/CourseLearning/CourseLearningScreen'
import ClassesScreen from '../screens/Classes/ClassesFilterScreen'
import DashboardMentor from '../screens/DashboardMentor/DashboardMentor'
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
  onboardingCategories,
  isOnboardingLoading,
  onboardingError,
  authError,
  isAuthLoading,
  setMode,
  setLanguage,
  setProgrammerPosition,
  toggleProgrammingLanguage,
  handleLogin,
  handleRegister,
  handleContinueLanguageSelection: completeLanguageSelection,
  handleSkipLanguageSelection,
  handleLogout,
}: AppNavigatorProps) {
  const navigate = useNavigate()
  const shouldCompleteLanguageSelection = isAuthenticated && !hasCompletedLanguageSelection
  const postAuthRedirectPath = shouldCompleteLanguageSelection ? '/language-selection' : '/home'

  function handleOpenCourse(course: Course) {
    navigate(`/courses/${course.id}`)
  }

  async function handleContinueLanguageSelection() {
    const completed = await completeLanguageSelection()
    if (completed) {
      navigate('/home')
    }
    return completed
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
              onModeChange={setMode}
              onLanguageChange={setLanguage}
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
              onModeChange={setMode}
              onLanguageChange={setLanguage}
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
              categories={onboardingCategories}
              onToggleLanguage={toggleProgrammingLanguage}
              onContinue={handleContinueLanguageSelection}
              onSkip={handleSkipLanguageSelection}
              isLoading={isOnboardingLoading}
              error={onboardingError}
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
          ) : currentUser?.role === 'mentor' ? (
            <DashboardMentor user={currentUser} onLogout={handleLogout} />
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
        path="/classes"
        element={
          shouldCompleteLanguageSelection ? (
            <Navigate to="/language-selection" replace />
          ) : (
            <ClassesScreen user={currentUser} onLogout={handleLogout} onOpenCourse={handleOpenCourse} />
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
