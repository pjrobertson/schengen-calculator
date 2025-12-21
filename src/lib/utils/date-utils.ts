import {
  differenceInDays,
  startOfDay,
  startOfMonth,
  endOfMonth,
  parseISO,
  getDay,
  eachDayOfInterval
} from 'date-fns';

/**
 * Get the number of days between two dates (inclusive)
 */
export function getDaysBetween(start: Date, end: Date): number {
  const startDay = startOfDay(start);
  const endDay = startOfDay(end);
  const diff = differenceInDays(endDay, startDay);
  return Math.abs(diff) + 1; // +1 to make it inclusive
}

/**
 * Get all days in a month
 */
export function getDaysInMonth(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

/**
 * Get the first day of the week for a month (for calendar grid)
 * Returns 0-6 where 0 is the week start day
 * @param date - The date to get the month start weekday for
 * @param weekStartDay - The day the week starts on (1 = Monday, 7 = Sunday)
 */
export function getMonthStartWeekday(date: Date, weekStartDay: number = 7): number {
  const monthStart = startOfMonth(date);
  // getDay returns 0-6 where 0 is Sunday
  // Convert to 1-7 where 1 is Monday, 7 is Sunday
  const dayOfWeek = getDay(monthStart);
  const mondayBasedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
  return (mondayBasedDay - weekStartDay + 7) % 7;
}

/**
 * Get all dates in a range (inclusive) as JavaScript Date objects
 */
export function getDatesInRange(startISO: string, endISO: string): Date[] {
  const start = startOfDay(parseISO(startISO));
  const end = startOfDay(parseISO(endISO));
  return eachDayOfInterval({ start, end });
}
