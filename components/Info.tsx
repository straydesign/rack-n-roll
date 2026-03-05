'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const ease = [0.33, 1, 0.68, 1] as const

export default function Info() {
  return (
    <section className="px-6 py-24 md:py-32 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="font-serif text-3xl md:text-5xl text-charcoal mb-14 text-center"
      >
        Find Us
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="space-y-7"
        >
          <div>
            <h3 className="font-bold text-charcoal mb-1 text-sm uppercase tracking-wider">
              Address
            </h3>
            <p className="text-charcoal/70 text-lg">
              2040 W 38th St
              <br />
              Erie, PA 16508
            </p>
          </div>
          <div>
            <h3 className="font-bold text-charcoal mb-1 text-sm uppercase tracking-wider">
              Phone
            </h3>
            <a
              href="tel:+18148643535"
              className="text-green text-lg hover:underline"
            >
              (814) 864-3535
            </a>
          </div>
          <div>
            <h3 className="font-bold text-charcoal mb-1 text-sm uppercase tracking-wider">
              Hours
            </h3>
            <p className="text-charcoal/70">
              Mon&ndash;Sat: 3pm&ndash;2am
              <br />
              Wed opens early at 12pm
              <br />
              Closed Sundays
            </p>
          </div>
          <div>
            <h3 className="font-bold text-charcoal mb-1 text-sm uppercase tracking-wider">
              Good to Know
            </h3>
            <p className="text-charcoal/55 text-sm leading-relaxed">
              Non-smoking inside &middot; Smoke porch out front
              <br />
              Kitchen open until 11pm
              <br />
              Credit cards accepted &middot; Darts &middot; 12 TVs
            </p>
          </div>
          <div>
            <h3 className="font-bold text-charcoal mb-1 text-sm uppercase tracking-wider">
              Follow Us
            </h3>
            <a
              href="https://www.facebook.com/profile.php?id=100053614732579"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green hover:underline inline-flex items-center gap-2"
            >
              Facebook
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17L17 7M17 7H7M17 7v10"
                />
              </svg>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="space-y-4"
        >
          {/* Building photo */}
          <div className="rounded-2xl overflow-hidden border border-charcoal/10 relative h-[200px]">
            <Image
              src="/building.jpg"
              alt="Rack N Roll exterior"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-charcoal/10 h-[250px]">
            <iframe
              title="Rack N Roll location"
              src="https://maps.google.com/maps?q=2040+W+38th+St,+Erie,+PA+16508&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
