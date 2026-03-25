'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Mic, Music, Beer } from 'lucide-react'
import { Button } from '@/components/ui/button'

const cn = (...classes: (string | boolean | undefined)[]) =>
  classes.filter(Boolean).join(' ')

// --- Aurora Background ---
function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: React.HTMLProps<HTMLDivElement> & { children: React.ReactNode; showRadialGradient?: boolean }) {
  return (
    <div
      className={cn(
        'relative flex flex-col h-dvh items-center justify-center bg-zinc-950 text-slate-50 overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0">
        <div
          className={cn(
            `[--green-gradient:repeating-linear-gradient(100deg,var(--green)_0%,var(--green)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--green)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,#1A7A3A_8%,#22c55e_18%,#16a34a_28%,#15803d_38%,#1A7A3A_48%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[30px] invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[50px] opacity-50`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_5%,rgba(0,0,0,0.6)_30%,rgba(0,0,0,0.2)_55%,var(--transparent)_80%)]`
          )}
          style={{ '--green': '#1A7A3A', '--black': '#000000', '--transparent': 'transparent' } as React.CSSProperties}
        />
      </div>
      {children}
    </div>
  )
}

// --- Morphing Text ---
function MorphingText({ words, className, interval = 3000 }: { words: string[]; className?: string; interval?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const currentWord = words[currentIndex]
    const nextWord = words[(currentIndex + 1) % words.length]
    const steps = 20
    let step = 0

    const morphInterval = setInterval(() => {
      step++
      const progress = step / steps
      if (textRef.current) {
        if (progress < 0.5) {
          textRef.current.textContent = currentWord.slice(0, Math.floor(currentWord.length * (1 - progress * 2)))
        } else {
          textRef.current.textContent = nextWord.slice(0, Math.floor(nextWord.length * ((progress - 0.5) * 2)))
        }
      }
      if (step >= steps) {
        clearInterval(morphInterval)
        if (textRef.current) textRef.current.textContent = nextWord
      }
    }, 40)

    const wordTimeout = setTimeout(() => {
      setCurrentIndex((currentIndex + 1) % words.length)
    }, interval)

    return () => { clearInterval(morphInterval); clearTimeout(wordTimeout) }
  }, [currentIndex, words, interval])

  return (
    <span className={cn('inline-block', className)}>
      <span className="font-bold text-green">
        <span ref={textRef}>{words[0]}</span>
        <span className="inline-block w-0.5 h-[1em] bg-green animate-pulse ml-1 align-middle" aria-hidden="true" />
      </span>
    </span>
  )
}

// --- Velocity Parallax Text ---
function ParallaxText({ children, baseVelocity = 100 }: { children: string; baseVelocity: number }) {
  const baseX = useRef(0)
  const scrollYRef = useRef(0)
  const scrollVelocity = useRef(0)
  const xRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY
      scrollVelocity.current = current - scrollYRef.current
      scrollYRef.current = current
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let rafId: number
    let lastTime = Date.now()
    const animate = () => {
      const now = Date.now()
      const delta = (now - lastTime) / 1000
      lastTime = now
      baseX.current += baseVelocity * delta + scrollVelocity.current * delta * 0.5
      baseX.current = ((baseX.current % 25) + 25) % 25 - 50
      xRef.current = baseX.current
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(${baseX.current}%)`
      }
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [baseVelocity])

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div ref={containerRef} className="font-bold uppercase text-6xl md:text-8xl flex whitespace-nowrap will-change-transform">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="block mr-8 text-green-500/20">{children} </span>
        ))}
      </div>
    </div>
  )
}

// --- Main Hero ---
interface HeroProps {
  bannerEnabled?: boolean
  bannerText?: string
  hiringEnabled?: boolean
  hiringText?: string
}

export default function Hero({ bannerEnabled = false, bannerText, hiringEnabled = true, hiringText = 'Now hiring: Weekend Doorman' }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Pause aurora + floating icons when hero is off-screen
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('aurora-paused', !entry.isIntersecting)
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <AuroraBackground>
        <div
          className="relative z-10 flex flex-col items-center justify-center px-6 text-center min-h-dvh"
        >

          {/* Logo — static SVG */}
          <img
            src="/rack.svg"
            alt="Rack N Roll"
            className="w-[220px] md:w-[320px] h-auto mb-2 -mt-4 md:-mt-8"
          />

          {/* Announcement banner */}
          {bannerEnabled && bannerText && (
            <div
              className="mb-4"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green/15 border border-green/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
                <span className="text-sm font-medium text-green">
                  {bannerText}
                </span>
              </div>
            </div>
          )}

          {/* Morphing tagline */}
          <div
            className="mt-8 md:mt-12 text-lg md:text-2xl lg:text-3xl text-slate-400 font-light"
          >
            <span>Where every night is </span>
            <MorphingText
              words={['legendary', 'your night', 'karaoke night', 'a good time', 'unforgettable']}
              className="text-xl md:text-3xl lg:text-4xl"
            />
          </div>

          {/* Subtitle */}
          <p
            className="mt-6 md:mt-8 max-w-lg md:max-w-xl text-base md:text-lg lg:text-xl text-slate-500 leading-relaxed"
          >
            Since &rsquo;89. Come as you are. Karaoke 5 nights a week,
            great specials, and great food.
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-10 md:mt-14 flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 md:px-10 md:py-7 text-base md:text-lg font-semibold rounded-full shadow-lg shadow-green-900/50 hover:scale-105 transition-all"
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Beer className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              What&rsquo;s Happening This Week
            </Button>
          </div>

          {/* Hiring notice */}
          {hiringEnabled && hiringText && (
            <div
              className="mt-8 md:mt-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                  {hiringText}
                </span>
              </div>
            </div>
          )}


          {/* Floating Icons */}
          <div
            className="absolute top-[15%] left-8 md:left-16 opacity-60"
          >
            <Mic className="w-12 h-12 md:w-16 md:h-16 text-green-500" />
          </div>
          <div
            className="absolute top-[25%] right-8 md:right-16 opacity-60"
          >
            <Music className="w-14 h-14 md:w-20 md:h-20 text-green-500" />
          </div>
        </div>

      </AuroraBackground>

      {/* Velocity Parallax */}
      <div className="relative z-[2] bg-black py-16 mt-4 overflow-hidden">
        <ParallaxText baseVelocity={-3}>RACK N ROLL · KARAOKE · GOOD TIMES · SINCE &apos;89 ·</ParallaxText>
        <div className="h-4" />
        <ParallaxText baseVelocity={3}>ERIE PA · 20,000+ SONGS · GOOD TIMES · COME AS YOU ARE ·</ParallaxText>
      </div>
    </div>
  )
}
