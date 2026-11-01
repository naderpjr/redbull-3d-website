import { useRef, useState } from 'react'
import { Line } from '../components/Line'
import { SecHead } from '../components/secHead'
import { useSceneFrame } from '../hooks/useSceneFrame'
import { delay } from '../lib/delay'
import { canScene } from '../three/CanScene'
import type { FinishName } from '../data/finishes'

const finishes: { id: FinishName; label: string }[] = [
    { id: 'gloss', label: 'Gloss' },
    { id: 'satin', label: 'Satin' },
    { id: 'matte', label: 'Matte' },
]

export function Explore() {
    const [finish, setFinish] = useState<FinishName>('gloss')
    const [spin, setSpin] = useState(true)
    const angle = useRef<HTMLElement>(null)
    const last = useRef(-1)

    // live rotation readout — written straight to the DOM
    useSceneFrame((s) => {
        if (s.angle === last.current || !angle.current) return
        last.current = s.angle
        angle.current.textContent = `${String(s.angle).padStart(3, '0')}°`
    })

    const pickFinish = (id: FinishName) => {
        setFinish(id)
        canScene.setFinish(id)
    }

    const toggleSpin = () => {
        const next = !spin
        setSpin(next)
        canScene.setSpin(next)
    }

    return (
        <section id="explore" className="grid-12 grid-rows-[auto_1fr_auto]">
            <SecHead no="04" label="Explore" />

            <div className="relative z-[3] col-span-full row-start-2 mt-10 grid content-start gap-[1.3rem] md:col-[1/6]">
                <h2 className="h2">
                    <Line>Turn it over.</Line>
                </h2>
                <p data-reveal style={delay(0.15)} className="lead">
                    Drag to rotate. Change the finish and watch the light respond.
                </p>
            </div>

            <div className="orbit hidden md:block" aria-hidden="true" />

            <div
                data-reveal
                style={delay(0.2)}
                className="relative z-[3] col-span-full row-start-3 flex flex-wrap items-end justify-between gap-6 max-md:flex-col max-md:items-start"
            >
                <div className="grid gap-[0.3rem]">
                    <small className="label">Rotation</small>
                    <b
                        ref={angle}
                        className="text-[length:clamp(2.6rem,5vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.05em] tabular-nums"
                    >
                        000°
                    </b>
                </div>

                <div className="flex flex-wrap items-center gap-6">
                    <div role="group" aria-label="Finish" className="flex rounded-full border border-current/40 p-[3px]">
                        {finishes.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => pickFinish(f.id)}
                                className={`rounded-full px-[1.1rem] py-[0.55rem] text-[0.85rem] font-semibold transition-colors duration-300 ${finish === f.id ? 'bg-[var(--ink)] text-[var(--bg)]' : ''
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        aria-pressed={spin}
                        onClick={toggleSpin}
                        className="inline-flex gap-[0.6rem] border-b border-current py-[0.55rem] text-[0.85rem] font-semibold"
                    >
                        Auto-rotate <i className="not-italic opacity-70">{spin ? 'On' : 'Off'}</i>
                    </button>
                </div>
            </div>
        </section>
    )
}