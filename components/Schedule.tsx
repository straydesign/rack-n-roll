import { weeklySchedule } from "@/data/events";

export default function Schedule() {
  return (
    <section className="px-6 py-20 max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4 text-center">
        Weekly Schedule
      </h2>
      <p className="text-center text-charcoal/60 mb-10">
        Karaoke every night &middot; DJ Paul Amann on the mic
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-charcoal/10">
              <th className="py-3 pr-4 font-bold text-charcoal">Day</th>
              <th className="py-3 pr-4 font-bold text-charcoal">Hours</th>
              <th className="py-3 pr-4 font-bold text-charcoal">Karaoke</th>
              <th className="py-3 font-bold text-charcoal">Specials</th>
            </tr>
          </thead>
          <tbody>
            {weeklySchedule.map((row) => (
              <tr key={row.day} className="border-b border-charcoal/5">
                <td className="py-3 pr-4 font-medium text-charcoal">{row.day}</td>
                <td className="py-3 pr-4 text-charcoal/70">{row.hours}</td>
                <td className="py-3 pr-4 text-charcoal/70">{row.karaoke}</td>
                <td className="py-3 text-amber font-medium">
                  {row.special || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-charcoal/40 text-xs mt-4 text-center">
        Closed Sundays
      </p>
    </section>
  );
}
