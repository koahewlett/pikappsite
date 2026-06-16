import { Nav } from '@/components/Nav';
import { ApplicationForm } from '@/components/ApplicationForm';
import { Countdown } from '@/components/Countdown';
import { RoseDivider } from '@/components/RoseDivider';
import { stats, why, gallery, faqs } from '@/lib/data';

const SHOW_ALUMNI = false;

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink bg-rose-grid rose">
      <Nav />

<section className="relative isolate flex min-h-[92svh] items-center overflow-hidden px-5 pb-12 pt-36 md:min-h-screen md:px-6 md:pt-24">        {/* Star and shield background */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/star-and-shield-png.svg')] bg-[length:155%] bg-no-repeat opacity-30 [background-position:center_top_5rem] [filter:contrast(1.25)_brightness(1.12)] md:bg-[length:90%] md:opacity-70 md:[background-position:right_-6rem_center]" />

        {/* Subtle gold glow */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_72%_45%,rgba(212,175,55,.16),transparent_34%)]" />

        {/* Dark overlay for readability */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,#0F0F0F_0%,rgba(15,15,15,.94)_38%,rgba(15,15,15,.72)_65%,rgba(15,15,15,.45)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.28em] text-gold sm:text-sm md:tracking-[.4em]">
            Pi Kappa Phi · Theta Xi · Arizona State
          </p>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-8xl">
            Rush Pi Kapp
          </h1>

          <p className="mt-5 max-w-xl text-lg text-white/70 sm:text-xl md:mt-6 md:max-w-2xl md:text-2xl">
            Exceptional leaders. Uncommon opportunities.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#apply"
              className="w-full rounded-full bg-gold px-7 py-4 text-center font-black text-ink sm:w-auto"
            >
              Apply for Rush
            </a>

            <a
              href="#why"
              className="w-full rounded-full border border-white/15 px-7 py-4 text-center font-bold sm:w-auto"
            >
              Learn More
            </a>
          </div>

          <div className="mt-8 max-w-full">
            <Countdown />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-5 py-10 md:grid-cols-4 md:gap-4 md:px-6 md:py-16">
        {stats.map(([n, l]) => (
          <div className="glass rounded-3xl p-5 md:p-6" key={l}>
            <div className="text-3xl font-black text-gold md:text-4xl">{n}</div>
            <div className="mt-2 text-sm text-white/60 md:text-base">{l}</div>
          </div>
        ))}
      </section>

      <RoseDivider />

      <section id="why" className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-16">
        <h2 className="text-4xl font-black md:text-6xl">Why Pi Kappa Phi</h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-5">
          {why.map(([t, d]) => (
            <div
              className="glass rounded-[2rem] p-6 transition hover:-translate-y-2"
              key={t}
            >
              <h3 className="text-xl font-black text-gold">{t}</h3>
              <p className="mt-4 text-white/65">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="apply" className="px-5 py-10 md:px-6 md:py-16">
        <ApplicationForm />
      </section>

<section id="gallery" className="mx-auto hidden max-w-7xl px-6 py-16 md:block">
          <h2 className="text-4xl font-black">Gallery</h2>

        <div className="masonry mt-8">
          {gallery.map((g) => (
            <div
              key={g}
              className="glass group h-44 overflow-hidden rounded-[2rem] p-4 transition hover:scale-[1.02] sm:h-56 md:h-72 md:p-6"
            >
              <div className="flex h-full items-end rounded-3xl bg-gradient-to-br from-gold/20 to-royal/20 p-5">
                <h3 className="text-2xl font-black">{g}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {SHOW_ALUMNI && (
        <section id="alumni" className="mx-auto max-w-7xl px-5 py-10 md:px-6 md:py-16">
          <div className="glass rounded-[2rem] p-8">
            <h2 className="text-4xl font-black">Alumni Network</h2>

            <p className="mt-4 max-w-2xl text-white/65">
              Interactive alumni location map placeholder for entrepreneurs, executives,
              athletes, and graduate students. Connect a map provider or Supabase alumni
              table to make this live.
            </p>

            <div className="mt-8 grid gap-3 md:grid-cols-4">
              {['Entrepreneurs', 'Executives', 'Athletes', 'Graduate Students'].map((x) => (
                <div className="rounded-2xl bg-white/5 p-4 text-gold" key={x}>
                  {x}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="faq" className="mx-auto max-w-4xl px-5 py-10 pb-32 md:px-6 md:py-16">
        <h2 className="text-4xl font-black">FAQ</h2>

        {faqs.map(([q, a]) => (
          <details key={q} className="mt-4 rounded-3xl bg-white/5 p-5">
            <summary className="cursor-pointer font-bold text-gold">{q}</summary>
            <p className="mt-3 text-white/65">{a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}