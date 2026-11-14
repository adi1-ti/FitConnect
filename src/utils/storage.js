import { useState, useEffect, useRef } from 'react'

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])

  return [value, setValue]
}

export function useCountUp(value, duration = 900) {
  const [n, setN] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const from = prev.current
    const t0 = performance.now()
    let raf

    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)

      setN(from + (value - from) * eased)

      if (p < 1) raf = requestAnimationFrame(tick)
      else prev.current = value
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return Math.round(n * 10) / 10
}