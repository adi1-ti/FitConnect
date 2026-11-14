import { Crown } from 'lucide-react'
import Avatar from '../components/Avatar'
import { getLeaderboard } from '../utils/fitness'

export default function Leaderboard({ user, points }) {
  const all = getLeaderboard(points, user)
  const top = all.slice(0, 10)
  const me = all.find((s) => s.me)
  const above = all[me.rank - 2]
  const podium = [top[1], top[0], top[2]]
  const heights = [90, 130, 65]
  const colors = ['#94a3b8', '#f59e0b', '#c2855a']

  return (
    <>
      <div className="page-head fade-up"><h1>Leaderboard</h1><p>Top 10 students on campus, ranked by points.</p></div>

      <div className="card pos-card fade-up" style={{ '--i': 1 }}>
        <div>
          <small style={{ opacity: .85, fontWeight: 700 }}>YOUR POSITION</small>
          <div className="rank" key={me.rank}>#{me.rank}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <b style={{ fontSize: 22 }}>{points} pts</b>
          <div style={{ opacity: .9, fontSize: 14, marginTop: 4 }}>
            {above ? `${above.points - points + 1} pts to pass ${above.name.split(' ')[0]}` : "You're #1! 👑"}
          </div>
        </div>
      </div>

      <div className="podium">
        {podium.map((s, i) => (
          <div key={s.id} className={`pod ${s.me ? 'me' : ''}`} style={{ '--i': i === 1 ? 0 : i === 0 ? 1 : 2 }}>
            {i === 1 && <Crown size={22} color="#f59e0b" className="flame" />}
            <Avatar name={s.name} idx={s.rank} me={s.me} />
            <b>{s.name.split(' ')[0]}{s.me && ' (You)'}</b>
            <small>{s.points} pts</small>
            <div className="base" style={{ height: heights[i], background: colors[i] }}>{s.rank}</div>
          </div>
        ))}
      </div>

      <div className="card fade-up" style={{ '--i': 3 }}>
        {top.slice(3).map((s, i) => <Row key={s.id} s={s} i={i} />)}
        {me.rank > 10 && (<><div className="dots-sep">•••</div><Row s={me} i={7} /></>)}
      </div>
    </>
  )
}

function Row({ s, i }) {
  return (
    <div className={`lb-row ${s.me ? 'me' : ''}`} style={{ '--i': i }}>
      <span className="lb-rank">#{s.rank}</span>
      <Avatar name={s.name} idx={s.rank} me={s.me} />
      <div className="info"><b>{s.name}{s.me && <span className="you-tag">YOU</span>}</b><small>{s.dept}</small></div>
      <span className="pts">{s.points} pts</span>
    </div>
  )
}