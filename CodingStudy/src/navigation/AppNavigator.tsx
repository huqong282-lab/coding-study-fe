import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import CourseDetailScreen from '../screens/CourseDetail/CourseDetailScreen'
import CourseCheckoutScreen from '../screens/CourseCheckout/CourseCheckoutScreen'
import CourseLearningScreen from '../screens/CourseLearning/CourseLearningScreen'
import DashboardAdmin from '../screens/DashboardAdmin/DashboardAdmin'
import DashboardMentor from '../screens/DashboardMentor/DashboardMentor'
import DashboardStudent from '../screens/DashboardStudent/DashboardStudent'
import MentorClassCreateScreen from '../screens/MentorClassCreate/MentorClassCreateScreen'
import ForgotPasswordScreen from '../screens/ForgotPassword/ForgotPasswordScreen'
import HomeScreen from '../screens/Home/HomeScreen'
import LanguageSelectionScreen from '../screens/LanguageSelection/LanguageSelectionScreen'
import LoginScreen from '../screens/Login/LoginScreen'
import NotFoundScreen from '../screens/NotFound/NotFoundScreen'
import {
  ComingSoonClassScreen,
  ForbiddenScreen,
  ForumEmptyScreen,
  InternalServerErrorScreen,
  MaintenanceScreen,
  UnauthorizedScreen,
} from '../screens/SystemStates/SystemStateScreens'
import OtpVerificationScreen from '../screens/OtpVerification/OtpVerificationScreen'
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
  accessToken,
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
  handleLogout,
}: AppNavigatorProps) {
  const navigate = useNavigate()
  const currentUserRole = currentUser?.role?.toLowerCase()
  const isAdmin = currentUserRole === 'admin'
  const isMentor = currentUserRole === 'mentor'
  const shouldCompleteLanguageSelection =
    isAuthenticated && !isAdmin && !hasCompletedLanguageSelection
  const authenticatedRedirectPath = isAdmin ? '/dashboard' : '/home'
  const postAuthRedirectPath = !isAuthenticated
    ? '/login'
    : shouldCompleteLanguageSelection
      ? '/language-selection'
      : authenticatedRedirectPath

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
        path="/forgot-password"
        element={isAuthenticated ? <Navigate to={postAuthRedirectPath} replace /> : <ForgotPasswordScreen />}
      />
      <Route path="/verify-otp" element={<OtpVerificationScreen />} />
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
              isLoading={isOnboardingLoading}
              error={onboardingError}
            />
          ) : (
            <Navigate to={isAuthenticated ? postAuthRedirectPath : '/login'} replace />
          )
        }
      />
      <Route
        path="/home"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <Navigate to="/dashboard" replace />
          ) : shouldCompleteLanguageSelection ? (
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
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : shouldCompleteLanguageSelection ? (
            <Navigate to="/language-selection" replace />
          ) : isAdmin ? (
            <DashboardAdmin user={currentUser} onLogout={handleLogout} />
          ) : isMentor ? (
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
        path="/dashboard/classes/new"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : shouldCompleteLanguageSelection ? (
            <Navigate to="/language-selection" replace />
          ) : isMentor ? (
            <MentorClassCreateScreen
              language={language}
              user={currentUser}
              accessToken={accessToken}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/dashboard" replace />
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
      <Route path="/404" element={<NotFoundScreen />} />
      <Route path="/500" element={<InternalServerErrorScreen />} />
      <Route path="/maintenance" element={<MaintenanceScreen />} />
      <Route path="/403" element={<ForbiddenScreen />} />
      <Route path="/unauthorized" element={<UnauthorizedScreen />} />
      <Route path="/forum-empty" element={<ForumEmptyScreen />} />
      <Route path="/coming-soon" element={<ComingSoonClassScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  )
}

export default AppNavigator
