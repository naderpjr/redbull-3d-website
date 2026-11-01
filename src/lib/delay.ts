import type { CSSProperties } from 'react'


export const delay = (s: number) => ({ '--d': `${s}s` }) as CSSProperties