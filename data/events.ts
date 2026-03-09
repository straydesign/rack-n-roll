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
    title: "Karaoke w/ DJ Paul Amann",
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
  // --- Weekly Specials (food & drink deals) ---
  {
    date: "Every Day",
    title: "Busch Light Bucket Special",
    description: "4 bottles for $10. All day, every day.",
    longDescription: "Grab a bucket of Busch Light — 4 bottles of 12 oz for just $10. Available every day the bar is open.",
    category: "weekly",
    featured: true,
  },
  {
    date: "Every Wednesday",
    title: "$0.50 Boneless Wings",
    description: "Half-price boneless wings all night.",
    longDescription: "Wednesday means wings. $0.50 boneless wings tossed in your choice of sauce. Pair it with a cold one.",
    category: "weekly",
  },
  {
    date: "Every Day",
    title: "Kitchen Open at 4 PM",
    description: "Burgers, wings, pizza, cheesesteaks — bar food done right.",
    longDescription: "Kitchen fires up at 4 PM every day. Bone-in wings, boneless wings, burgers, breakfast burger, philly cheesesteaks, and fresh pizza.",
    category: "weekly",
  },
  // --- Special Events ---
  {
    date: "Every Wednesday",
    title: "Trivia Night w/ JR",
    description: "Test your knowledge. 8–10 PM. Movie trivia, general knowledge — it rotates.",
    longDescription: "Wednesday trivia night from 8–10 PM, hosted by JR. Movie trivia, general knowledge — it changes every week. Karaoke follows at 9:30.",
    time: "8:00 PM",
    category: "special",
    featured: true,
  },
  {
    date: "Every Friday",
    title: "Darts Tournament",
    description: "Mojo Dart Gear blind draw. $10 entry. Darts fly at 7 PM.",
    longDescription: "Friday night starts with a Mojo Dart Gear blind draw tournament — $10 entry, darts fly at 7 PM. Added money. Kitchen open.",
    time: "7:00 PM",
    category: "special",
  },
  {
    date: "Every Friday & Saturday",
    title: "Karaoke w/ DJ Paul Amann",
    description: "The main event. DJ Paul Amann runs the show at 9:30 PM.",
    longDescription: "Friday and Saturday nights belong to DJ Paul Amann. Packed house, full volume, the best karaoke in Erie. Get here early.",
    time: "9:30 PM",
    category: "special",
    featured: true,
  },
  {
    date: "Every Tuesday",
    title: "Karaoke w/ Preach",
    description: "Tuesday night karaoke hosted by Preach. 9:30 PM.",
    longDescription: "Preach gets the week going. Karaoke at 9:30 PM, kitchen open, bucket specials all night.",
    time: "9:30 PM",
    category: "special",
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
  { src: "/gallery/bar-interior.jpg", alt: "The bar at Rack N Roll", width: 1200, height: 675, featured: true },
  { src: "/gallery/crowd-singing.jpg", alt: "Crowd singing along", width: 1200, height: 1593, featured: true },
  { src: "/gallery/friday-night.jpg", alt: "Friday night vibes", width: 1200, height: 1600, featured: true },
  { src: "/gallery/stage-lights.jpg", alt: "Stage lights and karaoke", width: 1200, height: 1600 },
  { src: "/gallery/saturday-crowd.jpg", alt: "Saturday night crowd", width: 1200, height: 1600 },
  { src: "/gallery/good-times.jpg", alt: "Good times at Rack N Roll", width: 1080, height: 1920 },
  { src: "/gallery/pint-night.jpg", alt: "Pint night", width: 1200, height: 676 },
  { src: "/gallery/karaoke-night-1.jpg", alt: "Karaoke night at Rack N Roll", width: 1200, height: 1600 },
  { src: "/gallery/wings-special.jpg", alt: "Wing night special", width: 1200, height: 1600 },
];

export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

// Homepage preview — just a taste
export const menuPreview: MenuItem[] = [
  { name: "Rack Burger", price: "$6.95", description: "Pepper jack, hot sauce, ring peppers" },
  { name: "Sampler Platter", price: "$9.50", description: "Cheese balls, pizza logs, mozz sticks, & pretzel" },
  { name: "Bone-In Wings", price: "$0.50/ea", description: "Tossed in your choice of sauce" },
];

