import { statsByDay, TYPES } from './fitness'
import { dateKey } from './dates'

export const CHALLENGES = [
  { id: 'daily5k', title: '5,000 Steps Daily', type: 'Individual', reward: 50, target: 5000, unit: 'steps', daily: true,
    desc: 'Hit 5,000 steps today. Resets every day, so you can earn it again tomorrow!' },
  { id: 'walk7', title: '7-Day Walking Challenge', type: 'Individual', reward: 150, target: 7, unit: 'days',
    desc: 'Log a walk on 7 different days within the last week.' },
  { id: 'run50', title: 'Campus Run Club: 50 km', type: 'Group', reward: 100, target: 50, unit: 'km', base: 31.5, team: 24,
    desc: '24 students are pooling their running distance. Add your km to help the team reach 50 km!' },
]

export function challengeProgress(c, acts) {
  if (c.id === 'daily5k') {
    const today = statsByDay(acts, 1)[0]
    return Math.min(c.target, today.steps)
  }
  if (c.id === 'walk7') {
    const keys = new Set(statsByDay(acts, 7).map((d) => d.key))
    const walkDays = new Set(acts.filter((a) => a.type === 'walking' && keys.has(a.date)).map((a) => a.date))
    return walkDays.size
  }
  if (c.id === 'run50') {
    const km = acts.filter((a) => a.type === 'running').reduce((s, a) => s + Number(a.distance), 0)
    return Math.min(c.target, +(c.base + km).toFixed(1))
  }
  return 0
}

export const claimKey = (c) => (c.daily ? `${c.id}-${dateKey()}` : c.id)