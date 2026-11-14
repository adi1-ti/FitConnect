import { statsByDay, getStreak, getLevel } from './fitness'

const MODEL = 'gemini-2.5-flash'
const KEY = import.meta.env.VITE_GEMINI_API_KEY
export const hasAI = Boolean(KEY)

export function buildSummary(acts, user, pts) {
  const s = statsByDay(acts, 14)
  const prev = s.slice(0, 7), cur = s.slice(7)
  const tot = (a, k) => a.reduce((x, d) => x + d[k], 0)
  const prevPts = tot(prev, 'points'), curPts = tot(cur, 'points')
  const keys = new Set(cur.map((d) => d.key))
  const types = [...new Set(acts.filter((a) => keys.has(a.date)).map((a) => a.type))]
  return {
    name: user.name.split(' ')[0], goal: user.goal,
    steps: tot(cur, 'steps'), km: +tot(cur, 'km').toFixed(1), minutes: tot(cur, 'minutes'),
    points: curPts, activeDays: cur.filter((d) => d.minutes > 0).length,
    change: prevPts ? Math.round(((curPts - prevPts) / prevPts) * 100) : null,
    types, streak: getStreak(acts), todaySteps: cur[6].steps, level: getLevel(pts).name,
  }
}

export function localCoach(s) {
  const analysis = [
    `You were active on ${s.activeDays} of 7 days, covering ${s.km} km in ${s.minutes} minutes.`,
    `You earned ${s.points} points this week${s.change === null ? '.' : s.change >= 0 ? `, up ${s.change}% from last week. 📈` : `, down ${Math.abs(s.change)}% from last week. Let's bounce back!`}`,
    `Your current streak is ${s.streak} day${s.streak === 1 ? '' : 's'} and your level is ${s.level}.`,
  ]
  const suggestions = []
  if (s.todaySteps < 5000) suggestions.push(`You're ${5000 - s.todaySteps} steps from today's 5,000 goal. A 20-minute walk between classes will do it.`)
  else suggestions.push('You crushed today\'s step goal! Claim your challenge reward on the Challenges page.')
  if (s.activeDays < 4) suggestions.push('Aim for 4 active days this week. Even a 15-minute walk counts.')
  if (!s.types.includes('running')) suggestions.push('Try a 20-minute easy jog. Running earns the most points per km.')
  if (!s.types.includes('cycling')) suggestions.push('Add a cycling session this weekend for variety and leg strength.')
  if (!s.types.includes('workout')) suggestions.push('A 15-minute bodyweight workout (squats, push-ups, plank) boosts your points fast.')
  if (s.streak >= 3) suggestions.push(`Protect your ${s.streak}-day streak. Log something small today.`)
  const msgs = s.streak >= 5
    ? [`${s.streak} days in a row, ${s.name}! You're building a real habit. 🔥`]
    : [`Every step counts, ${s.name}. Start small and stay consistent! 💪`, `Your future self will thank you for today's walk, ${s.name}. 🌟`]
  return { analysis, suggestions: suggestions.slice(0, 4), message: msgs[Math.floor(Math.random() * msgs.length)] }
}

export async function askCoach(summary, question) {
  if (!KEY) throw new Error('no-key')
  const prompt = `You are FitConnect Coach, a friendly, energetic fitness coach for college students. Focus on motivation and simple habits, never medical advice. Keep answers under 140 words, use short lines and a few emojis, no markdown symbols like ** or #.

Student weekly data: ${JSON.stringify(summary)}

Student asks: ${question}`
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  })
  if (!res.ok) throw new Error('api')
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('empty')
  return text.trim()
}