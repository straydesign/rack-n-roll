import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import MobileCTA from "@/components/MobileCTA";
import AudioPlayer from "@/components/AudioPlayer";
import Preloader from "@/components/Preloader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

const freshman = localFont({
  src: "../public/fonts/Freshman.woff2",
  variable: "--font-freshman",
  display: "swap",
  weight: "400",
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
        className={`${dmSans.variable} ${freshman.variable} font-sans antialiased grain`}
      >
        <Preloader />
        <SmoothScroll>
          <ScrollProgress />
          {children}
          <MobileCTA />
        </SmoothScroll>
        <AudioPlayer />
      </body>
    </html>
  );
}
