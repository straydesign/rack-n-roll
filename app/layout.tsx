import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  title: "Rack N Roll — Erie's Premier Karaoke Bar Since '89",
  description:
    "Erie's premier karaoke bar since 1989. 6 nights a week, great specials, good food. Come as you are.",
  metadataBase: new URL("https://rack-n-roll.vercel.app"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans antialiased grain`}
      >
        <SmoothScroll>
          <ScrollProgress />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
