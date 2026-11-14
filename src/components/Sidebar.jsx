import {
  LayoutDashboard,
  PlusCircle,
  Trophy,
  Target,
  Sparkles,
  Activity
} from 'lucide-react'
import Avatar from './Avatar'

export const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tracker', label: 'Log', icon: PlusCircle },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'challenges', label: 'Challenges', icon: Target },
  { id: 'coach', label: 'AI Coach', icon: Sparkles },
]

export default function Sidebar({ page, setPage, user, level, points, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo"><Activity size={20} /></div>
        <span>Fit<b>Connect</b></span>
      </div>

      {NAV.map((n) => (
        <button
          key={n.id}
          className={`nav-item ${page === n.id ? 'active' : ''}`}
          onClick={() => setPage(n.id)}
        >
          <n.icon size={20} /> {n.label}
        </button>
      ))}

      <div className="nav-spacer" />

      <div className="user-chip">
        <div className="row">
          <Avatar name={user.name} me />
          <div>
            <b style={{ fontSize: 14 }}>{user.name}</b>
            <br />
            <small>{user.dept} · {level.name} · {points} pts</small>
          </div>
        </div>
        <button className="link-btn" onClick={onLogout}>Switch / reset profile</button>
      </div>
    </aside>
  )
}