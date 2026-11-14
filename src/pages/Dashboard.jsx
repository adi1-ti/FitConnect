import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Cell
} from 'recharts'
import {
  Flame, Zap, Clock, MapPin, Footprints,
  Wind, Bike, Dumbbell, Trash2
} from 'lucide-react'

import StatCard from '../components/StatCard'
import Ring from '../components/Ring'
import Progress from '../components/Progress'
import {
  statsByDay, getStreak, getLevel, getBadges
} from '../utils/fitness'
import { useCountUp } from '../utils/storage'

export const ICONS = {
  walking: Footprints,
  running: Wind,
  cycling: Bike,
  workout: Dumbbell
}

export const TYPE_COLORS = {
  walking: ['#e6f8f1', '#10b981'],
  running: ['#fff1e6', '#f97316'],
  cycling: ['#e7f6fd', '#06b6d4'],
  workout: ['#f3e8ff', '#a855f7']
}

const METRICS = [
  { id: 'steps', label: 'Steps' },
  { id: 'points', label: 'Points' },
  { id: 'minutes', label: 'Minutes' },
  { id: 'km', label: 'Distance (km)' }
]

export default function Dashboard({
  user, activities, claimed, points, setPage
}) {
  const [metric, setMetric] = useState('steps')

  const week = statsByDay(activities, 7)
  const today = week[6]
  const streak = getStreak(activities)
  const level = getLevel(points)
  const badges = getBadges(activities, claimed)

  const left = Math.max(0, 5000 - today.steps)
  const stepsAnim = useCountUp(today.steps)

  const recent = [...activities]
    .sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id))
    .slice(0, 5)

  const sum = (k) => week.reduce((s, d) => s + d[k], 0)

  return (
    <>
      <div className="hero fade-up">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2>Hey {user.name.split(' ')[0]}!</h2>

          <p>
            {left === 0
              ? "You've smashed today's 5,000 step goal. Keep the momentum going!"
              : `You're ${left.toLocaleString()} steps away from today's 5,000 goal. Log a quick walk or run to get there.`}
          </p>

          <button className="btn btn-white" onClick={() => setPage('tracker')}>
            <Zap size={18} /> Log activity
          </button>
        </div>

        <Ring value={today.steps / 5000}>
          <b>{Math.round(stepsAnim).toLocaleString()}</b>
          <small>/ 5,000 steps</small>
        </Ring>
      </div>

      <div className="grid g4 mt">
        <StatCard icon={Zap} label="Total points" value={points}
          color="#4f46e5" bg="#eef0ff" delay={1} />

        <StatCard icon={Flame} label="Day streak" value={streak}
          color="#f97316" bg="#fff1e6" delay={2} className="flame" />

        <StatCard icon={Clock} label="Active minutes (7d)" value={sum('minutes')}
          color="#10b981" bg="#e6f8f1" delay={3} />

        <StatCard icon={MapPin} label="Distance (7d)"
          value={+sum('km').toFixed(1)} suffix=" km"
          color="#06b6d4" bg="#e7f6fd" delay={4} />
      </div>

      <div className="grid g-chart mt">
        <div className="card fade-up" style={{ '--i': 5 }}>
          <h3>Weekly progress</h3>

          <div className="chips">
            {METRICS.map((m) => (
              <button
                key={m.id}
                className={`chip ${metric === m.id ? 'on' : ''}`}
                onClick={() => setMetric(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={week} margin={{ left: -10 }}>
                <CartesianGrid vertical={false} stroke="#eef1f7" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6b7487', fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#6b7487', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f3f4ff' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: 'none',
                    boxShadow: '0 8px 24px rgba(0,0,0,.12)'
                  }}
                />
                <Bar
                  dataKey={metric}
                  radius={[8, 8, 0, 0]}
                  animationDuration={900}
                  key={metric}
                >
                  {week.map((d, i) => (
                    <Cell
                      key={i}
                      fill={i === 6 ? '#4f46e5' : '#a5b4fc'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card fade-up" style={{ '--i': 6 }}>
            <h3>Fitness level</h3>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 10,
              fontWeight: 800
            }}>
              <span>Lv {level.number} · {level.name}</span>
              <span style={{
                color: 'var(--muted)',
                fontWeight: 600,
                fontSize: 13
              }}>
                {level.next
                  ? `${level.next.min - points} pts to ${level.next.name}`
                  : 'Max level!'}
              </span>
            </div>

            <Progress value={level.progress} />
          </div>

          <div className="card fade-up" style={{ '--i': 7 }}>
            <h3>Badges · {badges.filter((b) => b.earned).length}/{badges.length}</h3>

            <div className="badges">
              {badges.map((b, i) => (
                <div
                  key={b.id}
                  className={`badge ${b.earned ? '' : 'locked'}`}
                  style={{ '--i': i }}
                >
                  <span className="em">{b.icon}</span>
                  <small>{b.name}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card mt fade-up" style={{ '--i': 8 }}>
        <h3>Recent activity</h3>

        {recent.length === 0 && (
          <div className="empty">No activity yet. Log your first one!</div>
        )}

        {recent.map((a, i) => (
          <ActivityRow key={a.id} a={a} i={i} />
        ))}
      </div>
    </>
  )
}

export function ActivityRow({ a, i, onDelete }) {
  const Icon = ICONS[a.type]
  const [bg, fg] = TYPE_COLORS[a.type]

  return (
    <div className="list-item" style={{ '--i': i }}>
      <div className="type-ico" style={{ background: bg, color: fg }}>
        <Icon size={20} />
      </div>

      <div className="info">
        <b>{a.type}</b>
        <small>
          {a.duration} min
          {a.distance > 0 ? ` · ${a.distance} km` : ''}
          {' · '}
          {new Date(a.date + 'T00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}
        </small>
      </div>

      <span className="pts">+{a.points} pts</span>

      {onDelete && (
        <button className="icon-btn" onClick={() => onDelete(a.id)}>
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}