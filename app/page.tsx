import { HeroCrests } from '@/components/HeroCrests';
import { Nav } from '@/components/Nav';
import { ApplicationForm } from '@/components/ApplicationForm';
import { Countdown } from '@/components/Countdown';
import { RoseDivider } from '@/components/RoseDivider';
import { RushMarquee } from '@/components/RushMarquee';
import { ScrollReveal } from '@/components/ScrollReveal';
import { stats, why, gallery, faqs, events } from '@/lib/data';

const SHOW_ALUMNI = false;

export default function Home() {
  return (
    <main className="royal-atmosphere premium-page relative min-h-screen overflow-hidden bg-ink">
      <Nav />

      <section className="hero-section relative isolate flex min-h-[92svh] items-center overflow-hidden px-5 pb-16 pt-28 md:min-h-screen md:px-6 md:pb-20 md:pt-24">
        <HeroCrests />
        <div className="hero-light hero-light-gold" />
        <div className="hero-light hero-light-blue" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_72%_45%,rgba(212,175,55,.16),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,#0F0F0F_0%,rgba(15,15,15,.94)_38%,rgba(15,15,15,.72)_65%,rgba(15,15,15,.45)_100%)]" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <ScrollReveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.28em] text-gold sm:text-sm md:tracking-[.4em]">
              Pi Kappa Phi · Theta Xi · Arizona State
            </p>

            <h1 className="hero-title max-w-5xl text-5xl leading-[0.9] sm:text-6xl md:text-8xl">
              Exceptional leaders. Uncommon opportunities.
            </h1>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#apply" className="premium-button premium-button-primary w-full sm:w-auto">
                Apply for Rush
              </a>

              <a href="#why" className="premium-button premium-button-secondary w-full sm:w-auto">
                Learn More
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal className="mt-8 max-w-full" delay={0.12}>
            <Countdown />
          </ScrollReveal>
        </div>

        <a href="#why" className="scroll-hint">
          <span />
          Scroll
        </a>
      </section>

      <RushMarquee />

      <section className="section-shell grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map(([n, l], index) => (
          <ScrollReveal key={l} delay={index * 0.06}>
            <div className="stat-tile">
              <div className="text-3xl font-black text-gold md:text-4xl">{n}</div>
              <div className="mt-2 text-sm leading-relaxed text-white/60 md:text-base">{l}</div>
            </div>
          </ScrollReveal>
        ))}
      </section>

      <RoseDivider />

      <section id="why" className="section-shell why-story">
        <div className="why-sticky">
          <ScrollReveal>
            <p className="section-kicker">Why Pi Kapp</p>
            <h2 className="section-title">Built for guys who want more out of ASU.</h2>
            <p className="section-copy">Meet the guys. Feel the standard.</p>
          </ScrollReveal>
        </div>

        <div className="why-list">
          {why.map(([t, d], index) => (
            <ScrollReveal key={t} delay={index * 0.08}>
              <article className="story-row">
                <span className="story-number">0{index + 1}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="apply" className="apply-story px-5 py-16 md:px-6 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <ScrollReveal className="lg:sticky lg:top-32">
            <p className="section-kicker">Fall Rush</p>
            <h2 className="section-title">Start the conversation.</h2>
            <p className="section-copy">
              Send the rush team your details and we will reach out with the next step. The form, routing, and submission flow are unchanged.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ApplicationForm />
          </ScrollReveal>
        </div>
      </section>

      <section className="section-shell highlight-band">
        <ScrollReveal>
          <p className="section-kicker">Chapter Life</p>
          <h2 className="section-title max-w-4xl">A rush process that shows the full picture.</h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-4">
          {events.map((event, index) => (
            <ScrollReveal key={event} delay={index * 0.04}>
              <div className="highlight-cell">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{event}</h3>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section id="gallery" className="section-shell hidden md:block">
        <ScrollReveal>
          <p className="section-kicker">Gallery</p>
          <h2 className="section-title">Chapter moments, framed cleaner.</h2>
        </ScrollReveal>

        <div className="gallery-grid mt-10">
          {gallery.map((g, index) => (
            <ScrollReveal key={g} delay={index * 0.06}>
              <div className="gallery-panel group">
                <div>
                  <span>Pi Kapp ASU</span>
                  <h3>{g}</h3>
                </div>
              </div>
            </ScrollReveal>
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

      <section id="faq" className="section-shell max-w-4xl pb-20 md:pb-28">
        <ScrollReveal>
          <p className="section-kicker">FAQ</p>
          <h2 className="section-title">Questions before rush?</h2>
        </ScrollReveal>

        <div className="mt-8 space-y-3">
          {faqs.map(([q, a], index) => (
            <ScrollReveal key={q} delay={index * 0.04}>
              <details className="faq-item">
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="final-cta px-5 pb-32 md:px-6 md:pb-36">
        <ScrollReveal>
          <div className="mx-auto max-w-6xl border-t border-white/10 pt-10 md:pt-14">
            <p className="section-kicker">Theta Xi · Arizona State</p>
            <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <h2 className="section-title max-w-3xl">Ready to see where you fit?</h2>
              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <a href="#apply" className="premium-button premium-button-primary">
                  Apply for Rush
                </a>
                <a href="/events" className="premium-button premium-button-secondary">
                  RSVP
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
