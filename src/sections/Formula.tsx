import { Counter } from '../components/Counter'
import { Line } from '../components/Line'
import { SecHead } from '../components/secHead'
import { delay } from '../lib/delay'

const metrics = [
    { value: 80, unit: 'mg', name: 'Caffeine', at: 0.05 },
    { value: 1000, unit: 'mg', name: 'Taurine', at: 0.15 },
    { value: 4, unit: '', name: 'B-vitamins', at: 0.25 },
]

export function Formula() {
    return (
        <section id="formula" className="grid-12 grid-rows-[auto_1fr_auto_auto] md:grid-rows-[auto_auto_1fr]">
            <SecHead no="03" label="Formula" />

            <h2 className="h2 col-span-full row-start-3 self-end md:col-[1/8] md:row-start-2 md:mt-10 md:text-[length:clamp(2.4rem,5vw,5rem)]">
                <Line>Per 250 ml</Line>
            </h2>

            <ol className="col-span-full row-start-4 mt-[1.2rem] self-end md:col-[1/8] md:row-start-3 md:mt-8">
                {metrics.map((m) => (
                    <li
                        key={m.name}
                        data-reveal
                        style={delay(m.at)}
                        className="flex items-baseline justify-between border-t border-current/35 pb-[0.2rem] pt-[0.6rem]"
                    >
                        <span className="flex items-baseline gap-2 leading-[0.82]">
                            <b className="text-[length:clamp(3.4rem,15vw,6rem)] font-extrabold tracking-[-0.06em] tabular-nums md:text-[length:clamp(5rem,19vh,12rem)]">
                                <Counter to={m.value} />
                            </b>
                            {m.unit && (
                                <i className="text-[length:clamp(1.2rem,2.4vw,2.2rem)] font-semibold not-italic">{m.unit}</i>
                            )}
                        </span>
                        <span className="text-[length:clamp(1rem,1.5vw,1.4rem)] font-semibold">{m.name}</span>
                    </li>
                ))}
            </ol>
        </section>
    )
}