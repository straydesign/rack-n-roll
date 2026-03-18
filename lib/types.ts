import type { SanityImageSource } from '@sanity/image-url'

export interface SanityPageSeo {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImageSource
}

export interface SanitySiteSettings {
  // General
  bannerEnabled: boolean
  bannerText?: string
  businessName?: string
  phone?: string
  addressStreet?: string
  addressCity?: string
  addressState?: string
  addressZip?: string
  address?: string
  hours?: string
  closedDays?: string
  amenities?: string[]
  hiringEnabled?: boolean
  hiringText?: string
  // SEO & Social
  siteName?: string
  defaultOgImage?: SanityImageSource
  homeSeo?: SanityPageSeo
  eventsSeo?: SanityPageSeo
  menuSeo?: SanityPageSeo
  gallerySeo?: SanityPageSeo
  // JSON-LD
  cuisineType?: string
  jsonLdDescription?: string
}

export interface SanityDailySpecial {
  day: string
  sortOrder: number
  closed: boolean
  hours?: string
  specials?: string[]
  karaoke?: string
}

export interface SanityFlyer {
  image: SanityImageSource
  alt: string
  active: boolean
  sortOrder: number
}

export interface SanityCalendarEvent {
  title: string
  date: string
  time?: string
  description?: string
}

export interface SanityMenuItem {
  name: string
  price?: string
  description?: string
}

export interface SanityMenuCategory {
  category: string
  sortOrder: number
  items: SanityMenuItem[]
}

export interface SanityGalleryImage {
  image: SanityImageSource
  alt: string
  featured: boolean
  sortOrder: number
}
