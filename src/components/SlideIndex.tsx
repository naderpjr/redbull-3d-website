import { useRef, useState } from 'react'
import { useSceneFrame } from '../hooks/useSceneFrame'
import { clamp } from '../lib/math'

const items = [
    { href: '#hero', no: '01', label: 'Intro' },
    { href: '#anatomy', no: '02', label: 'Anatomy' },
    { href: '#formula', no: '03', label: 'Formula' },
    { href: '#explore', no: '04', label: 'Explore' },
    { href: '#credits', no: '05', label: 'Credits' },
]

export function SideIndex() {
    const [active, setActive] = useState(0)
    const fill = useRef<HTMLElement>(null)

    useSceneFrame((s) => {
        setActive(s.active) // React skips re-render when the value is unchanged
        if (fill.current) fill.current.style.height = `${clamp(s.scrollRatio, 0, 1) * 100}%`
    })

    return (
        <nav
            aria-label="Sections"
            className="fixed right-[var(--m)] top-1/2 z-30 hidden -translate-y-1/2 gap-[0.55rem] pr-[0.9rem] text-right text-[0.75rem] font-semibold md:grid"
        >
            {items.map((it, n) => (
                <a
                    key={it.href}
                    href={it.href}
                    className={`flex justify-end gap-[0.6rem] transition-opacity duration-500 ${n === active ? 'opacity-100' : 'opacity-40'}`}
                >
                    {n === active && <span>{it.label}</span>}
                    <b>{it.no}</b>
                </a>
            ))}
            <em className="absolute inset-y-0 right-0 w-px bg-current/25">
                <i ref={fill} className="block w-full bg-current" style={{ height: 0 }} />
            </em>
        </nav>
    )
}