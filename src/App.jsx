
import { useState, useEffect } from 'react'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Footer from './components/Footer'
import ExerciseManager from './pages/ExerciseManager'

import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import Physio from './pages/Physio'
import TrainerDashboard from './pages/TrainerDashboard'
import NutritionDashboard from './pages/NutritionDashboard'
import CoachDashboard from './pages/CoachDashboard'
import SinglePlayer from './pages/singlePlayer'
import Login from './pages/Login'

// 🔥 PHYSIO SUB PAGES
import Consultation from './components/PhysioSessionForm'
import RehabProgram from './pages/RehabProgram'
import Assessment from './pages/Physioassessments'
// import PhysioReports from './pages/PhysioReports'

export default function App() {
  const [activePath, setActivePath] = useState('/login')
  const [role, setRole] = useState(null)

  // 🔥 AUTO LOGIN AFTER REFRESH
  useEffect(() => {
    const savedRole = localStorage.getItem('role')

    if (savedRole) {
      setRole(savedRole)

      switch (savedRole) {
        case 'admin':
          setActivePath('/')
          break

        case 'trainer':
          setActivePath('/trainer')
          break

        case 'physio':
          setActivePath('/physio')
          break

        case 'nutrition':
          setActivePath('/nutrition')
          break

        case 'coach':
          setActivePath('/coach')
          break

        case 'player':
          setActivePath('/single-player')
          break

        default:
          setActivePath('/login')
      }
    }
  }, [])

  // 🔥 LOGIN HANDLER
  const handleLogin = (data) => {
    const { role, token, id } = data

    // ✅ SAVE AUTH DATA
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('userId', id)

    setRole(role)

    // ✅ REDIRECT BASED ON ROLE
    switch (role) {
      case 'admin':
        setActivePath('/')
        break

      case 'trainer':
        setActivePath('/trainer')
        break

      case 'physio':
        setActivePath('/physio')
        break

      case 'nutrition':
        setActivePath('/nutrition')
        break

      case 'coach':
        setActivePath('/coach')
        break

      case 'player':
        setActivePath('/single-player')
        break

      default:
        setActivePath('/')
    }
  }

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')

    setRole(null)
    setActivePath('/login')
  }

  // 🔥 ROUTES
  const renderPage = () => {
    switch (activePath) {
      case '/':
        return <Dashboard />

      case '/players':
        return <Players />

      // 🔥 MAIN PHYSIO DASHBOARD
      case '/physio':
        return <Physio />

      // // 🔥 PHYSIO SUB ROUTES
      case '/consultation':
        return <Consultation />

      case '/rehab':
        return <RehabProgram />
        case '/exercises':
  return <ExerciseManager />

      case '/assessment':
        return <Assessment />

      // case '/physio/reports':
      //   return <PhysioReports />

      case '/trainer':
        return <TrainerDashboard />

      case '/nutrition':
        return <NutritionDashboard />

      case '/coach':
        return <CoachDashboard />

      case '/single-player':
        return <SinglePlayer />

      case '/login':
        return <Login onLogin={handleLogin} />

      default:
        return <div>Page Not Found</div>
    }
  }

  // 🔥 PAGE TITLES
  const getTitle = () => {
    switch (activePath) {
      case '/':
        return 'Dashboard'

      case '/players':
        return 'Players'

      case '/physio':
        return 'Physio Dashboard'

      case 'consultation':
        return 'Consultation'


        case '/exercises':
  return 'Exercises'

      case '/rehab':
        return 'Rehab Program'

      case '/assessment':
        return 'Assessment'

      // case '/physio/reports':
      //   return 'Physio Reports'

      case '/trainer':
        return 'Trainer Dashboard'

      case '/nutrition':
        return 'Nutrition Dashboard'

      case '/coach':
        return 'Coach Dashboard'

      case '/single-player':
        return 'Player Dashboard'

      default:
        return 'Cricket System'
    }
  }

  const isLogin = activePath === '/login'
  const isPlayer = role === 'player'

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#f3f4f6',
      }}
    >
      {/* 🔥 SIDEBAR */}
      {!isLogin && !isPlayer && (
        <Sidebar
          activePath={activePath}
          onNavigate={setActivePath}
          role={role}
        />
      )}

      {/* 🔥 MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 🔥 HEADER */}
        {!isLogin && (
          <Header
            title={getTitle()}
            onLogout={handleLogout}
          />
        )}

        {/* 🔥 PAGE CONTENT */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1 }}>{renderPage()}</div>
          {!isLogin && <Footer />}
        </main>
      </div>
    </div>
  )
}