// Real menu — Rack and Roll, 2040 West 38th Street, Erie PA
export const menu: MenuCategory[] = [
  {
    category: "Appetizers",
    items: [
      { name: "Mac & Cheese Bites", price: "$6.95", description: "8 fried mac & cheese wedges with ranch dipping sauce" },
      { name: "Spicy Deep Fried Pickles", price: "$5.50", description: "6 beer battered pickles with house made ranch" },
      { name: "Pizza Logs", price: "$5.25", description: "3 cheese and pepperoni filled logs with ranch or marinara" },
      { name: "Mozzarella Sticks", price: "$5.50", description: "5 fried sticks of gooey mozzarella with house made ranch or marinara" },
      { name: "Jumbo Pretzels", price: "$2.50", description: "With cheddar cheese & jalapeños. Add taco meat $1.50" },
      { name: "Hot Pepper Cheese Balls", price: "$5.95", description: "Bite sized balls filled with hot pepper cheese & served with ranch" },
      { name: "Buffalo Chicken Dip", price: "$5.50", description: "Home made buffalo chicken dip served with our nacho chips" },
      { name: "Mini Tacos", price: "$5.50", description: "10 mini chicken and cheese filled tacos with salsa or sour cream" },
      { name: "Buffalo Chicken Quesadilla", price: "$6.50", description: "Grilled buffalo chicken, cheese, peppers, and onions with salsa and sour cream" },
      { name: "Chicken Quesadilla", price: "$6.25", description: "Grilled buffalo chicken, cheese, peppers, and onions with salsa and sour cream" },
      { name: "Jalapeño Bites", price: "$6.50", description: "10 cream cheese filled jalapeño poppers with house made ranch" },
      { name: "Zucchini Planks", price: "$6.25", description: "5 large fried planks of zucchini with ranch or marinara" },
      { name: "Onion Rings", price: "$5.95", description: "10 large beer battered onion rings with your favorite dipping sauce" },
      { name: "Sampler Platter", price: "$9.50", description: "10 hot pepper cheese balls, 2 pizza logs, 2 mozzarella sticks, & 1 jumbo pretzel with ranch, cheese & marinara" },
    ],
  },
  {
    category: "Burgers",
    items: [
      { name: "Hamburger", price: "$5.75", description: "With lettuce, tomato, & mayo" },
      { name: "Cheeseburger", price: "$6.25", description: "With your choice of cheese, lettuce, tomato, & mayo" },
      { name: "BBQ Bacon", price: "$6.95", description: "With bacon, cheddar cheese, BBQ sauce, lettuce & tomato" },
      { name: "Rack Burger", price: "$6.95", description: "With pepper jack cheese, hot sauce, lettuce, tomato, & ring peppers" },
      { name: "Breakfast Burger", price: "$6.95", description: "With American cheese, fried egg, and bacon" },
      { name: "Mushroom Swiss", price: "$6.50", description: "With grilled onions, mushrooms, & Swiss cheese" },
      { name: "Greek Burger", price: "$6.50", description: "With house made greek sauce, onion, ketchup & mustard" },
      { name: "Big Muns", price: "$6.95", description: "With fried bologna, fried egg, American cheese, & mustard" },
      { name: "Pepper & Onion", price: "$6.75", description: "Sausage patty topped with grilled peppers & onions" },
      { name: "Black and Blue", price: "$6.75", description: "With blue cheese, lettuce, & tomato" },
    ],
  },
  {
    category: "Nachos & Baskets",
    items: [
      { name: "Traditional Nachos", price: "$3.75", description: "Nacho chips covered with cheese & jalapeños" },
      { name: "Taco Nachos", price: "$7.50", description: "Crispy chips covered in cheese, taco meat, lettuce, tomato, onion & taco sauce" },
      { name: "Fish and Chips", price: "$7.25", description: "3 pieces of cod with fries and tartar sauce" },
      { name: "Chicken Tenders & Fries", price: "$7.25", description: "3 juicy chicken strips with a large portion of fries" },
    ],
  },
  {
    category: "Salads",
    items: [
      { name: "Antipasto Salad", price: "$6.25", description: "Lettuce with ham, pepperoni, mozzarella, banana peppers, & tomato" },
      { name: "Grilled Chicken Salad", price: "$7.75", description: "With cheddar cheese, grilled chicken, tomato, red onion, and French fries" },
      { name: "Blackened Chicken Salad", price: "$6.25", description: "Blackened grilled chicken on lettuce with dry blue cheese, red onion, tomato, & French fries" },
    ],
  },
  {
    category: "Sweet Treats",
    items: [
      { name: "Deep Fried Twinkie", price: "$5.95", description: "2 Twinkies fried and topped with chocolate sauce. Strawberry sauce on the side" },
      { name: "Funnel Cake Fries", price: "$4.95", description: "Fried shoe string funnel cake fries topped with powdered sugar. Side of maple syrup" },
    ],
  },
];

export const weeklySchedule = [
  { day: "Tuesday", hours: "3 PM–2 AM", karaoke: "9:30 PM", host: "Preach" },
  { day: "Wednesday", hours: "3 PM–2 AM", karaoke: "9:30 PM", special: "Trivia 8–10 PM w/ JR" },
  { day: "Thursday", hours: "3 PM–2 AM", karaoke: "9:30 PM", host: "DJ Paul Amann" },
  { day: "Friday", hours: "3 PM–2 AM", karaoke: "9:30 PM", special: "Darts Tournament 7 PM" },
  { day: "Saturday", hours: "3 PM–2 AM", karaoke: "9:30 PM", host: "DJ Paul Amann" },
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
