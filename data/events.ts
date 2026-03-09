export interface Event {
  date: string;
  title: string;
  description: string;
  image?: string;
}

// Edit this array to update events on the site.
// Set to an empty array [] to show the default "every night" message.
export const events: Event[] = [
  {
    date: "Every Wednesday",
    title: "Trivia Night",
    description: "Hosted by JR. 8–10 PM. Followed by karaoke at 9:30.",
    image: "/facebook/event-10.jpg",
  },
  {
    date: "Every Friday",
    title: "Darts Tournament & Karaoke",
    description: "Mojo Dart Gear blind draw at 7 PM. Karaoke fires up at 9:30.",
    image: "/facebook/event-4.jpg",
  },
  {
    date: "Every Saturday",
    title: "Karaoke w/ DJ Paul",
    description: "Our biggest night. Pack the house, pick your song. 9:30 PM.",
  },
];

// --- Events page data ---

export type EventCategory = "weekly" | "special";

export interface FullEvent {
  date: string;
  title: string;
  description: string;
  longDescription?: string;
  time?: string;
  category: EventCategory;
  featured?: boolean;
}

export const allEvents: FullEvent[] = [
  {
    date: "Every Tuesday",
    title: "Karaoke w/ Preach",
    description: "Kick off your week with karaoke and cold drinks.",
    longDescription: "Tuesday night karaoke hosted by Preach. Kitchen open until 11 PM. Grab a bucket special and get on that mic.",
    time: "9:30 PM",
    category: "weekly",
  },
  {
    date: "Every Wednesday",
    title: "Trivia & Karaoke Night",
    description: "Trivia at 8 PM hosted by JR. Karaoke follows at 9:30.",
    longDescription: "Test your knowledge at trivia night from 8–10 PM, hosted by JR. Stick around for karaoke starting at 9:30. Movie trivia, general knowledge — it rotates every week.",
    time: "8:00 PM",
    category: "weekly",
    featured: true,
  },
  {
    date: "Every Thursday",
    title: "Karaoke w/ DJ Paul",
    description: "DJ Paul on the decks and karaoke all night.",
    longDescription: "Thursday nights belong to DJ Paul. Full karaoke setup, drink specials, and the kitchen is open.",
    time: "9:30 PM",
    category: "weekly",
  },
  {
    date: "Every Friday",
    title: "Darts Tournament & Karaoke",
    description: "Mojo Dart Gear blind draw at 7 PM. Karaoke at 9:30.",
    longDescription: "Friday night starts with a Mojo Dart Gear blind draw tournament — $10 entry, darts fly at 7–8 PM. Then karaoke takes over at 9:30. Kitchen open, Busch Light bucket specials.",
    time: "7:00 PM",
    category: "weekly",
    featured: true,
  },
  {
    date: "Every Saturday",
    title: "Karaoke w/ DJ Paul",
    description: "Our biggest night. DJ Paul, packed house, full volume.",
    longDescription: "Saturday night is THE night at Rack N Roll. DJ Paul runs the show. Standing room only — get here early. Full kitchen, full bar, full volume.",
    time: "9:30 PM",
    category: "weekly",
    featured: true,
  },
];

// --- Gallery page data ---

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  featured?: boolean;
}

// Gallery photos — auto-pulled from Google Places API.
// Re-run: GOOGLE_PLACES_KEY=xxx node scripts/pull-gallery.mjs
export const galleryImages: GalleryImage[] = [
  { src: "/gallery/karaoke-night-1.jpg", alt: "Karaoke night at Rack N Roll", width: 1200, height: 1600, featured: true },
  { src: "/gallery/crowd-singing.jpg", alt: "Crowd singing along", width: 1200, height: 1593, featured: true },
  { src: "/gallery/bar-interior.jpg", alt: "The bar at Rack N Roll", width: 1200, height: 675, featured: true },
  { src: "/gallery/wings-special.jpg", alt: "Wing night special", width: 1200, height: 1600 },
  { src: "/gallery/friday-night.jpg", alt: "Friday night vibes", width: 1200, height: 1600 },
  { src: "/gallery/stage-lights.jpg", alt: "Stage lights and karaoke", width: 1200, height: 1600 },
  { src: "/gallery/pint-night.jpg", alt: "$2 pint night", width: 1200, height: 676 },
  { src: "/gallery/saturday-crowd.jpg", alt: "Saturday night crowd", width: 1200, height: 1600 },
  { src: "/gallery/good-times.jpg", alt: "Good times at Rack N Roll", width: 1080, height: 1920 },
];

export interface MenuItem {
  name: string;
  description?: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

// Bar food menu — kitchen open until 11pm
export const menu: MenuCategory[] = [
  {
    category: "Wings",
    items: [
      { name: "Bone-In Wings", description: "Tossed in your choice of sauce" },
      { name: "Boneless Wings", description: "$0.50 each on Wednesdays" },
    ],
  },
  {
    category: "From the Grill",
    items: [
      { name: "Burgers" },
      { name: "Breakfast Burger", description: "Our signature" },
      { name: "Philly Cheesesteak" },
    ],
  },
  {
    category: "Pizza",
    items: [
      { name: "Freshly Baked Pizza", description: "Made to order" },
    ],
  },
];

export const weeklySchedule = [
  { day: "Tuesday", hours: "3 PM–2 AM", karaoke: "9:30 PM", host: "Preach" },
  { day: "Wednesday", hours: "3 PM–2 AM", karaoke: "9:30 PM", special: "Trivia 8–10 PM w/ JR" },
  { day: "Thursday", hours: "3 PM–2 AM", karaoke: "9:30 PM", host: "DJ Paul" },
  { day: "Friday", hours: "3 PM–2 AM", karaoke: "9:30 PM", special: "Darts Tournament 7 PM" },
  { day: "Saturday", hours: "3 PM–2 AM", karaoke: "9:30 PM", host: "DJ Paul" },
];

// --- Reviews data (pulled from Google Places API) ---

export interface Review {
  name: string;
  text: string;
  rating: number;
  date: string;
}

export const googleRating = 4.2;
export const googleReviewCount = 441;

export const reviews: Review[] = [
  {
    name: "Andrew V.",
    text: "This place is a true gem. The bartenders were super nice and great at their job. The atmosphere is wonderful with a true mix of people from all walks of life. You're missing out if you don't go here!",
    rating: 5,
    date: "Feb 2025",
  },
  {
    name: "Brandon B.",
    text: "Rack & Roll is one of my favorite places to go! Very affordable drinks and food on top of free karaoke!! It's such a fun atmosphere to be in.",
    rating: 5,
    date: "Feb 2025",
  },
  {
    name: "BeardTree",
    text: "A great place with great service! Some of the people that sing are amazing. The tall mugs are super frosty!",
    rating: 5,
    date: "Jan 2026",
  },
];
