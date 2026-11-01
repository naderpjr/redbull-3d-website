import { useEffect, useRef } from 'react'
import { canScene, type FrameState } from '../three/CanScene'

/** Runs `cb` on every rendered frame. Use refs inside it — never setState every frame. */
export function useSceneFrame(cb: (state: FrameState) => void) {
    const ref = useRef(cb)
    useEffect(() => {
        ref.current = cb
    })

    useEffect(() => canScene.subscribe((s) => ref.current(s)), [])
}