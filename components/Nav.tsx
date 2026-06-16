import Link from 'next/link';

export function Nav() {
  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="font-black tracking-[.18em] text-gold">
            <span className="md:hidden">Π Κ Φ</span>
            <span className="hidden md:inline">Π Κ Φ | Theta Xi Chapter</span>
          </Link>

          <nav className="hidden gap-6 text-sm text-white/70 md:flex">
            <a href="/#why" className="transition hover:text-gold">
              Why
            </a>
            <a href="/events" className="transition hover:text-gold">
              Events
            </a>
            <a href="/#gallery" className="transition hover:text-gold">
              Gallery
            </a>
            <a href="/login" className="transition hover:text-gold">
              Members
            </a>
          </nav>

          <a
            href="/#apply"
            className="hidden rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink transition hover:scale-105 sm:inline-flex"
          >
            Apply
          </a>
        </div>
      </header>

      <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
        <a
          href="/#apply"
          className="block rounded-2xl bg-gold py-4 text-center font-black text-ink shadow-glow"
        >
          Apply for Rush
        </a>
      </div>
    </>
  );
}