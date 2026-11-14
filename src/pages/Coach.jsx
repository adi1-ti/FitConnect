import { useMemo, useState } from 'react'
import { Sparkles, Send, TrendingUp, Lightbulb } from 'lucide-react'
import { buildSummary, localCoach, askCoach, hasAI } from '../utils/coach'

const QUICK = ['Plan my next week', 'How can I keep my streak?', 'Give me a 15-minute routine']

export default function Coach({ user, activities, points }) {
  const summary = useMemo(() => buildSummary(activities, user, points), [activities, user, points])
  const local = useMemo(() => localCoach(summary), [summary])
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const ask = async (text) => {
    const question = (text ?? q).trim()
    if (!question) return
    setQ(question); setLoading(true); setAnswer('')
    try {
      setAnswer(await askCoach(summary, question))
    } catch {
      setAnswer(`${local.message}\n\n${local.suggestions.map((s) => '• ' + s).join('\n')}\n\n(Offline coach: add a Gemini API key for live AI answers.)`)
    }
    setLoading(false)
  }

  return (
    <>
      <div className="page-head fade-up"><h1>AI Fitness Coach</h1><p>Personalised tips based on your real activity data.</p></div>

      <div className="card coach-box fade-up" style={{ '--i': 1, display: 'flex', gap: 16, alignItems: 'center' }}>
        <div className="brand-logo" style={{ width: 54, height: 54, flexShrink: 0 }}><Sparkles size={26} /></div>
        <div className="coach-msg">{local.message}</div>
        <span className={`live-tag ${hasAI ? '' : 'off'}`}>{hasAI ? '● Gemini live' : 'Offline coach'}</span>
      </div>

      <div className="grid g2 mt">
        <div className="card fade-up" style={{ '--i': 2 }}>
          <h3><TrendingUp size={18} color="#4f46e5" /> Weekly analysis</h3>
          <ul className="bullets">{local.analysis.map((a, i) => <li key={i} style={{ '--i': i }}>{a}</li>)}</ul>
        </div>
        <div className="card fade-up" style={{ '--i': 3 }}>
          <h3><Lightbulb size={18} color="#f97316" /> Suggestions for you</h3>
          <ul className="bullets">{local.suggestions.map((a, i) => <li key={i} style={{ '--i': i }}>{a}</li>)}</ul>
        </div>
      </div>

      <div className="card mt fade-up" style={{ '--i': 4 }}>
        <h3><Sparkles size={18} color="#4f46e5" /> Ask your coach</h3>
        <div className="chips">{QUICK.map((x) => <button key={x} className="chip" onClick={() => ask(x)}>{x}</button>)}</div>
        <div className="ask">
          <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask()} placeholder="e.g. I have exams, how do I stay active?" />
          <button className="btn btn-primary" onClick={() => ask()} disabled={loading}><Send size={16} /> Ask</button>
        </div>
        {loading && <div className="typing"><i /><i /><i /></div>}
        {answer && <div className="ai-answer">{answer}</div>}
      </div>
    </>
  )
}