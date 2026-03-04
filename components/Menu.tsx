import { menu } from "@/data/events";

export default function Menu() {
  return (
    <section className="px-6 py-20 bg-charcoal/[0.03]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4 text-center">
          Grub
        </h2>
        <p className="text-center text-charcoal/60 mb-10">
          Bar food done right. Kitchen open until 11pm.
        </p>
        <div className="grid gap-8 sm:grid-cols-3">
          {menu.map((cat) => (
            <div key={cat.category}>
              <h3 className="font-bold text-lg text-charcoal mb-4 border-b border-green/30 pb-2">
                {cat.category}
              </h3>
              <ul className="space-y-3">
                {cat.items.map((item) => (
                  <li key={item.name}>
                    <span className="font-medium text-charcoal">{item.name}</span>
                    {item.description && (
                      <p className="text-charcoal/50 text-sm">{item.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
