import { Line } from '../components/Line'
import { SecHead } from '../components/secHead'
import { delay } from '../lib/delay'

export function Anatomy() {
    return (
        <section id="anatomy" className="grid-12 grid-rows-[auto_1fr]">
            <SecHead no="02" label="Anatomy" />

            <div className="col-span-full row-start-2 grid content-end gap-[1.6rem] pt-8 md:col-[8/-2] md:content-center">
                <h2 className="h2">
                    <Line>One body.</Line>
                    <Line at={0.08}>Three details.</Line>
                </h2>
                <p data-reveal style={delay(0.2)} className="lead">
                    A seamless aluminium shell, a printed wrap and a pull tab. Each surface answers the same light in a different way.
                </p>
            </div>
        </section>
    )
}