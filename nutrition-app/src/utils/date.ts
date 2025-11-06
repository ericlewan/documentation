import { format, isWeekend as dateFnsIsWeekend, parseISO } from 'date-fns'

/**
 * Format date for database storage (YYYY-MM-DD)
 */
export function formatDateForDB(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd')
}

/**
 * Check if a date is a weekend (Friday, Saturday, Sunday)
 * Weekend banking applies to Fri-Sun
 */
export function isWeekend(date: Date = new Date()): boolean {
  const dayOfWeek = date.getDay()
  // 5 = Friday, 6 = Saturday, 0 = Sunday
  return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0
}

/**
 * Get time of day category
 */
export function getTimeOfDay(date: Date = new Date()): string {
  const hour = date.getHours()

  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  if (hour < 21) return 'evening'
  return 'night'
}

/**
 * Format date for display
 */
export function formatDateForDisplay(dateStr: string): string {
  const date = parseISO(dateStr)
  return format(date, 'EEEE, MMMM d, yyyy')
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(date: Date = new Date()): string {
  const timeOfDay = getTimeOfDay(date)

  switch (timeOfDay) {
    case 'morning':
      return 'Good morning'
    case 'afternoon':
      return 'Good afternoon'
    case 'evening':
      return 'Good evening'
    case 'night':
      return 'Good evening'
    default:
      return 'Hello'
  }
}
