const links = [
    { href: '#anatomy', label: 'Anatomy' },
    { href: '#formula', label: 'Formula' },
    { href: '#explore', label: 'Explore' },
]

export function Header() {
    return (
        <header className="fixed inset-x-0 top-0 z-30 grid h-[var(--bar)] grid-cols-12 items-center gap-x-[var(--g)] px-[var(--m)] text-[0.85rem] font-semibold">
            <a href="#hero" className="col-span-6 font-extrabold tracking-[-0.02em] md:col-span-3">
                Red Bull
            </a>

            <nav aria-label="Main" className="hidden gap-[clamp(1rem,2.2vw,2rem)] md:col-[7/11] md:flex">
                {links.map((l) => (
                    <a key={l.href} href={l.href} className="link-u">
                        {l.label}
                    </a>
                ))}
            </nav>

            <span className="col-span-6 text-right opacity-70 md:col-[11/-1]">Can Study 2026</span>
        </header>
    )
}