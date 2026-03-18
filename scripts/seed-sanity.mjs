/**
 * One-time seed script: migrates hardcoded data from data/events.ts → Sanity.
 *
 * Usage:
 *   node scripts/seed-sanity.mjs
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
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

console.log(`Seeding Sanity project: ${env.NEXT_PUBLIC_SANITY_PROJECT_ID} / ${env.NEXT_PUBLIC_SANITY_DATASET}\n`)

// --- Site Settings ---
async function seedSiteSettings() {
  console.log('Creating siteSettings...')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    bannerEnabled: false,
    bannerText: '',
    address: '2040 W 38th St, Erie, PA 16508',
    phone: '(814) 864-3535',
    hours: 'Tue–Sat: 3pm–2am',
    closedDays: 'Closed Sun & Mon',
    amenities: [
      'Non-smoking inside',
      'Smoke porch out front',
      'Kitchen until 11pm',
      'Credit cards accepted',
      'Darts',
      '12 TVs',
    ],
    hiringEnabled: true,
    hiringText: 'Now hiring: Weekend Doorman',
  })
  console.log('  ✓ siteSettings')
}

// --- Daily Specials ---
const dailySpecials = [
  { day: 'Monday', sortOrder: 0, closed: true, specials: [] },
  { day: 'Tuesday', sortOrder: 1, closed: false, hours: '3 PM – 2 AM', specials: ['Busch Light Bucket — 4 for $10', 'Kitchen opens 4 PM'], karaoke: '9:30 PM w/ Preach' },
  { day: 'Wednesday', sortOrder: 2, closed: false, hours: '3 PM – 2 AM', specials: ['Trivia Night w/ JR 8–10 PM', '$0.50 Boneless Wings', 'Busch Light Bucket — 4 for $10'], karaoke: '9:30 PM (after Trivia)' },
  { day: 'Thursday', sortOrder: 3, closed: false, hours: '3 PM – 2 AM', specials: ['Busch Light Bucket — 4 for $10', 'Kitchen opens 4 PM'], karaoke: '9:30 PM w/ DJ Paul Amann' },
  { day: 'Friday', sortOrder: 4, closed: false, hours: '3 PM – 2 AM', specials: ['Darts Tournament 7 PM', 'Busch Light Bucket — 4 for $10'], karaoke: '9:30 PM w/ DJ Paul Amann' },
  { day: 'Saturday', sortOrder: 5, closed: false, hours: '3 PM – 2 AM', specials: ['The Big Night', 'Busch Light Bucket — 4 for $10'], karaoke: '9:30 PM w/ DJ Paul Amann' },
  { day: 'Sunday', sortOrder: 6, closed: true, specials: [] },
]

async function seedDailySpecials() {
  console.log('Creating daily specials...')
  for (const special of dailySpecials) {
    await client.create({
      _type: 'dailySpecial',
      ...special,
    })
    console.log(`  ✓ ${special.day}`)
  }
}

// --- Calendar Events ---
const calendarEvents = [
  { date: '2026-03-04', title: 'Trivia Night w/ JR', description: 'Movie trivia, general knowledge — it rotates. 8–10 PM.', time: '8:00 PM' },
  { date: '2026-03-11', title: 'Trivia Night w/ JR', description: 'Test your knowledge. 8–10 PM. Karaoke follows.', time: '8:00 PM' },
  { date: '2026-03-18', title: 'Trivia Night w/ JR', description: 'Wednesday trivia + karaoke at 9:30.', time: '8:00 PM' },
  { date: '2026-03-25', title: 'Trivia Night w/ JR', description: 'Trivia 8–10 PM. Karaoke follows at 9:30.', time: '8:00 PM' },
  { date: '2026-03-06', title: 'Darts Blind Draw', description: 'Mojo Dart Gear blind draw. $10 entry. Darts fly at 7 PM.', time: '7:00 PM' },
  { date: '2026-03-13', title: 'Darts Blind Draw', description: 'Mojo Dart Gear blind draw. $10 entry. Added money.', time: '7:00 PM' },
  { date: '2026-03-20', title: 'Darts Blind Draw', description: '$10 entry, darts at 7 PM. Kitchen open.', time: '7:00 PM' },
  { date: '2026-03-27', title: 'Darts Blind Draw', description: 'Mojo Dart Gear blind draw. Darts fly at 7 PM.', time: '7:00 PM' },
  { date: '2026-03-14', title: "St. Paddy's Eve Party", description: 'Green beer, Irish car bombs, and karaoke. Wear green!', time: '7:00 PM' },
  { date: '2026-03-17', title: "St. Patrick's Day", description: 'All-day green beer specials. Kitchen open early. Karaoke all night.', time: '3:00 PM' },
  { date: '2026-04-01', title: 'Trivia Night w/ JR', description: 'April Fools edition — extra tricky questions.', time: '8:00 PM' },
  { date: '2026-04-03', title: 'Darts Blind Draw', description: 'Mojo Dart Gear blind draw. $10 entry.', time: '7:00 PM' },
  { date: '2026-04-08', title: 'Trivia Night w/ JR', description: 'Wednesday trivia 8–10 PM.', time: '8:00 PM' },
  { date: '2026-04-10', title: 'Darts Blind Draw', description: 'Darts fly at 7 PM. Kitchen open.', time: '7:00 PM' },
  { date: '2026-04-15', title: 'Trivia Night w/ JR', description: 'Test your knowledge. 8–10 PM.', time: '8:00 PM' },
  { date: '2026-04-17', title: 'Darts Blind Draw', description: 'Mojo Dart Gear blind draw. Added money.', time: '7:00 PM' },
  { date: '2026-04-22', title: 'Trivia Night w/ JR', description: 'Trivia 8–10 PM. Karaoke follows.', time: '8:00 PM' },
  { date: '2026-04-24', title: 'Darts Blind Draw', description: '$10 entry. Darts at 7 PM.', time: '7:00 PM' },
  { date: '2026-04-29', title: 'Trivia Night w/ JR', description: 'Last Wednesday of April — trivia + karaoke.', time: '8:00 PM' },
]

async function seedCalendarEvents() {
  console.log('Creating calendar events...')
  for (const event of calendarEvents) {
    await client.create({
      _type: 'calendarEvent',
      ...event,
    })
  }
  console.log(`  ✓ ${calendarEvents.length} calendar events`)
}

// --- Menu Categories ---
const menuCategories = [
  {
    category: 'Appetizers', sortOrder: 0, items: [
      { _type: 'menuItem', _key: 'a1', name: 'Mac & Cheese Bites', price: '$6.95', description: '8 fried mac & cheese wedges with ranch dipping sauce' },
      { _type: 'menuItem', _key: 'a2', name: 'Spicy Deep Fried Pickles', price: '$5.50', description: '6 beer battered pickles with house made ranch' },
      { _type: 'menuItem', _key: 'a3', name: 'Pizza Logs', price: '$5.25', description: '3 cheese and pepperoni filled logs with ranch or marinara' },
      { _type: 'menuItem', _key: 'a4', name: 'Mozzarella Sticks', price: '$5.50', description: '5 fried sticks of gooey mozzarella with house made ranch or marinara' },
      { _type: 'menuItem', _key: 'a5', name: 'Jumbo Pretzels', price: '$2.50', description: 'With cheddar cheese & jalapeños. Add taco meat $1.50' },
      { _type: 'menuItem', _key: 'a6', name: 'Hot Pepper Cheese Balls', price: '$5.95', description: 'Bite sized balls filled with hot pepper cheese & served with ranch' },
      { _type: 'menuItem', _key: 'a7', name: 'Buffalo Chicken Dip', price: '$5.50', description: 'Home made buffalo chicken dip served with our nacho chips' },
      { _type: 'menuItem', _key: 'a8', name: 'Mini Tacos', price: '$5.50', description: '10 mini chicken and cheese filled tacos with salsa or sour cream' },
      { _type: 'menuItem', _key: 'a9', name: 'Buffalo Chicken Quesadilla', price: '$6.50', description: 'Grilled buffalo chicken, cheese, peppers, and onions with salsa and sour cream' },
      { _type: 'menuItem', _key: 'a10', name: 'Chicken Quesadilla', price: '$6.25', description: 'Grilled buffalo chicken, cheese, peppers, and onions with salsa and sour cream' },
      { _type: 'menuItem', _key: 'a11', name: 'Jalapeño Bites', price: '$6.50', description: '10 cream cheese filled jalapeño poppers with house made ranch' },
      { _type: 'menuItem', _key: 'a12', name: 'Zucchini Planks', price: '$6.25', description: '5 large fried planks of zucchini with ranch or marinara' },
      { _type: 'menuItem', _key: 'a13', name: 'Onion Rings', price: '$5.95', description: '10 large beer battered onion rings with your favorite dipping sauce' },
      { _type: 'menuItem', _key: 'a14', name: 'Sampler Platter', price: '$9.50', description: '10 hot pepper cheese balls, 2 pizza logs, 2 mozzarella sticks, & 1 jumbo pretzel with ranch, cheese & marinara' },
    ],
  },
  {
    category: 'Burgers', sortOrder: 1, items: [
      { _type: 'menuItem', _key: 'b1', name: 'Hamburger', price: '$5.75', description: 'With lettuce, tomato, & mayo' },
      { _type: 'menuItem', _key: 'b2', name: 'Cheeseburger', price: '$6.25', description: 'With your choice of cheese, lettuce, tomato, & mayo' },
      { _type: 'menuItem', _key: 'b3', name: 'BBQ Bacon', price: '$6.95', description: 'With bacon, cheddar cheese, BBQ sauce, lettuce & tomato' },
      { _type: 'menuItem', _key: 'b4', name: 'Rack Burger', price: '$6.95', description: 'With pepper jack cheese, hot sauce, lettuce, tomato, & ring peppers' },
      { _type: 'menuItem', _key: 'b5', name: 'Breakfast Burger', price: '$6.95', description: 'With American cheese, fried egg, and bacon' },
      { _type: 'menuItem', _key: 'b6', name: 'Mushroom Swiss', price: '$6.50', description: 'With grilled onions, mushrooms, & Swiss cheese' },
      { _type: 'menuItem', _key: 'b7', name: 'Greek Burger', price: '$6.50', description: 'With house made greek sauce, onion, ketchup & mustard' },
      { _type: 'menuItem', _key: 'b8', name: 'Big Muns', price: '$6.95', description: 'With fried bologna, fried egg, American cheese, & mustard' },
      { _type: 'menuItem', _key: 'b9', name: 'Pepper & Onion', price: '$6.75', description: 'Sausage patty topped with grilled peppers & onions' },
      { _type: 'menuItem', _key: 'b10', name: 'Black and Blue', price: '$6.75', description: 'With blue cheese, lettuce, & tomato' },
    ],
  },
  {
    category: 'Nachos & Baskets', sortOrder: 2, items: [
      { _type: 'menuItem', _key: 'n1', name: 'Traditional Nachos', price: '$3.75', description: 'Nacho chips covered with cheese & jalapeños' },
      { _type: 'menuItem', _key: 'n2', name: 'Taco Nachos', price: '$7.50', description: 'Crispy chips covered in cheese, taco meat, lettuce, tomato, onion & taco sauce' },
      { _type: 'menuItem', _key: 'n3', name: 'Fish and Chips', price: '$7.25', description: '3 pieces of cod with fries and tartar sauce' },
      { _type: 'menuItem', _key: 'n4', name: 'Chicken Tenders & Fries', price: '$7.25', description: '3 juicy chicken strips with a large portion of fries' },
    ],
  },
  {
    category: 'Salads', sortOrder: 3, items: [
      { _type: 'menuItem', _key: 's1', name: 'Antipasto Salad', price: '$6.25', description: 'Lettuce with ham, pepperoni, mozzarella, banana peppers, & tomato' },
      { _type: 'menuItem', _key: 's2', name: 'Grilled Chicken Salad', price: '$7.75', description: 'With cheddar cheese, grilled chicken, tomato, red onion, and French fries' },
      { _type: 'menuItem', _key: 's3', name: 'Blackened Chicken Salad', price: '$6.25', description: 'Blackened grilled chicken on lettuce with dry blue cheese, red onion, tomato, & French fries' },
    ],
  },
  {
    category: 'Sweet Treats', sortOrder: 4, items: [
      { _type: 'menuItem', _key: 't1', name: 'Deep Fried Twinkie', price: '$5.95', description: '2 Twinkies fried and topped with chocolate sauce. Strawberry sauce on the side' },
      { _type: 'menuItem', _key: 't2', name: 'Funnel Cake Fries', price: '$4.95', description: 'Fried shoe string funnel cake fries topped with powdered sugar. Side of maple syrup' },
    ],
  },
]

async function seedMenuCategories() {
  console.log('Creating menu categories...')
  for (const cat of menuCategories) {
    await client.create({
      _type: 'menuCategory',
      ...cat,
    })
    console.log(`  ✓ ${cat.category} (${cat.items.length} items)`)
  }
}

// --- Run all seeds ---
async function main() {
  try {
    await seedSiteSettings()
    await seedDailySpecials()
    await seedCalendarEvents()
    await seedMenuCategories()
    console.log('\n✅ Seed complete! Open Sanity Studio at /studio to verify.')
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message)
    process.exit(1)
  }
}

main()
