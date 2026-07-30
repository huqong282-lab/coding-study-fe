import AppNavigator from './navigation/AppNavigator'
import { useAuth } from './hooks/useAuth'
import './App.css'

function App() {
  const auth = useAuth()

  return <AppNavigator {...auth} />
}

export default App
