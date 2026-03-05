import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import About from '@/components/About'
import Schedule from '@/components/Schedule'
import Events from '@/components/Events'
import Menu from '@/components/Menu'
import Info from '@/components/Info'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="relative z-20">
        <Marquee />
        {/* Light section: About + Schedule */}
        <div className="bg-cream">
          <About />
          <div className="hr-glow max-w-4xl mx-auto" />
          <Schedule />
        </div>
        {/* Dark section: Events */}
        <Events />
        {/* Light section: Menu */}
        <div className="bg-cream">
          <Menu />
        </div>
        {/* Dark section: Info */}
        <Info />
        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}
