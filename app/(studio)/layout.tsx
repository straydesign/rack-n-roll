import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rack N Roll — Studio",
  description: "Content management for Rack N Roll",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
