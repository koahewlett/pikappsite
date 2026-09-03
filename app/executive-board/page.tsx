import Image from 'next/image';
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
                <div className={`exec-headshot-placeholder${member.image ? ' has-image' : ''}`} aria-hidden="true">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={`${member.name}, ${member.role}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="exec-headshot-image"
                      priority={member.id === 'vice-archon-vice-president'}
                    />
                  ) : (
                    member.initials
                  )}
                </div>
                <div className="exec-card-body">
                  <p className="section-kicker">{member.role}</p>
                  <h2>{member.name}</h2>
                  {member.instagram ? <p>{member.instagram}</p> : null}
                  {member.phone ? <p>{member.phone}</p> : null}
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
