import Image from 'next/image';

export function HeroCrests() {
  return (
    <div className="hero-crests" aria-hidden="true">
      <div className="hero-crest hero-crest-right hero-svg-crest">
        <Image
          src="/images/pi-kapp-hero-shield.svg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 52rem, 88vw"
          className="pi-kapp-hero-shield"
        />
      </div>
    </div>
  );
}
