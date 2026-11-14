
import { Check, Gift, MapPin, Users, Calendar } from 'lucide-react'
import Progress from '../components/Progress'
import Ring from '../components/Ring'
import { CHALLENGES, challengeProgress, claimKey } from '../utils/challenges'
import { getEvents } from '../data/seed'

export default function Challenges({
  activities = [],
  joined = [],
  claimed = [],
  onJoin,
  onClaim,
  eventsJoined = [],
  onToggleEvent
}) {
  const events = getEvents() || []

  const safeJoined = Array.isArray(joined) ? joined : []
  const safeClaimed = Array.isArray(claimed) ? claimed : []
  const safeEventsJoined = Array.isArray(eventsJoined) ? eventsJoined : []
  const safeActivities = Array.isArray(activities) ? activities : []

  return (
    <>
      <div className="page-head fade-up">
        <h1>Challenges & Events</h1>
        <p>Join a challenge, hit the target, and claim bonus points.</p>
      </div>

      <div className="grid g3">
        {(CHALLENGES || []).map((c, i) => {
          const isJoined = safeJoined.includes(c.id)
          const prog = challengeProgress(c, safeActivities)
          const ratio = c.target > 0 ? prog / c.target : 0
          const complete = ratio >= 1
          const key = claimKey(c)
          const isClaimed = safeClaimed.some((x) => x?.key === key)

          return (
            <div
              key={c.id}
              className="card hover ch-card fade-up"
              style={{ '--i': i + 1 }}
            >
              <span className={`ch-tag ${c.type === 'Group' ? 'group' : ''}`}>
                {c.type === 'Group' ? '👥 Group' : '👤 Individual'}
              </span>

              <h4>{c.title}</h4>
              <p>{c.desc}</p>

              {isJoined && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Ring
                      value={Math.min(1, ratio)}
                      size={110}
                      stroke={10}
                      track="#edf0f7"
                      color={complete ? '#10b981' : '#4f46e5'}
                    >
                      <b style={{ fontSize: 20 }}>
                        {Math.round(Math.min(1, ratio) * 100)}%
                      </b>
                    </Ring>
                  </div>

                  <div className="ch-meta">
                    <span>
                      {prog.toLocaleString()} / {c.target.toLocaleString()} {c.unit}
                    </span>
                    <span className="reward">🎁 {c.reward} pts</span>
                  </div>

                  <Progress
                    value={Math.min(1, ratio)}
                    color={complete ? 'var(--green)' : 'var(--grad)'}
                  />
                </>
              )}

              {c.team != null && (
                <small
                  style={{
                    color: 'var(--muted)',
                    display: 'flex',
                    gap: 6,
                    alignItems: 'center'
                  }}
                >
                  <Users size={14} />
                  {c.team + (isJoined ? 1 : 0)} students taking part
                </small>
              )}

              {!isJoined && (
                <div className="ch-meta">
                  <span className="reward">🎁 Reward: {c.reward} pts</span>
                </div>
              )}

              <div style={{ marginTop: 'auto' }}>
                {!isJoined && (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => onJoin?.(c)}
                  >
                    Join challenge
                  </button>
                )}

                {isJoined && !complete && (
                  <button
                    className="btn btn-ghost"
                    style={{ width: '100%' }}
                    disabled
                  >
                    In progress…
                  </button>
                )}

                {isJoined && complete && !isClaimed && (
                  <button
                    className="btn btn-green claim-pulse"
                    style={{ width: '100%' }}
                    onClick={() => onClaim?.(c, key)}
                  >
                    <Gift size={18} /> Claim {c.reward} pts
                  </button>
                )}

                {isJoined && complete && isClaimed && (
                  <div className="done-tag">
                    <Check size={18} /> Completed & claimed
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="section-title">Campus Fitness Events</h2>

      <div className="grid g2">
        {events.map((e, i) => {
          const going = safeEventsJoined.includes(e.id)

          return (
            <div
              key={e.id}
              className="card hover event fade-up"
              style={{ '--i': i + 4 }}
            >
              <div className="event-date">
                <b>{e.day}</b>
                <small>{e.month}</small>
              </div>

              <div className="info">
                <b>{e.title}</b>
                <small>
                  <MapPin size={13} /> {e.place} ·
                  <Calendar size={13} /> {e.time}
                </small>
                <small>
                  <Users size={13} /> {e.going + (going ? 1 : 0)} going
                </small>
              </div>

              <button
                className={`btn ${going ? 'btn-green' : 'btn-ghost'}`}
                onClick={() => onToggleEvent?.(e)}
              >
                {going ? (
                  <>
                    <Check size={16} /> Going
                  </>
                ) : (
                  'Join'
                )}
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}
