import type { CalendarEvent } from './events'
import { allEvents, calendarEvents as defaultCalendarEvents } from './events'

export interface CalendarCell {
  date: number        // day of month (0 = empty cell)
  dateStr: string     // ISO string "2026-03-18" or ""
  isToday: boolean
  isCurrentMonth: boolean
}

/**
 * Build a 35-cell (5×7) or 42-cell (6×7) calendar grid for a given month.
 * Week starts on Sunday.
 */
export function getCalendarGrid(year: number, month: number): CalendarCell[] {
  const today = new Date()
  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate())

  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const totalCells = firstDay + daysInMonth > 35 ? 42 : 35
  const cells: CalendarCell[] = []

  for (let i = 0; i < totalCells; i++) {
    if (i < firstDay) {
      // Previous month trailing days
      const day = daysInPrevMonth - firstDay + i + 1
      const prevMonth = month === 0 ? 11 : month - 1
      const prevYear = month === 0 ? year - 1 : year
      cells.push({
        date: day,
        dateStr: formatDate(prevYear, prevMonth, day),
        isToday: false,
        isCurrentMonth: false,
      })
    } else if (i - firstDay < daysInMonth) {
      // Current month days
      const day = i - firstDay + 1
      const dateStr = formatDate(year, month, day)
      cells.push({
        date: day,
        dateStr,
        isToday: dateStr === todayStr,
        isCurrentMonth: true,
      })
    } else {
      // Next month leading days
      const day = i - firstDay - daysInMonth + 1
      const nextMonth = month === 11 ? 0 : month + 1
      const nextYear = month === 11 ? year + 1 : year
      cells.push({
        date: day,
        dateStr: formatDate(nextYear, nextMonth, day),
        isToday: false,
        isCurrentMonth: false,
      })
    }
  }

  return cells
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * Generate recurring CalendarEvent entries for a given month
 * from the allEvents patterns (weekly recurring events).
 */
export function generateRecurringEvents(year: number, month: number): CalendarEvent[] {
  const generated: CalendarEvent[] = []
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Day name → day number mapping (0=Sun)
  const dayMap: Record<string, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3,
    Thursday: 4, Friday: 5, Saturday: 6,
  }

  // Only generate from "special" category events (trivia, darts, karaoke).
  // "weekly" category (food/drink specials) is already shown in WeeklySpecials row.
  const specialEvents = allEvents.filter(e => e.category === 'special')

  for (const event of specialEvents) {
    // Parse "Every Wednesday", "Every Friday & Saturday", "Every Day"
    const dateStr = event.date.toLowerCase()

    if (dateStr === 'every day') {
      // Generate for Tue-Sat (open days)
      for (let d = 1; d <= daysInMonth; d++) {
        const dow = new Date(year, month, d).getDay()
        if (dow >= 2 && dow <= 6) { // Tue-Sat
          generated.push({
            date: formatDate(year, month, d),
            title: event.title,
            description: event.description,
            time: event.time,
          })
        }
      }
      continue
    }

    // Extract day names from patterns like "Every Friday & Saturday" or "Every Wednesday"
    const targetDays: number[] = []
    for (const [name, num] of Object.entries(dayMap)) {
      if (dateStr.includes(name.toLowerCase())) {
        targetDays.push(num)
      }
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, month, d).getDay()
      if (targetDays.includes(dow)) {
        generated.push({
          date: formatDate(year, month, d),
          title: event.title,
          description: event.description,
          time: event.time,
        })
      }
    }
  }

  return generated
}

/**
 * Get all events for a specific month — merges seed data + generated recurring events.
 * Seed data (calendarEvents) takes priority over generated events for the same date+title.
 */
export function getEventsForMonth(year: number, month: number, externalCalendarEvents?: CalendarEvent[]): CalendarEvent[] {
  const recurring = generateRecurringEvents(year, month)

  // Filter seed events to this month
  const calendarEvents = externalCalendarEvents && externalCalendarEvents.length > 0 ? externalCalendarEvents : defaultCalendarEvents
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const seed = calendarEvents.filter(e => e.date.startsWith(monthStr))

  // Seed events override recurring events for same date+time slot
  // This handles cases where seed uses different names (e.g. "Darts Blind Draw" vs "Darts Tournament")
  const seedKeys = new Set(seed.map(e => `${e.date}|${e.time ?? ''}`))
  const filtered = recurring.filter(e => !seedKeys.has(`${e.date}|${e.time ?? ''}`))

  return [...seed, ...filtered].sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Get events for a specific date string.
 */
export function getEventsForDate(dateStr: string, monthEvents: CalendarEvent[]): CalendarEvent[] {
  return monthEvents.filter(e => e.date === dateStr)
}

/**
 * Get month name from month index.
 */
export function getMonthName(month: number): string {
  return ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'][month]
}
