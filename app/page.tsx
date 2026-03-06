import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import Header from '@/components/Header'

const About = dynamic(() => import('@/components/About'))
const Schedule = dynamic(() => import('@/components/Schedule'))
const Events = dynamic(() => import('@/components/Events'))
const Menu = dynamic(() => import('@/components/Menu'))
const Info = dynamic(() => import('@/components/Info'))
const Footer = dynamic(() => import('@/components/Footer'))

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
