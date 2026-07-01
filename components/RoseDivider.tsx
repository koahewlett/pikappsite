import Image from 'next/image';

export function RoseDivider() {
  return (
    <>
      <div className="rose-divider-shell relative mx-auto grid max-w-7xl grid-cols-[minmax(52px,1fr)_auto_minmax(52px,1fr)] items-center gap-3 overflow-visible px-5 py-10 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-6 md:py-12">
        <div className="relative z-10 h-px w-full bg-gold/80 shadow-[0_0_12px_rgba(231,166,20,0.45)]" />

        <p className="relative z-10 max-w-[15rem] text-center text-[10px] font-black uppercase leading-snug tracking-[.12em] text-gold md:max-w-none md:whitespace-nowrap md:text-sm md:tracking-[.18em]">
          Everyone knows about it. Few get to experience it.
        </p>

        <div className="relative z-10 h-px w-full bg-royal/80 shadow-[0_0_12px_rgba(0,85,150,0.55)]" />
      </div>

      <section className="crest-showcase-section" aria-label="Pi Kappa Phi coat of arms">
        <div className="crest-showcase-orbit">
          <Image
            src="/images/pi-kapp-coat-of-arms.svg"
            alt="Pi Kappa Phi coat of arms"
            width={800}
            height={600}
            className="crest-showcase-image"
          />
        </div>
      </section>
    </>
  );
}
