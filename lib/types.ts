import type { SanityImageSource } from '@sanity/image-url'

export interface SanitySiteSettings {
  bannerEnabled: boolean
  bannerText?: string
  address?: string
  phone?: string
  hours?: string
  closedDays?: string
  amenities?: string[]
  hiringEnabled?: boolean
  hiringText?: string
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
