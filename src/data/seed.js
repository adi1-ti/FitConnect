import { dateKey, daysAgo } from '../utils/dates'

export const STUDENTS = [
  { id: 's1', name: 'Aarav Sharma', dept: 'CSE', points: 1240 },
  { id: 's2', name: 'Ishita Das', dept: 'ECE', points: 1105 },
  { id: 's3', name: 'Rohan Borah', dept: 'ME', points: 980 },
  { id: 's4', name: 'Meera Gogoi', dept: 'CSE', points: 870 },
  { id: 's5', name: 'Kabir Singh', dept: 'EE', points: 790 },
  { id: 's6', name: 'Ananya Bora', dept: 'CE', points: 720 },
  { id: 's7', name: 'Dev Choudhury', dept: 'ECE', points: 655 },
  { id: 's8', name: 'Priya Nath', dept: 'IT', points: 590 },
  { id: 's9', name: 'Arjun Kalita', dept: 'ME', points: 520 },
  { id: 's10', name: 'Sneha Saikia', dept: 'CSE', points: 470 },
  { id: 's11', name: 'Rahul Deka', dept: 'CE', points: 410 },
  { id: 's12', name: 'Tanvi Hazarika', dept: 'IT', points: 350 },
  { id: 's13', name: 'Nikhil Barman', dept: 'EE', points: 290 },
  { id: 's14', name: 'Zoya Ahmed', dept: 'CSE', points: 210 },
]

// 6 days of past activity so charts/streak look alive. Today is empty so you can demo logging a run.
export function demoActivities() {
  const plan = [
    [6, 'walking', 35, 2.6, 44, 3380], [5, 'running', 25, 3.8, 96, 4560],
    [4, 'walking', 45, 3.2, 55, 4160], [3, 'cycling', 40, 10, 76, 0],
    [2, 'running', 30, 4.5, 114, 5400], [1, 'walking', 50, 3.9, 64, 5070],
  ]
  return plan.map(([ago, type, duration, distance, points, steps], i) => ({
    id: 1000 + i, type, duration, distance, points, steps, date: dateKey(daysAgo(ago)),
  }))
}

export function getEvents() {
  const mk = (id, plus, title, place, time, going) => {
    const d = daysAgo(-plus)
    return {
      id, title, place, time, going,
      day: d.getDate(), month: d.toLocaleDateString('en-US', { month: 'short' }),
    }
  }
  return [
    mk('e1', 1, 'Campus 5K Fun Run', 'Main Ground', '6:30 AM', 86),
    mk('e2', 2, 'Sunrise Yoga & Stretch', 'Library Lawn', '6:00 AM', 41),
    mk('e3', 4, 'Inter-Hostel Football', 'Sports Complex', '4:30 PM', 120),
    mk('e4', 6, 'Cycling Club Weekend Ride', 'Gate 2', '7:00 AM', 33),
  ]
}