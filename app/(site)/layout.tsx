import type { Metadata } from "next";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Rack N Roll — Erie's Premier Karaoke Bar Since '89",
  description:
    "Erie's premier karaoke bar since 1989. 6 nights a week, great specials, good food. Come as you are.",
  metadataBase: new URL("https://racknrollerie.com"),
  openGraph: {
    title: "Rack N Roll",
    description: "Erie's premier karaoke bar since 1989. Come as you are.",
    type: "website",
    siteName: "Rack N Roll",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rack N Roll",
    description: "Erie's premier karaoke bar since 1989. Come as you are.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarOrNightClub",
  name: "Rack N Roll",
  description:
    "Erie's premier karaoke bar since 1989. 6 nights a week, great specials, good food. Come as you are.",
  url: "https://racknrollerie.com",
  image: "https://racknrollerie.com/building.webp",
  telephone: "",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Erie",
    addressRegion: "PA",
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
  servesCuisine: "American",
  hasMenu: "https://racknrollerie.com/menu",
  event: {
    "@type": "Event",
    name: "Karaoke Night",
    description: "Live karaoke 6 nights a week",
    url: "https://racknrollerie.com/events",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Rack N Roll",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Erie",
        addressRegion: "PA",
        addressCountry: "US",
      },
    },
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
