import { HeroCrests } from '@/components/HeroCrests';
import { Nav } from '@/components/Nav';
import { ApplicationForm } from '@/components/ApplicationForm';
import { Countdown } from '@/components/Countdown';
import { DisplayStack } from '@/components/DisplayStack';
import { RoseDivider } from '@/components/RoseDivider';
import { RushChairmen } from '@/components/RushChairmen';
import { RushMarquee } from '@/components/RushMarquee';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SiteFooter } from '@/components/SiteFooter';
import {
  applyDisplay,
  chairmenDisplay,
  heroDisplay,
  punchStatements,
  rushChairmen,
  stats,
  why,
  faqs,
} from '@/lib/data';

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

            <h1 className="hero-title hero-display max-w-5xl" aria-label="Rush Pi Kapp">
              <DisplayStack lines={heroDisplay} />
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

          <ScrollReveal className="hero-countdown mt-8 max-w-full" delay={0.12}>
            <Countdown />
          </ScrollReveal>
        </div>

        <a href="#why" className="scroll-hint">
          <span />
          Scroll
        </a>
      </section>

      <RushMarquee />

      <section className="punch-section">
        <div className="punch-section-inner">
          <div className="punch-grid">
            {punchStatements.map((statement, index) => (
              <ScrollReveal delay={index * 0.08} key={statement.ariaLabel}>
                <article className="punch-block">
                  <p className="section-kicker">{statement.kicker}</p>
                  <h2 className="punch-display" aria-label={statement.ariaLabel}>
                    <DisplayStack lines={statement.lines} />
                  </h2>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

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

      <section id="why" className="section-shell why-story max-md:!hidden">
        <div className="why-sticky">
          <ScrollReveal>
            <p className="section-kicker">Why Pi Kapp</p>
            <h2 className="section-title">Built for guys who want more out of ASU.</h2>
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
            <h2 className="section-title apply-display-title" aria-label="Start the conversation.">
              <DisplayStack lines={applyDisplay} />
            </h2>
            <p className="section-copy">
              Send the rush committee your details and we will reach out with the next step.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ApplicationForm />
          </ScrollReveal>
        </div>
      </section>

      <section id="rush-chairmen" className="section-shell rush-chairmen-section">
        <ScrollReveal>
          <div className="rush-chairmen-heading">
            <div>
              <p className="section-kicker">Rush Team</p>
              <h2 aria-label="Meet our rush chairmen">
                <DisplayStack lines={chairmenDisplay} />
              </h2>
            </div>
            <p className="rush-chairmen-note">
              Connect with the guys leading rush this semester and get a clear next step before events start.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <RushChairmen chairmen={rushChairmen} />
        </ScrollReveal>
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

      <SiteFooter />
    </main>
  );
}