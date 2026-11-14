import { useCountUp } from '../utils/storage'

export default function StatCard({
  icon: Icon,
  label,
  value,
  suffix = '',
  color,
  bg,
  delay = 0,
  className = ''
}) {
  const n = useCountUp(value)

  return (
    <div className="card hover stat fade-up" style={{ '--i': delay }}>
      <div className="stat-ico" style={{ background: bg, color }}>
        <Icon size={22} className={className} />
      </div>
      <b>{Number.isInteger(value) ? Math.round(n).toLocaleString() : n}{suffix}</b>
      <small>{label}</small>
    </div>
  )
}