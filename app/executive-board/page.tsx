import { Nav } from '@/components/Nav';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SiteFooter } from '@/components/SiteFooter';
import { executiveBoardMembers } from '@/lib/data';

export default function ExecutiveBoardPage() {
  return (
    <main className="royal-atmosphere premium-page content-page min-h-screen overflow-x-clip bg-ink">
      <Nav />

      <section className="section-shell content-hero">
        <ScrollReveal>
          <p className="section-kicker">Chapter Leadership</p>
          <h1 className="section-title max-w-4xl">Executive Board</h1>
          <p className="section-copy">
            The officers responsible for chapter operations, standards, and the member experience at Pi Kappa Phi ASU.
          </p>
        </ScrollReveal>
      </section>

      <section className="section-shell pt-0">
        <div className="exec-board-grid">
          {executiveBoardMembers.map((member, index) => (
            <ScrollReveal key={member.id} delay={index * 0.04}>
              <article className="exec-card">
                <div className="exec-headshot-placeholder" aria-label={`${member.role} photo placeholder`}>
                  {member.initials}
                </div>
                <div className="exec-card-body">
                  <p className="section-kicker">{member.role}</p>
                  <h2>{member.name}</h2>
                  <p>{member.instagram}</p>
                  <p>{member.phone}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
