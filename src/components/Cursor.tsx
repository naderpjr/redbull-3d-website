import { useEffect, useRef } from 'react'
import { lerp } from '../lib/math'

export function Cursor() {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return

        const el = ref.current!
        let x = innerWidth / 2
        let y = innerHeight / 2
        let tx = x
        let ty = y
        let raf = 0
        const ac = new AbortController()
        const { signal } = ac

        document.documentElement.classList.add('has-cursor')

        addEventListener('pointermove', (e) => {
            tx = e.clientX
            ty = e.clientY
            el.classList.add('is-on')
            el.classList.toggle('is-hidden', Boolean((e.target as HTMLElement).closest('a, button, header, nav')))
        }, { signal })
        addEventListener('pointerdown', () => el.classList.add('is-down'), { signal })
        addEventListener('pointerup', () => el.classList.remove('is-down'), { signal })

        const loop = () => {
            x = lerp(x, tx, 0.18)
            y = lerp(y, ty, 0.18)
            el.style.transform = `translate(${x}px, ${y}px)`
            raf = requestAnimationFrame(loop)
        }
        loop()

        return () => {
            ac.abort()
            cancelAnimationFrame(raf)
            document.documentElement.classList.remove('has-cursor')
        }
    }, [])

    return (
        <div ref={ref} className="cursor" aria-hidden="true">
            <span>Drag</span>
        </div>
    )
}