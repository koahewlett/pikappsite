import { Nav } from '@/components/Nav';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SiteFooter } from '@/components/SiteFooter';
import { abilityExperienceContent } from '@/lib/data';

export default function AbilityExperiencePage() {
  return (
    <main className="royal-atmosphere premium-page content-page min-h-screen overflow-x-clip bg-ink">
      <Nav />

      <section className="section-shell content-hero">
        <ScrollReveal>
          <p className="section-kicker">National Philanthropy</p>
          <h1 className="section-title max-w-5xl">The Ability Experience</h1>
          <p className="section-copy">{abilityExperienceContent.intro}</p>
          <a
            href={abilityExperienceContent.externalHref}
            className="premium-button premium-button-primary mt-7 inline-flex"
            target="_blank"
            rel="noreferrer noopener"
          >
            Visit Ability Experience
          </a>
        </ScrollReveal>
      </section>

      <section className="section-shell ability-section pt-0">
        <div className="ability-grid">
          <ScrollReveal>
            <div className="ability-panel">
              <p className="section-kicker">What It Means</p>
              <ul>
                {abilityExperienceContent.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <div className="ability-photo-grid">
            {abilityExperienceContent.photos.map((photo, index) => (
              <ScrollReveal key={photo.id} delay={index * 0.06}>
                <div className="ability-photo-placeholder">
                  <span>{photo.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
