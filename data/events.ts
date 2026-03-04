export interface Event {
  date: string;
  title: string;
  description: string;
}

// Edit this array to update events on the site.
// Set to an empty array [] to show the default "every night" message.
export const events: Event[] = [
  {
    date: "Every Friday",
    title: "Friday Night Karaoke Party",
    description: "Drink specials all night. Grab the mic and bring the house down.",
  },
  {
    date: "Every Saturday",
    title: "Saturday Sing-Along",
    description: "Our biggest night of the week. 20,000+ songs to choose from.",
  },
  {
    date: "Sundays",
    title: "Sunday Funday",
    description: "Laid-back vibes, cheap drinks, and all the karaoke you can handle.",
  },
];
