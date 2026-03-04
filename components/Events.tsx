import { events } from "@/data/events";

export default function Events() {
  return (
    <section className="px-6 py-20 bg-darkgreen text-cream">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl mb-4 text-center">
          What&rsquo;s Happening
        </h2>
        <p className="text-center text-cream/50 mb-10">
          Karaoke every night 9:30pm&ndash;1:30am &middot; Kitchen open until 11pm
        </p>
        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <div
                key={i}
                className="border border-cream/15 rounded-xl p-6 hover:border-green/50 transition-colors"
              >
                <span className="text-green text-sm font-medium uppercase tracking-wide">
                  {event.date}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-2">{event.title}</h3>
                <p className="text-cream/60 text-sm">{event.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-cream/70 text-lg">
            Every night&rsquo;s a good night. Karaoke starts at 9:30pm.
          </p>
        )}
      </div>
    </section>
  );
}
