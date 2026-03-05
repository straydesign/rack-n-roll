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
        <div className="bg-cream">
          <About />
          <Schedule />
        </div>
        <Events />
        <div className="bg-cream">
          <Menu />
          <Info />
        </div>
        <Footer />
      </div>
    </main>
  )
}
