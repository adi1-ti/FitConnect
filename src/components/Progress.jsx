import { useEffect, useState } from 'react'

export default function Progress({ value, color = 'var(--grad)' }) {
  const [w, setW] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setW(Math.min(1, value) * 100), 80)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div className="progress">
      <div className="progress-bar" style={{ width: w + '%', background: color }} />
    </div>
  )
}