'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { galleryImages as defaultGalleryImages } from '@/data/events'
import type { GalleryImage } from '@/data/events'
import Lightbox from './Lightbox'

const ease = [0.33, 1, 0.68, 1] as const

function Placeholder({ alt, width, height }: { alt: string; width: number; height: number }) {
  return (
    <div
      className="w-full bg-cream/5 flex items-center justify-center rounded-2xl"
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <div className="text-center px-4">
        <svg
          className="w-10 h-10 text-cream/10 mx-auto mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
          />
        </svg>
        <span className="text-cream/20 text-xs">{alt}</span>
      </div>
    </div>
  )
}

interface GalleryGridProps {
  images?: GalleryImage[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const galleryImages = images && images.length > 0 ? images : defaultGalleryImages
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const isSanity = images && images.length > 0

  // Pre-check which local images actually exist (skip for Sanity CDN)
  useEffect(() => {
    if (isSanity) {
      setLoadedImages(new Set(galleryImages.map((img) => img.src)))
      return
    }
    galleryImages.forEach((image) => {
      const img = new window.Image()
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(image.src))
      }
      img.src = image.src
    })
  }, [galleryImages, isSanity])

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setLightboxIndex((prev) =>
      prev !== null && prev < galleryImages.length - 1 ? prev + 1 : prev
    )
  }

  return (
    <section className="relative px-6 py-16 md:py-24 bg-charcoal text-cream overflow-hidden">
      <div className="noise absolute inset-0 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="columns-3 gap-4">
          {galleryImages.map((image, i) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.95, clipPath: 'inset(8% 8% 8% 8% round 16px)' }}
              whileInView={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: i * 0.08, ease }}
              className="mb-4 break-inside-avoid"
            >
              <button
                onClick={() => setLightboxIndex(i)}
                aria-label={`View photo: ${image.alt}`}
                className="group relative block w-full rounded-2xl overflow-hidden cursor-pointer"
              >
                {loadedImages.has(image.src) ? (
                  <>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading={i < 3 ? 'eager' : 'lazy'}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <svg
                          className="w-8 h-8 text-cream"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                          />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <Placeholder alt={image.alt} width={image.width} height={image.height} />
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {galleryImages.length === 0 && (
          <p className="text-center text-cream/40 text-lg py-20">
            Gallery coming soon. Check back for photos of our best nights!
          </p>
        )}
      </div>

      <Lightbox
        images={galleryImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  )
}
