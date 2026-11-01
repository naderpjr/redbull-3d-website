export const MOBILE_BP = 768

export interface Pose {
    /** horizontal offset, fraction of half the view width (desktop) */
    x: number
    /** vertical offset, fraction of view height (desktop) */
    y: number
    /** vertical offset on mobile */
    my: number
    /** scale */
    s: number
    /** tilt */
    rx: number
    rz: number
    /** spin gained by scrolling to this section */
    ry: number
    /** flat colour field */
    bg: [number, number, number]
    /** text colour that reads on it */
    tone: 'dark' | 'light'
}

export const POSES: Pose[] = [
    { x: 0.4, y: 0.02, my: 0.2, s: 1.05, rx: 0.05, rz: 0.2, ry: 0, bg: [216, 218, 223], tone: 'dark' },
    { x: -0.42, y: 0, my: 0.22, s: 1.15, rx: 0.1, rz: -0.1, ry: Math.PI * 1.5, bg: [20, 36, 143], tone: 'light' },
    { x: 0.42, y: 0, my: 0.22, s: 1, rx: -0.1, rz: 0.3, ry: Math.PI * 3, bg: [219, 10, 64], tone: 'light' },
    { x: 0, y: 0, my: 0.02, s: 1.3, rx: 0, rz: 0, ry: Math.PI * 4.5, bg: [8, 9, 13], tone: 'light' },
    { x: 0, y: 0.14, my: 0.2, s: 0.75, rx: 0.15, rz: -0.18, ry: Math.PI * 6, bg: [216, 218, 223], tone: 'dark' },
]