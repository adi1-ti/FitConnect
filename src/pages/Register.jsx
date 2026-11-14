
import { useState } from 'react'
import { Activity, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function Register({ onRegister }) {
  const [mode, setMode] = useState('signup')
  const [f, setF] = useState({
    name: '',
    email: '',
    password: '',
    dept: 'CSE',
    goal: 'Stay active'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const set = (key) => (e) => {
    setF((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const result = await onRegister(f, mode)

      if (result?.needsConfirmation) {
        setMessage('Account created! Please check your email to confirm your account, then log in.')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async () => {
    setError('')
    setLoading(true)

    try {
      await onRegister({
        name: 'Riya Sharma',
        dept: 'CSE',
        goal: 'Build stamina'
      }, 'demo')
    } catch (err) {
      setError(err.message || 'Unable to open demo account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register">
      <div className="card">
        <div className="brand-logo" style={{ width: 52, height: 52 }}>
          <Activity size={26} />
        </div>

        <h1>Welcome to FitConnect</h1>
        <p>Move more, earn points, climb your campus leaderboard.</p>

        <div className="row2" style={{ marginBottom: 20 }}>
          <button
            type="button"
            className={`btn ${mode === 'signup' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => {
              setMode('signup')
              setError('')
              setMessage('')
            }}
          >
            Create account
          </button>

          <button
            type="button"
            className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => {
              setMode('login')
              setError('')
              setMessage('')
            }}
          >
            Log in
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <div className="field">
                <label>Your name</label>
                <input
                  value={f.name}
                  onChange={set('name')}
                  placeholder="e.g. Riya Sharma"
                  required
                />
              </div>

              <div className="row2">
                <div className="field">
                  <label>Department</label>
                  <select value={f.dept} onChange={set('dept')}>
                    {['CSE', 'ECE', 'EE', 'ME', 'CE', 'IT', 'Other'].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Fitness goal</label>
                  <select value={f.goal} onChange={set('goal')}>
                    {['Stay active', 'Build stamina', 'Lose weight', 'Get stronger'].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="field">
            <label>Email address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
                style={{ position: 'absolute', left: 12, top: 13, opacity: 0.5 }}
              />
              <input
                type="email"
                value={f.email}
                onChange={set('email')}
                placeholder="you@example.com"
                autoComplete="email"
                style={{ paddingLeft: 38 }}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={17}
                style={{ position: 'absolute', left: 12, top: 13, opacity: 0.5 }}
              />
              <input
                type="password"
                value={f.password}
                onChange={set('password')}
                placeholder="At least 6 characters"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                style={{ paddingLeft: 38 }}
                minLength={6}
                required
              />
            </div>
          </div>

          {error && (
            <p style={{ color: '#d94848', fontSize: 13 }}>{error}</p>
          )}

          {message && (
            <p style={{ color: '#238653', fontSize: 13 }}>{message}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 10 }}
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'signup'
                ? 'Create account'
                : 'Log in'}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '18px 0', opacity: 0.6 }}>
          OR
        </div>

        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: '100%' }}
          onClick={demoLogin}
          disabled={loading}
        >
          <User size={17} />
          Use demo account (with sample data)
        </button>
      </div>
    </div>
  )
}
