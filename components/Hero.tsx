export default function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-24">
      <p className="uppercase tracking-[0.25em] text-amber text-sm font-medium mb-6">
        Karaoke Capitol of the Great Lakes
      </p>
      <h1 className="font-serif text-5xl md:text-7xl text-charcoal mb-6 leading-tight">
        Since &rsquo;89.<br />Come as you are.
      </h1>
      <p className="text-xl md:text-2xl text-charcoal/70 mb-10 max-w-lg">
        Rack N Roll &mdash; Erie&rsquo;s living room.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 text-sm text-charcoal/60">
        <span>2040 W 38th St, Erie, PA</span>
        <span className="hidden sm:inline">&middot;</span>
        <span>Mon&ndash;Sat, 3pm&ndash;2am</span>
        <span className="hidden sm:inline">&middot;</span>
        <a href="tel:+18148643535" className="hover:text-amber transition-colors">
          (814) 864-3535
        </a>
      </div>
    </section>
  );
}
