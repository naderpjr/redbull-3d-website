import { useEffect } from 'react'


export function useReveal(enabled: boolean) {
    useEffect(() => {
        if (!enabled) return

        let io: IntersectionObserver | undefined
        const id = window.setTimeout(() => {
            io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (!e.isIntersecting) return
                        e.target.classList.add('in')
                        io?.unobserve(e.target)
                    })
                },
                { threshold: 0.15 },
            )
            document.querySelectorAll('[data-reveal]').forEach((el) => io!.observe(el))
        }, 500)

        return () => {
            window.clearTimeout(id)
            io?.disconnect()
        }
    }, [enabled])
}