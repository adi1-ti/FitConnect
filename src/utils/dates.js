export const dateKey = (d = new Date()) => {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

export const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

export const lastDays = (n) => Array.from({ length: n }, (_, i) => daysAgo(n - 1 - i))