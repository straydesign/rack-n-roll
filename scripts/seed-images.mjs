/**
 * Uploads flyer and gallery images to Sanity and creates documents.
 *
 * Usage:
 *   node scripts/seed-images.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local
const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [key, ...rest] = trimmed.split('=')
  env[key.trim()] = rest.join('=').trim()
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  token: env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function uploadImage(filePath) {
  const buffer = readFileSync(filePath)
  const filename = basename(filePath)
  const asset = await client.assets.upload('image', buffer, { filename })
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  }
}

// --- Flyers ---
const flyers = [
  { file: 'darts-blind-draw.jpg', alt: 'Dart Gear Blind Draw — Friday Feb 20', sortOrder: 0 },
  { file: 'hiring-doorman.jpg', alt: 'Now Hiring — Weekend Doorman', sortOrder: 1 },
]

async function seedFlyers() {
  console.log('Uploading flyers...')
  for (const flyer of flyers) {
    const filePath = resolve(__dirname, '..', 'public', 'flyers', flyer.file)
    const image = await uploadImage(filePath)
    await client.create({
      _type: 'flyer',
      image,
      alt: flyer.alt,
      active: true,
      sortOrder: flyer.sortOrder,
    })
    console.log(`  ✓ ${flyer.file}`)
  }
}

// --- Gallery Images ---
const galleryImages = [
  { file: 'karaoke-night-1.jpg', alt: 'Karaoke night at Rack N Roll', featured: true, sortOrder: 0 },
  { file: 'crowd-singing.jpg', alt: 'Crowd singing along', featured: true, sortOrder: 1 },
  { file: 'bar-interior.jpg', alt: 'The bar at Rack N Roll', featured: true, sortOrder: 2 },
  { file: 'friday-night.jpg', alt: 'Friday night vibes', featured: false, sortOrder: 3 },
  { file: 'stage-lights.jpg', alt: 'Stage lights and karaoke', featured: false, sortOrder: 4 },
  { file: 'saturday-crowd.jpg', alt: 'Saturday night crowd', featured: false, sortOrder: 5 },
  { file: 'good-times.jpg', alt: 'Good times at Rack N Roll', featured: false, sortOrder: 6 },
  { file: 'trivia-night.jpg', alt: 'Trivia night at Rack N Roll', featured: false, sortOrder: 7 },
]

async function seedGallery() {
  console.log('Uploading gallery images...')
  for (const img of galleryImages) {
    const filePath = resolve(__dirname, '..', 'public', 'gallery', img.file)
    try {
      const image = await uploadImage(filePath)
      await client.create({
        _type: 'galleryImage',
        image,
        alt: img.alt,
        featured: img.featured,
        sortOrder: img.sortOrder,
      })
      console.log(`  ✓ ${img.file}`)
    } catch (err) {
      console.log(`  ✗ ${img.file} — ${err.message}`)
    }
  }
}

async function main() {
  try {
    await seedFlyers()
    await seedGallery()
    console.log('\n✅ All images uploaded to Sanity.')
  } catch (err) {
    console.error('\n❌ Failed:', err.message)
    process.exit(1)
  }
}

main()
