import { useRef } from 'react'
import { Line } from '../components/Line'
import { useSceneFrame } from '../hooks/useSceneFrame'
import { delay } from '../lib/delay'

export function Hero() {
    const title = useRef<HTMLHeadingElement>(null)

    // slow parallax on the headline
    useSceneFrame(() => {
        if (title.current && scrollY < innerHeight * 1.3) {
            title.current.style.transform = `translateY(${scrollY * 0.16}px)`
        }
    })

    return (
        <section id="hero" className="grid-12 grid-rows-[auto_1fr_auto]">
            <p
                data-reveal
                style={delay(0.9)}
                className="lead col-span-full row-start-1 mt-4 md:col-[1/5] md:mt-[3.2rem]"
            >
                An interactive study of one object: a 250&nbsp;ml aluminium can, lit and rotated in real time.
            </p>

            <h1
                ref={title}
                className="relative z-[1] col-span-full row-start-2 -ml-[0.04em] self-end text-[31vw] font-extrabold leading-[0.82] tracking-[-0.065em] will-change-transform md:text-[19.5vw] md:leading-[0.8]"
            >
                <Line at={0.75} className="md:mr-[0.2em] md:inline-block md:pt-[0.06em]">Red</Line>
                <Line at={0.85} className="md:inline-block md:pt-[0.06em]">Bull</Line>
            </h1>

            <dl className="col-span-full row-start-3 mt-[1.4rem] grid grid-cols-12 gap-x-[var(--g)]">
                <div data-reveal style={delay(1)} className="rule-t col-span-4 pt-[0.7rem] md:col-span-3">
                    <dt className="label">Format</dt>
                    <dd className="mt-[0.2rem] text-[0.8rem] font-semibold md:text-base">250 ml</dd>
                </div>
                <div data-reveal style={delay(1.08)} className="rule-t col-span-4 pt-[0.7rem] md:col-span-3">
                    <dt className="label">Material</dt>
                    <dd className="mt-[0.2rem] text-[0.8rem] font-semibold md:text-base">Aluminium</dd>
                </div>
                <div data-reveal style={delay(1.16)} className="rule-t col-span-4 pt-[0.7rem] md:col-span-3">
                    <dt className="label">Rendering</dt>
                    <dd className="mt-[0.2rem] text-[0.8rem] font-semibold md:text-base">Real-time WebGL</dd>
                </div>
                <div data-reveal style={delay(1.24)} className="rule-t hidden pt-[0.7rem] md:col-[10/-1] md:block">
                    <dt className="label">Scroll</dt>
                    <dd className="mt-[0.2rem] h-[1.3rem]">
                        <i className="block h-full w-px animate-cue bg-current" />
                    </dd>
                </div>
            </dl>
        </section>
    )
}