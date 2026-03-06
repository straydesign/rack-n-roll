'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
        'relative flex flex-col h-screen items-center justify-center bg-zinc-950 text-slate-50 overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `[--green-gradient:repeating-linear-gradient(100deg,var(--green)_0%,var(--green)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--green)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,#1A7A3A_10%,#22c55e_15%,#16a34a_20%,#15803d_25%,#1A7A3A_30%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%]
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
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
  const [displayText, setDisplayText] = useState(words[0])

  useEffect(() => {
    const currentWord = words[currentIndex]
    const nextWord = words[(currentIndex + 1) % words.length]
    const steps = 20
    let step = 0

    const morphInterval = setInterval(() => {
      step++
      const progress = step / steps
      if (progress < 0.5) {
        setDisplayText(currentWord.slice(0, Math.floor(currentWord.length * (1 - progress * 2))))
      } else {
        setDisplayText(nextWord.slice(0, Math.floor(nextWord.length * ((progress - 0.5) * 2))))
      }
      if (step >= steps) {
        clearInterval(morphInterval)
        setDisplayText(nextWord)
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
        {displayText}
        <span className="inline-block w-0.5 h-[1em] bg-green animate-pulse ml-1 align-middle" />
      </span>
    </span>
  )
}

// --- Velocity Parallax Text ---
function ParallaxText({ children, baseVelocity = 100 }: { children: string; baseVelocity: number }) {
  const baseX = useRef(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useRef(0)
  const [x, setX] = useState(0)

  useEffect(() => {
    let lastScrollY = scrollY.get()
    const unsub = scrollY.on('change', () => {
      const current = scrollY.get()
      scrollVelocity.current = current - lastScrollY
      lastScrollY = current
    })
    return () => unsub()
  }, [scrollY])

  useEffect(() => {
    let rafId: number
    let lastTime = Date.now()
    const animate = () => {
      const now = Date.now()
      const delta = (now - lastTime) / 1000
      lastTime = now
      baseX.current += baseVelocity * delta + scrollVelocity.current * delta * 0.5
      baseX.current = ((baseX.current % 25) + 25) % 25 - 50
      setX(baseX.current)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [baseVelocity])

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div style={{ x: `${x}%` }} className="font-bold uppercase text-6xl md:text-8xl flex whitespace-nowrap will-change-transform">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="block mr-8 text-green-500/[0.08]">{children} </span>
        ))}
      </motion.div>
    </div>
  )
}

// --- Main Hero ---
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80])

  return (
    <div ref={containerRef} className="relative">
      <AuroraBackground>
        <motion.div
          style={{ opacity, scale, y }}
          className="relative z-10 flex flex-col items-center justify-center px-6 text-center min-h-screen"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-950/50 border border-green-500/20 backdrop-blur-sm">
              <Mic className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-semibold text-green-300 uppercase tracking-[0.15em]">
                Erie&rsquo;s Premier Karaoke Bar
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.33, 1, 0.68, 1] }}
          >
            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9]">
              <span className="block text-cream">Rack N Roll</span>
            </h1>
          </motion.div>

          {/* Morphing tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-8 text-lg md:text-2xl text-slate-400 font-light"
          >
            <span>Where every night is </span>
            <MorphingText
              words={['legendary', 'your night', 'karaoke night', 'a good time', 'unforgettable']}
              className="text-xl md:text-3xl"
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-6 max-w-lg text-base md:text-lg text-slate-500 leading-relaxed"
          >
            Since &rsquo;89. Come as you are. Karaoke 6 nights a week,
            great specials, and the best bar food in Erie.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-base font-semibold rounded-full shadow-lg shadow-green-900/50 hover:scale-105 transition-all"
              onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Beer className="w-5 h-5 mr-2" />
              What&rsquo;s Happening
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-500/30 text-green-400 hover:bg-green-950/50 px-8 py-6 text-base font-semibold rounded-full backdrop-blur-sm hover:scale-105 transition-all"
              onClick={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Mic className="w-5 h-5 mr-2" />
              Find Us
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md"
          >
            {[
              { val: '35+', label: 'Years' },
              { val: '20K+', label: 'Songs' },
              { val: '6', label: 'Nights' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-400">{s.val}</div>
                <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em]">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Floating Icons */}
          <motion.div
            className="absolute top-1/4 left-10 opacity-10"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Mic className="w-16 h-16 text-green-500" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-10 opacity-10"
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Music className="w-20 h-20 text-green-500" />
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-green-400/40 z-20"
        >
          <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <div className="w-5 h-9 border border-green-500/20 rounded-full flex justify-center pt-2">
              <div className="w-0.5 h-1.5 bg-green-500/40 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </AuroraBackground>

      {/* Velocity Parallax */}
      <div className="relative z-[2] bg-black py-12 overflow-hidden">
        <ParallaxText baseVelocity={-3}>RACK N ROLL · KARAOKE · GOOD TIMES · SINCE &apos;89 ·</ParallaxText>
        <div className="h-4" />
        <ParallaxText baseVelocity={3}>ERIE PA · 20,000+ SONGS · GOOD TIMES · COME AS YOU ARE ·</ParallaxText>
      </div>
    </div>
  )
}
