export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/50 text-center py-8 text-sm">
      <p className="font-serif text-lg text-cream/80 mb-2">
        Rack N Roll &mdash; Since &rsquo;89
      </p>
      <p>&copy; {new Date().getFullYear()} Rack N Roll. All rights reserved.</p>
    </footer>
  );
}
