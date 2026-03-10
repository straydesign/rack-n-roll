#!/usr/bin/env node

/**
 * Download public Facebook photo page images for the events page.
 * Uses the mobile Facebook URL trick to get the image without login.
 *
 * Usage: node scripts/pull-fb-flyers.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FLYERS_DIR = path.join(ROOT, "public", "flyers");

// Facebook photo IDs from their public photos page
// These are the flyer/promo graphics (not venue photos)
const PHOTO_IDS = [
  "1529888602141616", // Hiring Weekend Doorman
  "1520750829722060", // Dart Gear Blind Draw (Feb 20)
  "1517744376689372", // Dart Gear Blind Draw (alt)
  "1517517163378760", // Movie Trivia Feb 18
  "1493431365787340", // Upcoming Events schedule
  "1470846578045819", // Holiday Schedule
  "1451875723276238", // Unknown flyer
];

async function downloadPhoto(fbid, index) {
  // Use the mobile graph API image URL (publicly accessible for public pages)
  const url = `https://graph.facebook.com/${fbid}/picture?type=large&width=1200&height=1200`;

  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      console.warn(`  Failed ${fbid}: ${res.status}`);
      return null;
    }

    const contentType = res.headers.get("content-type") || "";
    const ext = contentType.includes("png") ? "png" : "jpg";
    const filename = `flyer-${index + 1}.${ext}`;
    const buffer = Buffer.from(await res.arrayBuffer());

    // Skip if too small (likely a placeholder)
    if (buffer.length < 5000) {
      console.warn(`  Skipped ${fbid}: too small (${buffer.length} bytes)`);
      return null;
    }

    const filePath = path.join(FLYERS_DIR, filename);
    fs.writeFileSync(filePath, buffer);
    console.log(`  Saved ${filename} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return { filename, fbid };
  } catch (err) {
    console.warn(`  Error ${fbid}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log("Downloading Facebook flyers...\n");

  fs.mkdirSync(FLYERS_DIR, { recursive: true });

  // Clear old flyers
  const existing = fs.readdirSync(FLYERS_DIR).filter((f) => f.startsWith("flyer-"));
  for (const f of existing) {
    fs.unlinkSync(path.join(FLYERS_DIR, f));
  }

  const results = [];
  for (let i = 0; i < PHOTO_IDS.length; i++) {
    const result = await downloadPhoto(PHOTO_IDS[i], i);
    if (result) results.push(result);
  }

  console.log(`\nDone! ${results.length} flyers saved to public/flyers/`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
