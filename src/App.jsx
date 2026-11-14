
import { useEffect, useState } from 'react'

import Sidebar from './components/Sidebar'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tracker from './pages/Tracker'
import Leaderboard from './pages/Leaderboard'
import Challenges from './pages/Challenges'
import Coach from './pages/Coach'

import { useLocalStorage } from './utils/storage'
import {
  totalPoints,
  getLevel,
  getBadges,
  getRank
} from './utils/fitness'

import { supabase } from './lib/supabase'
import {
  registerUser,
  loginUser,
  logoutUser
} from './lib/auth'

import {
  getActivities,
  saveActivity,
  deleteActivity
} from './lib/activities'

export default function App() {
  const [user, setUser] = useLocalStorage('fc_user', null)
  const [activities, setActivities] = useLocalStorage('fc_acts', [])
  const [joined, setJoined] = useLocalStorage('fc_joined', [])
  const [claimed, setClaimed] = useLocalStorage('fc_claimed', [])
  const [events, setEvents] = useLocalStorage('fc_events', [])

  const [page, setPage] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const points = totalPoints(activities, claimed)
  const level = getLevel(points)
  const rank = getRank(points, user)

  const notify = (message) => {
    setToast(message)
    window.clearTimeout(window.__fitconnectToast)
    window.__fitconnectToast = window.setTimeout(() => {
      setToast('')
    }, 3500)
  }

  // Load the logged-in user's profile and activities.
  const loadUserData = async (authUser) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle()

    if (error) throw error

    const savedUser = {
      id: authUser.id,
      email: authUser.email,
      name:
        profile?.full_name ||
        authUser.user_metadata?.full_name ||
        authUser.email?.split('@')[0] ||
        'FitConnect User',
      department: profile?.department || '',
      goal: profile?.fitness_goal || 'Stay active',
      university: profile?.university || '',
      year_of_study: profile?.year_of_study || ''
    }

    setUser(savedUser)

    const savedActivities = await getActivities()
    setActivities(savedActivities)

    return savedUser
  }

  // Restore an existing Supabase session when the app opens.
  useEffect(() => {
    let mounted = true

    const restoreSession = async () => {
      try {
        const {
          data: { session },
          error
        } = await supabase.auth.getSession()

        if (error) throw error

        if (session?.user && mounted) {
          await loadUserData(session.user)
        } else if (mounted) {
          setUser(null)
          setActivities([])
        }
      } catch (error) {
        console.error('Session restoration error:', error)
        notify(error.message || 'Could not restore your session.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    restoreSession()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' && mounted) {
        setUser(null)
        setActivities([])
        setPage('dashboard')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Register, log in, or use the demo account.
  const handleRegister = async (profile, mode) => {
    try {
      // Demo account
      if (mode === 'demo') {
        const demoUser = {
          id: 'demo-user',
          name: profile.name || 'Demo User',
          email: profile.email || 'demo@fitconnect.com',
          department: profile.department || 'Computer Applications',
          goal: profile.goal || 'Stay active'
        }

        setUser(demoUser)
        setActivities([])
        setPage('dashboard')
        notify('Welcome to FitConnect!')
        return { success: true }
      }

      // Create account
      if (mode === 'signup') {
        const data = await registerUser(
          profile.name,
          profile.email,
          profile.password
        )

        if (!data?.session) {
          return {
            needsConfirmation: true
          }
        }

        const authUser = data.user

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authUser.id,
            full_name: profile.name,
            department: profile.department,
            fitness_goal: profile.goal
          })

        if (profileError) throw profileError

        await loadUserData(authUser)
        setPage('dashboard')
        notify('Account created successfully!')
        return { success: true }
      }

      // Log in
      if (mode === 'login') {
        const data = await loginUser(
          profile.email,
          profile.password
        )

        await loadUserData(data.user)
        setPage('dashboard')
        notify('Welcome back!')
        return { success: true }
      }
    } catch (error) {
      console.error('Authentication error:', error)
      throw error
    }
  }

  // Save an activity to Supabase.
  const addActivity = async (activity) => {
    try {
      const saved = await saveActivity(activity)

      const nextActivities = [...activities, saved]

      const rankBefore = getRank(points, user)
      const newPoints = totalPoints(nextActivities, claimed)
      const rankAfter = getRank(newPoints, user)

      const previousBadges = getBadges(activities, claimed)
        .filter((badge) => badge.earned)
        .map((badge) => badge.id)

      const unlockedBadge = getBadges(nextActivities, claimed)
        .find(
          (badge) =>
            badge.earned && !previousBadges.includes(badge.id)
        )

      setActivities(nextActivities)

      let message = `+${saved.points} points earned!`

      if (rankAfter < rankBefore) {
        message += ` Rank improved: #${rankBefore} → #${rankAfter}`
      }

      if (unlockedBadge) {
        message += ` Badge unlocked: ${unlockedBadge.name}`
      }

      notify(message)
      return saved
    } catch (error) {
      console.error('Activity save error:', error)
      notify(error.message || 'Could not save activity.')
      throw error
    }
  }

  // Delete an activity from Supabase.
  const removeActivity = async (id) => {
    try {
      await deleteActivity(id)

      setActivities((previous) =>
        previous.filter((activity) => activity.id !== id)
      )

      notify('Activity deleted successfully.')
    } catch (error) {
      console.error('Activity delete error:', error)
      notify(error.message || 'Could not delete activity.')
    }
  }

  // Join a challenge.
  const joinChallenge = (challengeId) => {
    if (joined.includes(challengeId)) return

    setJoined((previous) => [...previous, challengeId])
    notify('You joined the challenge!')
  }

  // Claim a completed challenge.
  const claimChallenge = (challengeId, reward = 0) => {
    if (claimed.includes(challengeId)) return

    setClaimed((previous) => [...previous, challengeId])
    notify(`You claimed ${reward} points!`)
  }

  // Join an event.
  const joinEvent = (eventId) => {
    setEvents((previous) => {
      if (previous.includes(eventId)) return previous
      return [...previous, eventId]
    })

    notify('You joined the event!')
  }

  // Log out.
  const handleLogout = async () => {
    try {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      if (session) {
        await logoutUser()
      }

      setUser(null)
      setActivities([])
      setJoined([])
      setClaimed([])
      setEvents([])
      setPage('dashboard')
      notify('You have been logged out.')
    } catch (error) {
      console.error('Logout error:', error)
      notify(error.message || 'Could not log out.')
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p>Loading FitConnect...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Register onRegister={handleRegister} />
        {toast && <div className="toast">{toast}</div>}
      </>
    )
  }

  return (
    <div className="app">
      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        level={level}
        points={points}
        onLogout={handleLogout}
      />

      <main className="main">
        {page === 'dashboard' && (
          <Dashboard
            user={user}
            activities={activities}
            claimed={claimed}
            points={points}
            setPage={setPage}
          />
        )}

        {page === 'tracker' && (
          <Tracker
            activities={activities}
            onAdd={addActivity}
            onDelete={removeActivity}
          />
        )}

        {page === 'leaderboard' && (
          <Leaderboard
            user={user}
            activities={activities}
            points={points}
            rank={rank}
          />
        )}

        {page === 'challenges' && (
          <Challenges
            user={user}
            activities={activities}
            points={points}
            joined={joined}
            claimed={claimed}
            onJoin={joinChallenge}
            onClaim={claimChallenge}
            events={events}
            onJoinEvent={joinEvent}
          />
        )}

        {page === 'coach' && (
          <Coach
            user={user}
            activities={activities}
            points={points}
          />
        )}
      </main>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  )
}
