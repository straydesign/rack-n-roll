import Hero from '@/components/Hero'
import Header from '@/components/Header'
import About from '@/components/About'
import Schedule from '@/components/Schedule'
import Events from '@/components/Events'
import Menu from '@/components/Menu'
import Info from '@/components/Info'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <div className="relative z-20">
        {/* Light section: About + Schedule */}
        <div className="bg-cream">
          <div id="about">
            <About />
          </div>
          <div className="hr-glow max-w-4xl mx-auto" />
          <div id="schedule">
            <Schedule />
          </div>
        </div>
        {/* Dark section: Events */}
        <div id="events">
          <Events />
        </div>
        {/* Light section: Menu */}
        <div id="menu" className="bg-cream">
          <Menu />
        </div>
        {/* Dark section: Info */}
        <div id="info">
          <Info />
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}
