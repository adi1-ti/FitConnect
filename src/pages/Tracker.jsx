
import { useState } from 'react'
import { Zap, Trash2 } from 'lucide-react'

import { TYPES, calcPoints, calcSteps } from '../utils/fitness'
import { dateKey } from '../utils/dates'
import { ICONS, ActivityRow } from './Dashboard'

export default function Tracker({ activities = [], onAdd, onDelete }) {
  const [type, setType] = useState('running')
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const [date, setDate] = useState(dateKey())
  const [saving, setSaving] = useState(false)

  const d = Number(duration) || 0
  const km = Number(distance) || 0

  const pts = d > 0 ? calcPoints(type, d, km) : 0
  const steps = calcSteps(type, km)

  const history = [...activities].sort((a, b) => {
    const dateCompare = String(b.date).localeCompare(String(a.date))
    if (dateCompare !== 0) return dateCompare
    return String(b.id).localeCompare(String(a.id))
  })

  const submit = async () => {
    if (d <= 0 || saving) return

    if (km < 0) {
      alert('Distance cannot be negative.')
      return
    }

    setSaving(true)

    try {
      await onAdd({
        type,
        duration: d,
        distance: km,
        date,
        points: pts,
        steps
      })

      setDuration('')
      setDistance('')
      setDate(dateKey())
    } catch (error) {
      console.error('Could not save activity:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return
    }

    await onDelete(id)
  }

  return (
    <>
      <div className="page-head fade-up">
        <h1>Log activity</h1>
        <p>Track a session and watch your points grow.</p>
      </div>

      <div className="grid g2">
        {/* New activity form */}
        <div className="card fade-up" style={{ '--i': 1 }}>
          <h3>New activity</h3>

          <div className="type-picker">
            {Object.keys(TYPES).map((t) => {
              const Icon = ICONS[t]

              return (
                <button
                  key={t}
                  type="button"
                  className={`type-opt ${type === t ? 'on' : ''}`}
                  onClick={() => setType(t)}
                >
                  {Icon && <Icon size={22} />}
                  {TYPES[t].label}
                </button>
              )
            })}
          </div>

          <div className="row2">
            <div className="field">
              <label>Duration (min)</label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
              />
            </div>

            <div className="field">
              <label>Distance (km)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="5.0"
              />
            </div>
          </div>

          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={date}
              max={dateKey()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="preview">
            <span>You'll earn</span>
            <span>
              <Zap size={16} />
              +{pts} pts
              {steps > 0 && ` · ~${steps.toLocaleString()} steps`}
            </span>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={submit}
            disabled={d <= 0 || saving}
          >
            <Zap size={18} />
            {saving ? 'Saving...' : 'Save activity'}
          </button>
        </div>

        {/* Activity history */}
        <div className="card fade-up" style={{ '--i': 2 }}>
          <h3>History ({history.length})</h3>

          <div style={{ maxHeight: 460, overflowY: 'auto' }}>
            {history.length === 0 ? (
              <div className="empty">
                Nothing logged yet. Add your first activity!
              </div>
            ) : (
              history.map((activity, index) => (
                <div key={activity.id}>
                  <ActivityRow
                    a={activity}
                    i={Math.min(index, 8)}
                    onDelete={handleDelete}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
