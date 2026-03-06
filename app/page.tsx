import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'
import Header from '@/components/Header'
import {
  AboutSkeleton,
  ScheduleSkeleton,
  EventsSkeleton,
  MenuSkeleton,
  InfoSkeleton,
  FooterSkeleton,
} from '@/components/Skeletons'

const About = dynamic(() => import('@/components/About'), { loading: () => <AboutSkeleton /> })
const Schedule = dynamic(() => import('@/components/Schedule'), { loading: () => <ScheduleSkeleton /> })
const Events = dynamic(() => import('@/components/Events'), { loading: () => <EventsSkeleton /> })
const Menu = dynamic(() => import('@/components/Menu'), { loading: () => <MenuSkeleton /> })
const Info = dynamic(() => import('@/components/Info'), { loading: () => <InfoSkeleton /> })
const Footer = dynamic(() => import('@/components/Footer'), { loading: () => <FooterSkeleton /> })

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
