import { isToday, getDate } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Trip } from '@/lib/storage/types';
import { calculateRemainingDays, getTripForDate } from '@/lib/schengen/calculator';

interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  trips: Trip[];
  onClick: (date: Date) => void;
}

export function CalendarDay({ date, isCurrentMonth, isSelected, trips, onClick }: CalendarDayProps) {
  const remainingDays = calculateRemainingDays(date, trips);
  const isTodayDate = isToday(date);
  const isOverLimit = remainingDays < 0;
  const tripForDate = getTripForDate(date, trips);
  const isInTrip = tripForDate !== null;
  const tripIcon = tripForDate?.icon;

  return (
    <button
      onClick={() => onClick(date)}
      className={cn(
        'relative flex flex-col items-center justify-center p-2 min-h-[70px] border transition-colors',
        'hover:bg-opacity-80',
        // Base border - will be overridden by today
        'border-gray-200',
        // Background colors based on state
        !isCurrentMonth && 'text-gray-300 bg-gray-50',
        isCurrentMonth && !isSelected && !isInTrip && 'bg-white hover:bg-gray-50',
        isSelected && 'bg-blue-100 border-blue-400',
        isInTrip && !isOverLimit && 'bg-green-100 border-green-400',
        isInTrip && isOverLimit && 'bg-red-100 border-red-400',
        // Today styling - blue border but keep the background from above
        isTodayDate && 'border-blue-500 border-2 shadow-sm'
      )}
    >
      <div className="absolute top-0 left-1">
        {tripIcon && (
          <span className="text-md">
            {tripIcon}
          </span>
        )}
      </div>
      <div className={cn(
        'text-lg font-bold',
        !isCurrentMonth && 'text-gray-300'
      )}>
        {getDate(date)}
      </div>
      <div className={cn(
        'text-xs mt-1 font-medium',
        !isCurrentMonth && 'text-gray-300',
        isCurrentMonth && !isOverLimit && 'text-gray-500',
        isCurrentMonth && isOverLimit && 'text-red-600'
      )}>
        {remainingDays}d
      </div>
    </button>
  );
}
