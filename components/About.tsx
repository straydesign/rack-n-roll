const features = [
  { title: "Karaoke 7 Nights a Week", desc: "The mic is always on." },
  { title: "Cheap Drinks, Good Food", desc: "No pretense, no surprises on the tab." },
  { title: "20,000+ Songs", desc: "From Johnny Cash to Cardi B. We got you." },
  { title: "Open Since 1989", desc: "Still here. Still loud. Still your place." },
];

export default function About() {
  return (
    <section className="px-6 py-20 max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4 text-center">
        The kind of bar that feels like home.
      </h2>
      <p className="text-center text-charcoal/70 mb-12 max-w-2xl mx-auto text-lg">
        No cover. No dress code. Just a neighborhood spot where everybody sings,
        the drinks are cheap, and the jukebox never stops.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="border border-charcoal/10 rounded-xl p-6 hover:border-amber/40 transition-colors"
          >
            <h3 className="font-bold text-lg text-charcoal mb-1">{f.title}</h3>
            <p className="text-charcoal/60 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
