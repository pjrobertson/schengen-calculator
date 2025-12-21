import { format, parseISO } from 'date-fns';
import type { Trip } from '@/lib/storage/types';

interface CalendarStatusInfoProps {
  remainingToday: number;
  currentTrip: Trip | null;
  remainingAfterTrip: number | null;
  resetDate: Date | null;
  totalTrips: number;
  totalDays: number;
}

export function CalendarStatusInfo({
  remainingToday,
  currentTrip,
  remainingAfterTrip,
  resetDate,
  totalTrips,
  totalDays,
}: CalendarStatusInfoProps) {
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

        {/* Trip Summary */}
        <div className="flex gap-6 mt-3 pt-3 border-t border-blue-200">
          <div className="text-sm font-medium text-blue-900">
            Total trips: {totalTrips}
          </div>
          <div className="text-sm font-medium text-blue-900">
            Total days: {totalDays}
          </div>
        </div>
      </div>
    </div>
  );
}
