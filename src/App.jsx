import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Results from './components/Results'
import Profile from './components/Profile'
import TabBar from './components/TabBar'
import { useState } from 'react'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-800 text-white">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function AppContent() {
  const [currentTab, setCurrentTab] = useState('home')
  const { user } = useAuth()

  if (!user) return <Login />

  const renderTab = () => {
    switch (currentTab) {
      case 'home':
        return <Home />
      case 'quiz':
        return <Quiz />
      case 'results':
        return <Results />
      case 'profile':
        return <Profile />
      default:
        return <Home />
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 pb-20">
      {renderTab()}
      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <PrivateRoute>
              <AppContent />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App