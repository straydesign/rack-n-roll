#!/usr/bin/env node

/**
 * Pull real photos from Google Places API for the gallery.
 *
 * Usage:
 *   GOOGLE_PLACES_KEY=xxx node scripts/pull-gallery.mjs
 *
 * What it does:
 *   1. Finds "Rack N Roll" in Erie PA via Text Search
 *   2. Gets photo references from the Place Details
 *   3. Downloads each photo to /public/gallery/
 *   4. Updates data/events.ts with correct dimensions
 *
 * Requires: A Google Cloud API key with Places API (New) enabled.
 *   - Go to https://console.cloud.google.com/apis/credentials
 *   - Enable "Places API (New)"
 *   - Create an API key
 *   - 1,000 photo requests/month free
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const GALLERY_DIR = path.join(ROOT, "public", "gallery");
const DATA_FILE = path.join(ROOT, "data", "events.ts");

const API_KEY = process.env.GOOGLE_PLACES_KEY;
if (!API_KEY) {
  console.error("Missing GOOGLE_PLACES_KEY env var.");
  console.error("Get one at https://console.cloud.google.com/apis/credentials");
  console.error("Enable 'Places API (New)' on the key.");
  process.exit(1);
}

const SEARCH_QUERY = "Rack N Roll 2040 W 38th St Erie PA";
const MAX_PHOTOS = 30;
const MAX_WIDTH = 1200;

async function findPlace() {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.photos",
    },
    body: JSON.stringify({ textQuery: SEARCH_QUERY }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Text Search failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  const place = data.places?.[0];
  if (!place) throw new Error("No place found for query: " + SEARCH_QUERY);

  console.log(`Found: ${place.displayName?.text} (${place.id})`);
  return place;
}

async function downloadPhoto(photoName, filename) {
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${MAX_WIDTH}&key=${API_KEY}`;

  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    console.warn(`  Failed to download ${photoName}: ${res.status}`);
    return null;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const filePath = path.join(GALLERY_DIR, filename);
  fs.writeFileSync(filePath, buffer);

  // Get dimensions from JPEG header
  const dims = getJpegDimensions(buffer);
  console.log(`  Saved ${filename} (${dims?.width}x${dims?.height}, ${(buffer.length / 1024).toFixed(0)}KB)`);

  return { filename, ...dims };
}

function getJpegDimensions(buffer) {
  // Simple JPEG SOF parser
  let i = 2;
  while (i < buffer.length - 1) {
    if (buffer[i] !== 0xff) break;
    const marker = buffer[i + 1];
    // SOF markers (0xC0 - 0xC3, 0xC5 - 0xC7, 0xC9 - 0xCB, 0xCD - 0xCF)
    if (
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf)
    ) {
      const height = buffer.readUInt16BE(i + 5);
      const width = buffer.readUInt16BE(i + 7);
      return { width, height };
    }
    const segLen = buffer.readUInt16BE(i + 2);
    i += 2 + segLen;
  }
  return { width: 800, height: 600 }; // fallback
}

function generateSlug(index) {
  const names = [
    "karaoke-night-1",
    "crowd-singing",
    "bar-interior",
    "wings-special",
    "friday-night",
    "stage-lights",
    "pint-night",
    "saturday-crowd",
    "good-times",
    "trivia-night",
    "darts-tournament",
    "late-night-crew",
    "bartender-pour",
    "karaoke-duet",
    "burger-closeup",
    "regulars-table",
    "karaoke-night-2",
    "drink-specials",
    "weekend-vibes",
    "closing-time",
  ];
  return names[index] || `photo-${index + 1}`;
}

function generateAlt(index) {
  const alts = [
    "Karaoke night at Rack N Roll",
    "Crowd singing along",
    "The bar at Rack N Roll",
    "Wing night special",
    "Friday night vibes",
    "Stage lights and karaoke",
    "$2 pint night",
    "Saturday night crowd",
    "Good times at Rack N Roll",
    "Trivia night at Rack N Roll",
    "Darts tournament",
    "Late night crew having fun",
    "Bartender pouring drinks",
    "Karaoke duet on stage",
    "Rack Burger closeup",
    "Regulars at their table",
    "Another great karaoke night",
    "Drink specials at the bar",
    "Weekend vibes at Rack N Roll",
    "Closing time smiles",
  ];
  return alts[index] || `Rack N Roll photo ${index + 1}`;
}

function updateDataFile(images) {
  const src = fs.readFileSync(DATA_FILE, "utf-8");

  const entries = images
    .map(
      (img, i) =>
        `  { src: "/gallery/${img.filename}", alt: "${generateAlt(i)}", width: ${img.width}, height: ${img.height}${i < 3 ? ", featured: true" : ""} },`
    )
    .join("\n");

  const newArray = `// Gallery photos — auto-pulled from Google Places API.
// Re-run: GOOGLE_PLACES_KEY=xxx node scripts/pull-gallery.mjs
export const galleryImages: GalleryImage[] = [\n${entries}\n];`;

  const updated = src.replace(
    /\/\/ Gallery photos[\s\S]*?export const galleryImages: GalleryImage\[\] = \[[\s\S]*?\];/,
    newArray
  );

  fs.writeFileSync(DATA_FILE, updated, "utf-8");
  console.log(`\nUpdated ${DATA_FILE} with ${images.length} images.`);
}

async function main() {
  console.log("Pulling gallery photos from Google Places API...\n");

  // Ensure gallery dir exists
  fs.mkdirSync(GALLERY_DIR, { recursive: true });

  // Clear old photos
  const existing = fs.readdirSync(GALLERY_DIR).filter((f) => f.endsWith(".jpg"));
  for (const f of existing) {
    fs.unlinkSync(path.join(GALLERY_DIR, f));
  }
  console.log(`Cleared ${existing.length} old photos.\n`);

  // Find the place and get photo refs
  const place = await findPlace();
  const photos = place.photos?.slice(0, MAX_PHOTOS) ?? [];

  if (photos.length === 0) {
    console.log("No photos found for this place.");
    process.exit(0);
  }

  console.log(`Found ${photos.length} photos. Downloading...\n`);

  // Download all photos
  const results = [];
  for (let i = 0; i < photos.length; i++) {
    const slug = generateSlug(i);
    const filename = `${slug}.jpg`;
    const result = await downloadPhoto(photos[i].name, filename);
    if (result) results.push(result);
  }

  // Update data file
  if (results.length > 0) {
    updateDataFile(results);
  }

  console.log(`\nDone! ${results.length} photos saved to public/gallery/`);
  console.log("Run 'npm run build' to verify.");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
