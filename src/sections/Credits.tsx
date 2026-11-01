import { SecHead } from '../components/secHead'
import { delay } from '../lib/delay'

const credits = [
    { term: 'Design and development', value: 'Your Name', at: 0 },
    { term: '3D model', value: 'Aluminium can, GLB', at: 0.08 },
    { term: 'Built with', value: 'React, Three.js, Tailwind CSS', at: 0.16 },
]

export function Credits() {
    return (
        <section id="credits" className="grid-12 grid-rows-[auto_auto_auto_1fr] overflow-hidden md:grid-rows-[auto_auto_1fr]">
            <SecHead no="05" label="Credits" />

            <dl className="col-span-full row-start-2 mt-8 grid md:col-[1/8]">
                {credits.map((c) => (
                    <div key={c.term} data-reveal style={delay(c.at)} className="rule-b flex justify-between gap-4 py-[0.8rem]">
                        <dt className="label">{c.term}</dt>
                        <dd className="text-right font-semibold">{c.value}</dd>
                    </div>
                ))}
            </dl>

            <a
                href="#hero"
                data-reveal
                style={delay(0.2)}
                className="col-span-full row-start-3 mt-8 inline-flex gap-[0.6rem] justify-self-start border-b border-current pb-[0.3rem] text-[0.9rem] font-semibold md:col-[10/-1] md:row-start-2 md:justify-self-end"
            >
                Back to top <span aria-hidden="true">↑</span>
            </a>

            <div
                aria-hidden="true"
                className="absolute bottom-0 left-[var(--m)] z-[1] -mb-[0.1em] whitespace-nowrap text-[29vw] font-extrabold leading-[0.74] tracking-[-0.065em]"
            >
                Red Bull
            </div>
        </section>
    )
}