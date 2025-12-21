import { format, parseISO, startOfDay, subDays, eachDayOfInterval } from 'date-fns';
import type { Trip } from '@/lib/storage/types';

interface CalendarStatusInfoProps {
  remainingToday: number;
  currentTrip: Trip | null;
  remainingAfterTrip: number | null;
  resetDate: Date | null;
  trips: Trip[];
}

export function CalendarStatusInfo({
  remainingToday,
  currentTrip,
  remainingAfterTrip,
  resetDate,
  trips,
}: CalendarStatusInfoProps) {
  // Compute totals for the last 180 days (including today)
  const today = startOfDay(new Date());
  const windowStart = subDays(today, 179);
  const windowEnd = today;

  let tripsInWindow = 0;
  const dayKeys = new Set<string>();

  trips.forEach((trip) => {
    const tripStart = startOfDay(parseISO(trip.startDate));
    const tripEnd = startOfDay(parseISO(trip.endDate));

    const overlapStart = new Date(Math.max(tripStart.getTime(), windowStart.getTime()));
    const overlapEnd = new Date(Math.min(tripEnd.getTime(), windowEnd.getTime()));

    if (overlapStart.getTime() <= overlapEnd.getTime()) {
      tripsInWindow += 1;
      const days = eachDayOfInterval({ start: overlapStart, end: overlapEnd });
      days.forEach((d) => dayKeys.add(format(d, 'yyyy-MM-dd')));
    }
  });

  const daysInWindow = dayKeys.size;

  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="space-y-2">
        <p className={`font-medium ${remainingToday < 0 ? 'text-red-700' : 'text-blue-900'}`}>
          As of today, you have {remainingToday} days remaining in the Schengen area.
        </p>

        {currentTrip && remainingAfterTrip !== null && (
          <p className={`text-sm ${remainingAfterTrip < 0 ? 'text-red-700' : 'text-blue-800'}`}>
            After this trip ends on {format(parseISO(currentTrip.endDate), 'MMM d, yyyy')},
            you will have {remainingAfterTrip} days left.
          </p>
        )}

        {resetDate && (
          <p className="text-sm text-red-700 font-medium mt-3 pt-3 border-t border-red-200">
            ⚠️ You have overstayed your 90 days. It will reset on{' '}
            {format(resetDate, 'MMM d, yyyy')} and you can return then.
          </p>
        )}

        {/* Trip Summary (last 180 days) */}
        <div className="flex gap-6 mt-3 pt-3 border-t border-blue-200 items-center">
          <div className="text-sm font-medium text-blue-900">In the last 180 days:</div>
          <div className="text-sm font-medium text-blue-900">Total trips: {tripsInWindow}</div>
          <div className="text-sm font-medium text-blue-900">Total days: {daysInWindow}</div>
        </div>
      </div>
    </div>
  );
}
