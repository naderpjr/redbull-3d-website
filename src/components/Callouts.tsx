import { useRef } from 'react'
import { useSceneFrame } from '../hooks/useSceneFrame'
import { clamp } from '../lib/math'
import { MOBILE_BP } from '../data/poses'

const items = [
    { label: 'Pull tab', y: 0.98, r: 0.42 },
    { label: 'Printed wrap', y: 0.05, r: 0.82 },
    { label: 'Aluminium base', y: -1.02, r: 0.55 },
]

export function Callouts() {
    const els = useRef<(HTMLDivElement | null)[]>([])
    const lines = useRef<(HTMLElement | null)[]>([])

    useSceneFrame((s) => {
        const visible = innerWidth >= MOBILE_BP && s.anatomyWeight > 0.01
        items.forEach((it, n) => {
            const el = els.current[n]
            if (!el) return
            if (!visible) {
                el.style.opacity = '0'
                return
            }
            const p = s.project(it.y, it.r)
            el.style.transform = `translate(${p.x}px, ${p.y}px) translateY(-50%)`
            el.style.opacity = String(s.anatomyWeight * s.anatomyWeight)
            const line = lines.current[n]
            if (line) line.style.transform = `scaleX(${clamp(s.anatomyWeight * 1.4 - 0.3, 0, 1)})`
        })
    })

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[3]">
            {items.map((it, n) => (
                <div
                    key={it.label}
                    ref={(el) => { els.current[n] = el }}
                    className="absolute left-0 top-0 flex items-center gap-[0.7rem] whitespace-nowrap text-[0.85rem] font-semibold opacity-0 will-change-transform"
                >
                    <span className="-mr-[0.7rem] size-[7px] -translate-x-[3px] rounded-full bg-sun" />
                    <i
                        ref={(el) => { lines.current[n] = el }}
                        className="block h-px w-[clamp(48px,9vw,150px)] origin-left bg-current"
                    />
                    <span>{it.label}</span>
                </div>
            ))}
        </div>
    )
}