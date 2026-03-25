export default function MenuPageHero() {
  return (
    <section
      className="relative min-h-[50vh] flex items-center justify-center px-6 py-28 md:py-40 overflow-hidden bg-charcoal text-cream"
    >
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span
          className="block text-green text-xs font-bold uppercase tracking-[0.3em] mb-8"
        >
          The Grub
        </span>

        <h1
          className="font-heading display-text text-cream mb-6"
        >
          Full Menu
        </h1>

        <p
          className="text-cream/30 text-sm max-w-lg mx-auto"
        >
          Kitchen opens at 4 PM &middot; Bar food done right &middot; Dine in or carry out
        </p>
      </div>
    </section>
  )
}
