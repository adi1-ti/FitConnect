const COLORS = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#f97316,#ec4899)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
]

export default function Avatar({ name, idx = 0, me }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div
      className="avatar"
      style={{ background: me ? 'var(--grad)' : COLORS[idx % COLORS.length] }}
    >
      {initials}
    </div>
  )
}