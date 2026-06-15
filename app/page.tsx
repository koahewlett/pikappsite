import { Nav } from '@/components/Nav';
import { ApplicationForm } from '@/components/ApplicationForm';
import { Countdown } from '@/components/Countdown';
import { RoseDivider } from '@/components/RoseDivider';
import { stats, why, gallery, faqs } from '@/lib/data';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink bg-rose-grid rose">
      <Nav />

      <section className="relative isolate flex min-h-screen items-center overflow-hidden px-6 pt-24">
        {/* Star and shield background */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/star-and-shield-png.svg')] bg-[length:90%] bg-no-repeat opacity-70 [background-position:right_-6rem_center] [filter:contrast(1.25)_brightness(1.12)]" />

        {/* Subtle gold glow to make the stars feel intentional */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_72%_45%,rgba(212,175,55,.16),transparent_34%)]" />

        {/* Dark overlay for readability */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,#0F0F0F_0%,rgba(15,15,15,.92)_34%,rgba(15,15,15,.62)_58%,rgba(15,15,15,.30)_100%)]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[.4em] text-gold">Pi Kappa Phi · Arizona State</p>
          <h1 className="max-w-4xl text-6xl font-black tracking-tight md:text-8xl">Rush Pi Kapp</h1>
          <p className="mt-6 max-w-2xl text-xl text-white/70 md:text-2xl">Exceptional leaders. Uncommon opportunities.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#apply" className="rounded-full bg-gold px-7 py-4 font-black text-ink">Apply for Rush</a>
            <a href="#why" className="rounded-full border border-white/15 px-7 py-4 font-bold">Learn More</a>
          </div>
          <div className="mt-8"><Countdown /></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-4">
        {stats.map(([n, l]) => (
          <div className="glass rounded-3xl p-6" key={l}>
            <div className="text-4xl font-black text-gold">{n}</div>
            <div className="mt-2 text-white/60">{l}</div>
          </div>
        ))}
      </section>

      <RoseDivider />

      <section id="why" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-4xl font-black md:text-6xl">Why Pi Kappa Phi</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {why.map(([t, d]) => (
            <div className="glass rounded-[2rem] p-6 transition hover:-translate-y-2" key={t}>
              <h3 className="text-xl font-black text-gold">{t}</h3>
              <p className="mt-4 text-white/65">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16">
        <ApplicationForm />
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-4xl font-black">Gallery</h2>
        <div className="masonry mt-8">{gallery.map((g,i)=><div key={g} className="glass group h-56 overflow-hidden rounded-[2rem] p-6 transition hover:scale-[1.02] md:h-72"><div className="flex h-full items-end rounded-3xl bg-gradient-to-br from-gold/20 to-royal/20 p-5"><h3 className="text-2xl font-black">{g}</h3></div></div>)}</div>
      </section>

      <section id="alumni" className="mx-auto max-w-7xl px-6 py-16">
        <div className="glass rounded-[2rem] p-8">
          <h2 className="text-4xl font-black">Alumni Network</h2>
          <p className="mt-4 max-w-2xl text-white/65">Interactive alumni location map placeholder for entrepreneurs, executives, athletes, and graduate students. Connect a map provider or Supabase alumni table to make this live.</p>
          <div className="mt-8 grid gap-3 md:grid-cols-4">{['Entrepreneurs','Executives','Athletes','Graduate Students'].map(x=><div className="rounded-2xl bg-white/5 p-4 text-gold" key={x}>{x}</div>)}</div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-4xl px-6 py-16 pb-32">
        <h2 className="text-4xl font-black">FAQ</h2>
        {faqs.map(([q,a])=><details key={q} className="mt-4 rounded-3xl bg-white/5 p-5"><summary className="cursor-pointer font-bold text-gold">{q}</summary><p className="mt-3 text-white/65">{a}</p></details>)}
      </section>
    </main>
  );
}