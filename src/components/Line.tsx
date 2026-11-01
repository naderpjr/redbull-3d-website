import type { ReactNode } from 'react'
import { delay } from '../lib/delay'

interface LineProps {
    children: ReactNode
    at?: number
    className?: string
}


export function Line({ children, at = 0, className = '' }: LineProps) {
    return (
        <span className={`line ${className}`}>
            <span data-reveal style={delay(at)}>{children}</span>
        </span>
    )
}