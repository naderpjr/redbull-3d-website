import { useEffect, useRef } from 'react'
import { clamp, easeOutExpo } from '../lib/math'

interface LoaderProps {
    /** the 3D model has finished loading */
    ready: boolean
    /** the curtain has lifted */
    lifted: boolean
    /** the counter reached 100 */
    onDone: () => void
}

export function Loader({ ready, lifted, onDone }: LoaderProps) {
    const countRef = useRef<HTMLSpanElement>(null)
    const readyRef = useRef(ready)
    const doneRef = useRef(onDone)

    useEffect(() => {
        readyRef.current = ready
        doneRef.current = onDone
    })

    useEffect(() => {
        const el = countRef.current!
        const t0 = performance.now()
        let raf = 0
        let timer = 0

        const tick = (now: number) => {
            const p = clamp((now - t0) / 1900, 0, 1)
            let v = 100 * easeOutExpo(p)
            if (!readyRef.current) v = Math.min(v, 92) // wait for the model
            el.textContent = String(Math.round(v)).padStart(3, '0')

            if (v >= 99.5) {
                timer = window.setTimeout(() => doneRef.current(), 250)
                return
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(raf)
            window.clearTimeout(timer)
        }
    }, [])

    return (
        <div
            aria-hidden="true"
            className={`fixed inset-0 z-[100] flex flex-col justify-between bg-signal px-[var(--m)] pt-[1.4rem] text-[#f4f3ee] transition-transform duration-[1100ms] ease-curtain ${lifted ? 'pointer-events-none -translate-y-full' : ''
                }`}
        >
            <div className="flex justify-between text-[0.85rem] font-semibold">
                <span>Red Bull</span>
                <span>Can Study</span>
            </div>
            <div className="overflow-hidden leading-[0.8]">
                <span
                    ref={countRef}
                    className="-mb-[0.06em] block text-[length:clamp(8rem,34vw,40rem)] font-extrabold tracking-[-0.06em]"
                >
                    000
                </span>
            </div>
        </div>
    )
}