import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clamp, lerp, smooth, easeOutExpo } from '../lib/math'
import { makeEnvironment } from '../lib/makeEnvironment'
import { POSES, MOBILE_BP } from '../data/poses'
import { FINISHES, type Finish, type FinishName } from '../data/finishes'

const FOV = 30
const DIST = 7
const CAN_HEIGHT = 2.2

export interface FrameState {
    /** index of the section the can currently belongs to */
    active: number
    /** 0–1 position in the whole page */
    scrollRatio: number
    /** 0–1, strongest while the Anatomy section is in place */
    anatomyWeight: number
    /** current rotation in degrees (0–359) */
    angle: number
    /** projects a point on the can (its own units) to screen pixels */
    project: (y: number, radius: number) => { x: number; y: number }
}

type Listener = (state: FrameState) => void

type Pose = {
    x: number; y: number; s: number; rx: number; rz: number; ry: number
}

/**
 * Everything 3D lives here, outside React.
 * React only mounts/unmounts it and subscribes to per-frame state.
 */
export class CanScene {
    private listeners = new Set<Listener>()
    private teardown: (() => void) | null = null
    private attach: ((root: THREE.Object3D) => void) | null = null
    private generation = 0
    private introStart: number | null = null
    private spinOn = true
    private finishTarget: Finish = { ...FINISHES.gloss }

    subscribe(fn: Listener) {
        this.listeners.add(fn)
        return () => {
            this.listeners.delete(fn)
        }
    }

    startIntro() {
        this.introStart = performance.now() + 250
    }

    setSpin(on: boolean) {
        this.spinOn = on
    }

    setFinish(name: FinishName) {
        this.finishTarget = { ...FINISHES[name] }
    }

    async load(url: string) {
        const generation = this.generation
        const gltf = await new GLTFLoader().loadAsync(url)
        if (generation !== this.generation) return // unmounted while loading (StrictMode)
        this.attach?.(gltf.scene)
    }

    unmount() {
        this.teardown?.()
        this.teardown = null
        this.attach = null
        this.introStart = null
        this.generation++
    }

    mount(canvas: HTMLCanvasElement): boolean {
        this.unmount()

        const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
        const idleSpin = reduceMotion ? 0 : 0.5 // rad/s
        const introMs = reduceMotion ? 1 : 2600

        let renderer: THREE.WebGLRenderer
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
        } catch (err) {
            console.warn('WebGL is not available.', err)
            return false
        }

        renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.05

        const scene = new THREE.Scene()
        const envTexture = makeEnvironment(renderer)
        scene.environment = envTexture

