export default function Info() {
  return (
    <section className="px-6 py-20 max-w-4xl mx-auto">
      <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-10 text-center">
        Find Us
      </h2>
      <div className="grid sm:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-charcoal mb-1">Address</h3>
            <p className="text-charcoal/70">
              2040 W 38th St<br />
              Erie, PA 16508
            </p>
          </div>
          <div>
            <h3 className="font-bold text-charcoal mb-1">Phone</h3>
            <a
              href="tel:+18148643535"
              className="text-amber hover:underline"
            >
              (814) 864-3535
            </a>
          </div>
          <div>
            <h3 className="font-bold text-charcoal mb-1">Hours</h3>
            <p className="text-charcoal/70">
              Mon&ndash;Sat: 3pm&ndash;2am<br />
              Wed opens early at 12pm<br />
              Closed Sundays
            </p>
          </div>
          <div>
            <h3 className="font-bold text-charcoal mb-1">Good to Know</h3>
            <p className="text-charcoal/70 text-sm">
              Non-smoking inside &middot; Smoke porch out front<br />
              Kitchen open until 11pm<br />
              Credit cards accepted &middot; Darts &middot; TVs
            </p>
          </div>
          <div>
            <h3 className="font-bold text-charcoal mb-1">Follow Us</h3>
            <a
              href="https://www.facebook.com/profile.php?id=100053614732579"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber hover:underline"
            >
              Facebook
            </a>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-charcoal/10 min-h-[280px]">
          <iframe
            title="Rack N Roll location"
            src="https://maps.google.com/maps?q=2040+W+38th+St,+Erie,+PA+16508&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: 280 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
