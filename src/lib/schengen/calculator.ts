import { startOfDay, subDays, parseISO, isAfter, isBefore, isEqual, addDays } from 'date-fns';
import type { Trip } from '../storage/types';
import { getDaysBetween } from '../utils/date-utils';

const SCHENGEN_MAX_DAYS = 90;
const SCHENGEN_WINDOW_DAYS = 180;

/**
 * Calculate total days spent in Schengen area for a specific date's 180-day window
 * The window is the 180 days BEFORE and including the given date
 */
export function calculateDaysInWindow(date: Date, trips: Trip[]): number {
  const endDate = startOfDay(date);
  const startDate = subDays(endDate, SCHENGEN_WINDOW_DAYS - 1);

  let totalDays = 0;

  for (const trip of trips) {
    const tripStart = parseISO(trip.startDate);
    const tripEnd = parseISO(trip.endDate);

    // Calculate the overlap between the trip and the 180-day window
    const overlapStart = isAfter(tripStart, startDate) ? tripStart : startDate;
    const overlapEnd = isBefore(tripEnd, endDate) ? tripEnd : endDate;

    // If there's an overlap, count the days
    if (isBefore(overlapStart, overlapEnd) || isEqual(overlapStart, overlapEnd)) {
      totalDays += getDaysBetween(overlapStart, overlapEnd);
    }
  }

  return totalDays;
}

/**
 * Calculate remaining days in Schengen for a specific date
 * Can return negative values if over the limit
 */
export function calculateRemainingDays(date: Date, trips: Trip[]): number {
  const daysUsed = calculateDaysInWindow(date, trips);
  return SCHENGEN_MAX_DAYS - daysUsed;
}

/**
 * Calculate the total number of days in a trip (inclusive)
 */
export function getTotalTripDays(startDate: string, endDate: string): number {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return getDaysBetween(start, end);
}

/**
 * Check if a date falls within any trip
 */
export function isDateInTrip(date: Date, trips: Trip[]): boolean {
  const checkDate = startOfDay(date);
  return getTripForDate(checkDate, trips) !== null;
}

/**
 * Get the trip that contains a specific date (if any)
 */
export function getTripForDate(date: Date, trips: Trip[]): Trip | null {
  const checkDate = startOfDay(date);
  for (const trip of trips) {
    const tripStart = startOfDay(parseISO(trip.startDate));
    const tripEnd = startOfDay(parseISO(trip.endDate));
    if ((isAfter(checkDate, tripStart) || isEqual(checkDate, tripStart)) &&
        (isBefore(checkDate, tripEnd) || isEqual(checkDate, tripEnd))) {
      return trip;
    }
  }
  return null;
}

/**
 * Check if there is any trip in the date range given
 */
export function getTripInDateRange(startDate: Date, endDate: Date, trips: Trip[]): Trip | null {
  const rangeStart = startOfDay(startDate);
  const rangeEnd = startOfDay(endDate);

  for (const trip of trips) {
    const tripStart = startOfDay(parseISO(trip.startDate));
    const tripEnd = startOfDay(parseISO(trip.endDate));

    // Check for overlap
    if (isBefore(tripStart, addDays(rangeEnd, 1)) && isAfter(tripEnd, subDays(rangeStart, 1))) {
      return trip;
    }
  }
  return null;
}
/**
 * Check if adding a new trip would violate the 90/180 rule
 * Returns true if the trip is valid, false if it would exceed limits
 */
export function isValidTrip(
  startDate: string,
  endDate: string,
  existingTrips: Trip[]
): boolean {
  const start = startOfDay(parseISO(startDate));
  const end = startOfDay(parseISO(endDate));

  // Check each day of the proposed trip
  let current = start;
  while (isBefore(current, end) || isEqual(current, end)) {
    // Calculate days used including this new trip
    const newTrip: Trip = {
      id: 'temp',
      startDate,
      endDate,
      days: getTotalTripDays(startDate, endDate),
    };
    const daysUsed = calculateDaysInWindow(current, [...existingTrips, newTrip]);

    if (daysUsed > SCHENGEN_MAX_DAYS) {
      return false;
    }

    current = addDays(current, 1);
  }

  return true;
}
