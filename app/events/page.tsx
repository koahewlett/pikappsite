import { DisplayStack } from '@/components/DisplayStack';
import { Nav } from '@/components/Nav';
import { RsvpSection } from '@/components/RsvpSection';
import { rsvpPunchStatement } from '@/lib/data';

export default function Events() {
  return (
    <main className="events-page min-h-screen bg-ink px-6 py-28 rose">
      <Nav />
      <section className="mx-auto max-w-7xl">
        <div className="events-hero mb-10 max-w-3xl">
          <h1 className="text-5xl font-black">RSVP for Fall Rush</h1>
          <p className="mt-4 text-white/60">Drop your info below and we’ll send you event details, rush times, and next steps.</p>
        </div>

        <div className="events-rsvp-layout">
          <article className="rsvp-punch-block">
            <p className="section-kicker">{rsvpPunchStatement.kicker}</p>
            <h2 className="punch-display rsvp-punch-display" aria-label={rsvpPunchStatement.ariaLabel}>
              <DisplayStack lines={rsvpPunchStatement.lines} />
            </h2>
          </article>

          <RsvpSection />
        </div>
      </section>
    </main>
  );
}
