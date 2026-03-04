export interface Event {
  date: string;
  title: string;
  description: string;
}

// Edit this array to update events on the site.
// Set to an empty array [] to show the default "every night" message.
export const events: Event[] = [
  {
    date: "Every Wednesday",
    title: "$2 Pint Night",
    description: "$2 pints and $0.50 boneless wings. Kitchen opens early at noon.",
  },
  {
    date: "Every Friday",
    title: "Friday Night Karaoke Party",
    description: "Drink specials all night. Grab the mic and bring the house down.",
  },
  {
    date: "Every Saturday",
    title: "Saturday Sing-Along",
    description: "Our biggest night of the week. Pack the house, pick your song.",
  },
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
  { day: "Monday", hours: "3pm–2am", karaoke: "9:30pm–1:30am" },
  { day: "Tuesday", hours: "3pm–2am", karaoke: "9:30pm–1:30am" },
  { day: "Wednesday", hours: "12pm–2:30am", karaoke: "9:30pm–1:30am", special: "$2 pints · $0.50 boneless wings" },
  { day: "Thursday", hours: "3pm–2am", karaoke: "9:30pm–1:30am" },
  { day: "Friday", hours: "3pm–2am", karaoke: "9:30pm–1:30am" },
  { day: "Saturday", hours: "3pm–2am", karaoke: "9:30pm–1:30am" },
];
