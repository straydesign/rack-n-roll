'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const STORAGE_KEY = 'rnr-music-playing'

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [mounted, setMounted] = useState(false)

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
      localStorage.setItem(STORAGE_KEY, 'false')
    } else {
      audio.volume = 0.35
      audio.play().then(() => {
        setPlaying(true)
        localStorage.setItem(STORAGE_KEY, 'true')
      }).catch(() => {
        // autoplay blocked — ignore
      })
    }
  }, [playing])

  useEffect(() => {
    setMounted(true)

    const audio = audioRef.current
    if (!audio) return

    const wasPlaying = localStorage.getItem(STORAGE_KEY) === 'true'
    if (wasPlaying) {
      audio.volume = 0.35
      audio.play().then(() => setPlaying(true)).catch(() => {
        // autoplay blocked on fresh load — user must click
      })
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <audio ref={audioRef} src="/audio/bg-music.mp3" loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Mute background music' : 'Play background music'}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5
          bg-charcoal/80 backdrop-blur-xl border border-cream/10 rounded-full
          text-cream/70 hover:text-cream hover:border-cream/20
          transition-colors duration-300 cursor-pointer
          max-md:bottom-20 max-md:right-4"
      >
        {playing ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
        <span className="text-xs font-medium tracking-wide uppercase">
          {playing ? 'On' : 'Off'}
        </span>
      </button>
    </>
  )
}
