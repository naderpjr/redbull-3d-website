import { useEffect, useRef } from 'react'
import { canScene } from '../three/CanScene'

const MODEL_URL = '/models/can.glb'

export function CanCanvas({ onReady }: { onReady: () => void }) {
    const canvas = useRef<HTMLCanvasElement>(null)
    const readyRef = useRef(onReady)

    useEffect(() => {
        readyRef.current = onReady
    })

    useEffect(() => {
        let alive = true
        const done = () => {
            if (alive) readyRef.current()
        }

        if (!canScene.mount(canvas.current!)) {
            done()
        } else {
            canScene.load(MODEL_URL).catch((err) => console.warn('Could not load the model.', err)).finally(done)
        }

        return () => {
            alive = false
            canScene.unmount()
        }
    }, [])

    return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[2] h-full w-full" />
}