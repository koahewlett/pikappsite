export function RoseDivider() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(52px,1fr)_auto_minmax(52px,1fr)] items-center gap-3 px-5 py-10 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-6 md:py-12">
      <div className="h-px w-full bg-gold/80 shadow-[0_0_12px_rgba(212,175,55,0.45)]" />

      <p className="max-w-[15rem] text-center text-[10px] font-black uppercase leading-snug tracking-[.12em] text-gold md:max-w-none md:whitespace-nowrap md:text-sm md:tracking-[.18em]">
        Everyone knows about it. Few get to experience it.
      </p>

      <div className="h-px w-full bg-royal/80 shadow-[0_0_12px_rgba(58,95,205,0.55)]" />
    </div>
  );
}