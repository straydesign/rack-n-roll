import type { Metadata } from "next";
import LayoutWrapper from "@/components/LayoutWrapper";
import { getSiteSettings } from "@/lib/queries";

// ── Hardcoded fallbacks ──────────────────────────────────
const FALLBACK = {
  title: "Rack N Roll \u2014 Erie's Premier Karaoke Bar Since '89",
  description:
    "Erie's premier karaoke bar since 1989. 6 nights a week, great specials, good food. Come as you are.",
  siteName: "Rack N Roll",
  url: "https://rack-n-roll.vercel.app",
  image: "https://rack-n-roll.vercel.app/building.webp",
  phone: "(814) 864-3535",
  cuisine: "American",
  address: {
    street: "2040 W 38th St",
    city: "Erie",
    state: "PA",
    zip: "16508",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? FALLBACK.siteName;

  return {
    metadataBase: new URL(FALLBACK.url),
    openGraph: {
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

function buildJsonLd(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  const businessName = settings?.businessName ?? FALLBACK.siteName;
  const description = settings?.jsonLdDescription ?? FALLBACK.description;
  const phone = settings?.phone ?? FALLBACK.phone;
  const cuisine = settings?.cuisineType ?? FALLBACK.cuisine;

  const street = settings?.addressStreet ?? FALLBACK.address.street;
  const city = settings?.addressCity ?? FALLBACK.address.city;
  const state = settings?.addressState ?? FALLBACK.address.state;
  const zip = settings?.addressZip ?? FALLBACK.address.zip;

  return {
    "@context": "https://schema.org",
    "@type": "BarOrNightClub",
    name: businessName,
    description,
    url: FALLBACK.url,
    image: FALLBACK.image,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: city,
      addressRegion: state,
      postalCode: zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 42.1292,
      longitude: -80.0851,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "16:00",
        closes: "02:00",
      },
    ],
    servesCuisine: cuisine,
    hasMenu: `${FALLBACK.url}/menu`,
    event: {
      "@type": "Event",
      name: "Karaoke Night",
      description: "Live karaoke 6 nights a week",
      url: `${FALLBACK.url}/events`,
      eventAttendanceMode:
        "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: businessName,
        address: {
          "@type": "PostalAddress",
          streetAddress: street,
          addressLocality: city,
          addressRegion: state,
          postalCode: zip,
          addressCountry: "US",
        },
      },
    },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const jsonLd = buildJsonLd(settings);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      <LayoutWrapper>{children}</LayoutWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
