export interface Finish {
    body: number
    bodyMetal: number
    label: number
    labelMetal: number
}

export type FinishName = 'gloss' | 'satin' | 'matte'

export const FINISHES: Record<FinishName, Finish> = {
    gloss: { body: 0.2, bodyMetal: 1, label: 1.8, labelMetal: 0.85 },
    satin: { body: 0.45, bodyMetal: 0.9, label: 3.2, labelMetal: 0.7 },
    matte: { body: 0.82, bodyMetal: 0.55, label: 5, labelMetal: 0.35 },
}