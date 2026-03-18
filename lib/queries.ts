import { sanityClient } from './sanity'
import type {
  SanitySiteSettings,
  SanityDailySpecial,
  SanityFlyer,
  SanityCalendarEvent,
  SanityMenuCategory,
  SanityGalleryImage,
} from './types'

const REVALIDATE = 60 // seconds

async function fetchSanity<T>(query: string, fallback: T): Promise<T> {
  try {
    const result = await sanityClient.fetch<T>(query, {}, { next: { revalidate: REVALIDATE } })
    return result ?? fallback
  } catch {
    return fallback
  }
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return fetchSanity<SanitySiteSettings | null>(
    `*[_type == "siteSettings"][0]{
      bannerEnabled,
      bannerText,
      address,
      phone,
      hours,
      closedDays,
      amenities,
      hiringEnabled,
      hiringText
    }`,
    null
  )
}

export async function getDailySpecials(): Promise<SanityDailySpecial[]> {
  return fetchSanity<SanityDailySpecial[]>(
    `*[_type == "dailySpecial"] | order(sortOrder asc){
      day,
      sortOrder,
      closed,
      hours,
      specials,
      karaoke
    }`,
    []
  )
}

export async function getFlyers(): Promise<SanityFlyer[]> {
  return fetchSanity<SanityFlyer[]>(
    `*[_type == "flyer" && active == true] | order(sortOrder asc){
      image,
      alt,
      active,
      sortOrder
    }`,
    []
  )
}

export async function getCalendarEvents(): Promise<SanityCalendarEvent[]> {
  return fetchSanity<SanityCalendarEvent[]>(
    `*[_type == "calendarEvent"] | order(date asc){
      title,
      date,
      time,
      description
    }`,
    []
  )
}

export async function getMenuCategories(): Promise<SanityMenuCategory[]> {
  return fetchSanity<SanityMenuCategory[]>(
    `*[_type == "menuCategory"] | order(sortOrder asc){
      category,
      sortOrder,
      items[]{
        name,
        price,
        description
      }
    }`,
    []
  )
}

export async function getGalleryImages(): Promise<SanityGalleryImage[]> {
  return fetchSanity<SanityGalleryImage[]>(
    `*[_type == "galleryImage"] | order(sortOrder asc){
      image,
      alt,
      featured,
      sortOrder
    }`,
    []
  )
}
