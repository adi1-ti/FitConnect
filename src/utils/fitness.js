import { dateKey, lastDays } from './dates'
import { STUDENTS } from '../data/seed'

export const TYPES = {
  walking: { label: 'Walking', perKm: 10, perMin: 0.5, stepsPerKm: 1300 },
  running: { label: 'Running', perKm: 20, perMin: 0.8, stepsPerKm: 1200 },
  cycling: { label: 'Cycling', perKm: 6, perMin: 0.4, stepsPerKm: 0 },
  workout: { label: 'Workout', perKm: 0, perMin: 1.5, stepsPerKm: 0 },
}

export const calcPoints = (type, duration, distance) =>
  Math.round(distance * TYPES[type].perKm + duration * TYPES[type].perMin)
export const calcSteps = (type, distance) => Math.round(distance * TYPES[type].stepsPerKm)

const sum = (arr, k) => arr.reduce((s, a) => s + (Number(a[k]) || 0), 0)

export function statsByDay(acts, n = 7) {
  return lastDays(n).map((d) => {
    const key = dateKey(d)
    const day = acts.filter((a) => a.date === key)
    return {
      key,
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      steps: sum(day, 'steps'),
      points: sum(day, 'points'),
      minutes: sum(day, 'duration'),
      km: +sum(day, 'distance').toFixed(1),
    }
  })
}

export function getStreak(acts) {
  const days = new Set(acts.map((a) => a.date))
  const d = new Date()
  if (!days.has(dateKey(d))) d.setDate(d.getDate() - 1)
  let n = 0
  while (days.has(dateKey(d))) { n++; d.setDate(d.getDate() - 1) }
  return n
}

export const totalPoints = (acts, claimed) => sum(acts, 'points') + sum(claimed, 'pts')

export const LEVELS = [
  { name: 'Rookie', min: 0 }, { name: 'Mover', min: 150 }, { name: 'Athlete', min: 400 },
  { name: 'Pro', min: 800 }, { name: 'Legend', min: 1500 },
]
export function getLevel(pts) {
  let i = 0
  LEVELS.forEach((l, idx) => { if (pts >= l.min) i = idx })
  const cur = LEVELS[i], next = LEVELS[i + 1]
  return { name: cur.name, number: i + 1, next, progress: next ? (pts - cur.min) / (next.min - cur.min) : 1 }
}

export function getBadges(acts, claimed) {
  const pts = totalPoints(acts, claimed)
  const km = sum(acts, 'distance')
  const st = getStreak(acts)
  return [
    { id: 'first', name: 'First Step', icon: '🏁', earned: acts.length > 0 },
    { id: 's3', name: 'On Fire', icon: '🔥', earned: st >= 3 },
    { id: 's7', name: 'Week Warrior', icon: '⚡', earned: st >= 7 },
    { id: 'p100', name: 'Century', icon: '💯', earned: pts >= 100 },
    { id: 'p500', name: 'Powerhouse', icon: '💪', earned: pts >= 500 },
    { id: 'km25', name: 'Road Runner', icon: '👟', earned: km >= 25 },
    { id: 'chal', name: 'Challenger', icon: '🏆', earned: claimed.length > 0 },
    { id: 'km50', name: 'Marathoner', icon: '🥇', earned: km >= 50 },
    { id: 'p1000', name: 'Elite', icon: '👑', earned: pts >= 1000 },
  ]
}

export function getLeaderboard(myPts, user) {
  const list = [...STUDENTS, { id: 'me', name: user.name, dept: user.dept, points: myPts, me: true }]
    .sort((a, b) => b.points - a.points)
    .map((s, i) => ({ ...s, rank: i + 1 }))
  return list
}
export const getRank = (pts, user) => getLeaderboard(pts, user).find((s) => s.me).rank