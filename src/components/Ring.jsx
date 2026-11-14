import { useEffect, useState } from 'react'

export default function Ring({
  value,
  size = 150,
  stroke = 14,
  track = 'rgba(255,255,255,.25)',
  color = '#fff',
  children
}) {
  const [v, setV] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setV(Math.min(1, value)), 150)
    return () => clearTimeout(t)
  }, [value])

  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v)}
          style={{ transition: 'stroke-dashoffset 1.3s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <div className="center">{children}</div>
    </div>
  )
}