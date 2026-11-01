import { useEffect, useRef } from 'react'
import { clamp, easeOutExpo } from '../lib/math'

const format = (v: number) => Math.round(v).toLocaleString('en-US')

export function Counter({ to }: { to: number }) {
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const el = ref.current!
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
        let raf = 0

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                io.disconnect()
                if (reduce) {
                    el.textContent = format(to)
                    return
                }
                const start = performance.now()
                const tick = (now: number) => {
                    const p = clamp((now - start) / 1600, 0, 1)
                    el.textContent = format(to * easeOutExpo(p))
                    if (p < 1) raf = requestAnimationFrame(tick)
                }
                raf = requestAnimationFrame(tick)
            },
            { threshold: 0.6 },
        )
        io.observe(el)

        return () => {
            io.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [to])

    return <span ref={ref}>0</span>
}