        const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50)
        camera.position.set(0, 0, DIST)

        const key = new THREE.DirectionalLight(0xffffff, 3)
        key.position.set(3, 4, 5)
        const rim = new THREE.DirectionalLight(0xffffff, 3.5)
        rim.position.set(-4, 2, -3)
        scene.add(key, rim)

        const pivot = new THREE.Group()
        pivot.rotation.order = 'ZXY' // spin around the can's own axis, then tilt
        pivot.visible = false
        scene.add(pivot)

        let bodyMat: THREE.MeshStandardMaterial | null = null
        let labelMat: THREE.MeshStandardMaterial | null = null

        const body = document.body
        const sections = [...document.querySelectorAll<HTMLElement>('main > section')]

        /* ---------- layout & scroll ---------- */
        let anchors: number[] = []
        const measure = () => {
            anchors = sections.map((s) => s.offsetTop)
        }

        const resize = () => {
            renderer.setSize(innerWidth, innerHeight, false)
            camera.aspect = innerWidth / innerHeight
            camera.updateProjectionMatrix()
            measure()
        }

        const scrollProgress = () => {
            const y = scrollY
            let i = anchors.length - 2
            for (let k = 0; k < anchors.length - 1; k++) {
                if (y < anchors[k + 1]) {
                    i = k
                    break
                }
            }
            const span = anchors[i + 1] - anchors[i] || 1
            const raw = clamp((y - anchors[i]) / span, 0, 1)
            return { i, f: smooth(raw), raw }
        }

        const targetPose = () => {
            const { i, f, raw } = scrollProgress()
            const a = POSES[i]
            const b = POSES[i + 1]
            const mobile = innerWidth < MOBILE_BP
            const field = smooth(clamp((raw - 0.25) / 0.5, 0, 1)) // colour moves through the middle
            return {
                i,
                f,
                x: mobile ? 0 : lerp(a.x, b.x, f),
                y: mobile ? lerp(a.my, b.my, f) : lerp(a.y, b.y, f),
                s: lerp(a.s, b.s, f) * (mobile ? 0.72 : 1),
                rx: lerp(a.rx, b.rx, f),
                rz: lerp(a.rz, b.rz, f),
                ry: lerp(a.ry, b.ry, f),
                bg: a.bg.map((v, n) => lerp(v, b.bg[n], field)),
                tone: raw < 0.5 ? a.tone : b.tone,
            }
        }

        /* ---------- interaction ---------- */
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
        let dragging = false
        let lastX = 0
        let lastT = 0
        let userRy = 0
        let vel = 0

        const ac = new AbortController()
        const { signal } = ac

        addEventListener('pointerdown', (e) => {
            if ((e.target as HTMLElement).closest('a, button, header, nav')) return
            dragging = true
            lastX = e.clientX
            lastT = e.timeStamp
            vel = 0
        }, { signal })

        addEventListener('pointermove', (e) => {
            mouse.tx = (e.clientX / innerWidth) * 2 - 1
            mouse.ty = (e.clientY / innerHeight) * 2 - 1
            if (!dragging) return
            const dx = e.clientX - lastX
            const dt = Math.max(e.timeStamp - lastT, 8) / 1000
            userRy += dx * 0.012
            vel = clamp(lerp(vel, (dx * 0.012) / dt, 0.4), -14, 14)
            lastX = e.clientX
            lastT = e.timeStamp
        }, { signal })

        const stopDrag = () => {
            dragging = false
        }
        addEventListener('pointerup', stopDrag, { signal })
        addEventListener('pointercancel', stopDrag, { signal })
        addEventListener('blur', stopDrag, { signal })
        addEventListener('resize', resize, { signal })
        addEventListener('load', measure, { signal })
        document.fonts?.ready.then(measure)

        /* ---------- state ---------- */
        const cur: Pose = { x: 0, y: 0, s: 1, rx: 0, rz: 0, ry: 0 }
        const field: number[] = [...POSES[0].bg]
        const finishCurrent: Finish = { ...FINISHES.gloss }
        const halfH = Math.tan((FOV * Math.PI) / 360) * DIST
        const tmp = new THREE.Vector3()

        const project = (y: number, radius: number) => {
            tmp.set(0, y, 0)
            pivot.localToWorld(tmp)
            tmp.x += radius * cur.s
            tmp.project(camera)
            return { x: (tmp.x * 0.5 + 0.5) * innerWidth, y: (-tmp.y * 0.5 + 0.5) * innerHeight }
        }

        /* ---------- model ---------- */
        this.attach = (root) => {
            // centre the can and scale it to a known height
            const box = new THREE.Box3().setFromObject(root)
            const size = box.getSize(new THREE.Vector3())
            const center = box.getCenter(new THREE.Vector3())
            root.position.sub(center)

            const holder = new THREE.Group()
            holder.add(root)
            holder.scale.setScalar(CAN_HEIGHT / size.y)
            pivot.add(holder)

            root.traverse((o) => {
                const mesh = o as THREE.Mesh
                if (!mesh.isMesh) return
                const mat = mesh.material as THREE.MeshStandardMaterial
                mat.envMapIntensity = 1.25
                if (mat.name === 'Label') labelMat = mat
                else bodyMat = mat
            })
            bodyMat ??= labelMat
            labelMat ??= bodyMat

            resize()
            // begin from the first pose so nothing jumps
            Object.assign(cur, targetPose())
        }

        /* ---------- render loop ---------- */
        let last = performance.now()
        let raf = 0

        const frame = (now: number) => {
            const dt = Math.min((now - last) / 1000, 0.05)
            last = now

            const t = targetPose()
            const k = 1 - Math.exp(-dt * (reduceMotion ? 20 : 5))
            cur.x = lerp(cur.x, t.x, k)
            cur.y = lerp(cur.y, t.y, k)
            cur.s = lerp(cur.s, t.s, k)
            cur.rx = lerp(cur.rx, t.rx, k)
            cur.rz = lerp(cur.rz, t.rz, k)
            cur.ry = lerp(cur.ry, t.ry, k)

            // flat colour field + text tone
            field.forEach((v, n) => {
                field[n] = lerp(v, t.bg[n], 1 - Math.exp(-dt * 10))
            })
            body.style.setProperty('--bg', `rgb(${field.map(Math.round).join(',')})`)
            if (body.dataset.tone !== t.tone) body.dataset.tone = t.tone

            // surface finish easing
            const kf = 1 - Math.exp(-dt * 6)
                ; (Object.keys(finishCurrent) as (keyof Finish)[]).forEach((p) => {
                    finishCurrent[p] = lerp(finishCurrent[p], this.finishTarget[p], kf)
                })
            if (bodyMat && labelMat) {
                bodyMat.roughness = finishCurrent.body
                bodyMat.metalness = finishCurrent.bodyMetal
                labelMat.roughness = finishCurrent.label
                labelMat.metalness = finishCurrent.labelMetal
            }

            // spin: inertia after release, easing back to the idle speed
            if (!dragging) vel = lerp(vel, this.spinOn ? idleSpin : 0, 1 - Math.exp(-dt * 1.5))
            userRy += vel * dt

            mouse.x = lerp(mouse.x, mouse.tx, 0.06)
            mouse.y = lerp(mouse.y, mouse.ty, 0.06)

            // intro: the can rises and spins into place
            const p = this.introStart === null ? 0 : clamp((now - this.introStart) / introMs, 0, 1)
            const e = easeOutExpo(p)
            pivot.visible = this.introStart !== null

            const halfW = halfH * camera.aspect
            const bob = reduceMotion ? 0 : Math.sin(now / 900) * 0.05
            const spin = cur.ry + userRy + (1 - e) * Math.PI * 4
            pivot.position.set(cur.x * halfW * 0.9, cur.y * halfH * 2 + bob - (1 - e) * halfH * 1.4, 0)
            pivot.scale.setScalar(cur.s * (0.6 + 0.4 * e))
            pivot.rotation.set(cur.rx + mouse.y * 0.15, spin + mouse.x * 0.2, cur.rz)
            pivot.updateMatrixWorld()

            renderer.render(scene, camera)

            if (this.listeners.size) {
                const turn = Math.PI * 2
                const angle = Math.round((((cur.ry + userRy) % turn) + turn) % turn * (180 / Math.PI)) % 360
                const max = document.documentElement.scrollHeight - innerHeight
                const state: FrameState = {
                    active: t.i + (t.f > 0.5 ? 1 : 0),
                    scrollRatio: max > 0 ? scrollY / max : 0,
                    anatomyWeight: t.i === 0 ? t.f : t.i === 1 ? 1 - t.f : 0,
                    angle,
                    project,
                }
                this.listeners.forEach((fn) => fn(state))
            }

            raf = requestAnimationFrame(frame)
        }

        resize()
        raf = requestAnimationFrame(frame)

        this.teardown = () => {
            cancelAnimationFrame(raf)
            ac.abort()
            pivot.traverse((o) => {
                const mesh = o as THREE.Mesh
                if (!mesh.isMesh) return
                mesh.geometry.dispose()
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
                mats.forEach((m) => {
                    Object.values(m).forEach((v) => {
                        if (v instanceof THREE.Texture) v.dispose()
                    })
                    m.dispose()
                })
            })
            envTexture.dispose()
            renderer.dispose()
        }

        return true
    }
}

/** One scene for the whole page. */
export const canScene = new CanScene()