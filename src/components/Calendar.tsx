import { useState, useMemo, useEffect } from 'react';
import {
  startOfDay,
  startOfMonth,
  subMonths,
  addMonths,
  addDays,
  parseISO,
  format,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDay } from '@/components/CalendarDay';
import { CalendarLegend } from '@/components/CalendarLegend';
import { CalendarStatusInfo } from '@/components/CalendarStatusInfo';
import { TripRow } from '@/components/TripRow';
import type { Trip } from '@/lib/storage/types';
import { getDaysInMonth, getMonthStartWeekday, getDatesInRange } from '@/lib/utils/date-utils';
import { calculateRemainingDays, getTripForDate } from '@/lib/schengen/calculator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CalendarProps {
  trips: Trip[];
  selectedStart: Date | null;
  onDateClick: (date: Date) => void;
  onUpdateTrip?: (id: string, updates: Partial<Trip>) => void;
  onRemoveTrip?: (id: string) => void;
}

// Configuration: Week start day (1 = Monday, 7 = Sunday)
// TODO: Move to user settings in the future
const WEEK_START_DAY = 1; // Monday

// Generate weekdays array dynamically based on week start day
const ALL_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAYS = (() => {
  const startIndex = WEEK_START_DAY - 1; // Convert from 1-7 to 0-6
  return [...ALL_WEEKDAYS.slice(startIndex), ...ALL_WEEKDAYS.slice(0, startIndex)];
})();

export function Calendar({ trips, selectedStart, onDateClick, onUpdateTrip, onRemoveTrip }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Sync selectedTrip with the latest trip data from trips prop
  useEffect(() => {
    if (selectedTrip) {
      const updatedTrip = trips.find(trip => trip.id === selectedTrip.id);
      if (updatedTrip) {
        setSelectedTrip(updatedTrip);
      } else {
        // Trip was deleted
        setSelectedTrip(null);
        setDialogOpen(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trips]);

  // Calculate status for today
  const todayStatus = useMemo(() => {
    const today = startOfDay(new Date());
    const remainingToday = calculateRemainingDays(today, trips);
    const currentTrip = getTripForDate(today, trips);

    let remainingAfterTrip: number | null = null;
    let resetDate: Date | null = null;

    if (currentTrip) {
      const tripEndDate = parseISO(currentTrip.endDate);
      const dayAfterTrip = addDays(tripEndDate, 1);
      remainingAfterTrip = calculateRemainingDays(dayAfterTrip, trips);
    }

    // Find reset date if negative
    const needsReset = remainingToday < 0 || (remainingAfterTrip !== null && remainingAfterTrip < 0);
    if (needsReset) {
      // Start checking from today (or day after trip if in a trip)
      let checkDate = currentTrip
        ? addDays(parseISO(currentTrip.endDate), 1)
        : today;

      // Look up to 365 days ahead for when it resets
      for (let i = 0; i < 365; i++) {
        const remaining = calculateRemainingDays(checkDate, trips);
        if (remaining > 0) {
          resetDate = checkDate;
          break;
        }
        checkDate = addDays(checkDate, 1);
      }
    }

    return {
      remainingToday,
      currentTrip,
      remainingAfterTrip,
      resetDate,
    };
  }, [trips]);

  const daysInMonth = getDaysInMonth(currentMonth);
  const startWeekday = getMonthStartWeekday(currentMonth, WEEK_START_DAY);

  // Add empty cells for days before the first of the month
  const emptyDaysStart = Array.from({ length: startWeekday }, (_, i) => {
    const emptyDate = addDays(currentMonth, -(startWeekday - i));
    return { date: emptyDate, isCurrentMonth: false };
  });

  // Create calendar days
  const calendarDays = [
    ...emptyDaysStart,
    ...daysInMonth.map(date => ({ date, isCurrentMonth: true })),
  ];

  // Add empty cells to complete the last week
  const remainingDays = 7 - (calendarDays.length % 7);
  if (remainingDays < 7) {
    const lastDate = daysInMonth[daysInMonth.length - 1];
    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        date: addDays(lastDate, i),
        isCurrentMonth: false,
      });
    }
  }

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    setCurrentMonth(startOfMonth(new Date()));
  };

  const handleDateClickInternal = (date: Date) => {
    // Check if this date has a trip
    const tripForDate = getTripForDate(date, trips);

    if (tripForDate) {
      // Open dialog with trip details
      setSelectedTrip(tripForDate);
      setDialogOpen(true);
    } else {
      // Normal date selection for creating a trip
      onDateClick(date);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTrip(null);
  };

  const handleTripUpdate = (updates: Partial<Trip>) => {
    if (selectedTrip && onUpdateTrip) {
      onUpdateTrip(selectedTrip.id, updates);
      // Keep dialog open so user can see the update
    }
  };

  const handleTripDelete = () => {
    if (selectedTrip && onRemoveTrip) {
      onRemoveTrip(selectedTrip.id);
      handleCloseDialog();
    }
  };

  // Calculate disabled dates for the selected trip (all other trips' dates)
  const disabledDatesForSelectedTrip = useMemo(() => {
    if (!selectedTrip) return [];

    const allDisabledDates: Date[] = [];
    trips.forEach((otherTrip) => {
      if (otherTrip.id !== selectedTrip.id) {
        const dates = getDatesInRange(otherTrip.startDate, otherTrip.endDate);
        allDisabledDates.push(...dates);
      }
    });
    return allDisabledDates;
  }, [trips, selectedTrip]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Today
          </button>
        </div>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {calendarDays.map(({ date, isCurrentMonth }, index) => (
          <CalendarDay
            key={index}
            date={date}
            isCurrentMonth={isCurrentMonth}
            isSelected={selectedStart ? isSameDay(date, selectedStart) : false}
            trips={trips}
            onClick={handleDateClickInternal}
          />
        ))}
      </div>

      <CalendarLegend />

      <CalendarStatusInfo
        remainingToday={todayStatus.remainingToday}
        currentTrip={todayStatus.currentTrip}
        remainingAfterTrip={todayStatus.remainingAfterTrip}
        resetDate={todayStatus.resetDate}
        totalTrips={trips.length}
        totalDays={trips.reduce((sum, trip) => sum + trip.days, 0)}
      />

      {/* Trip Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trip Details</DialogTitle>
          </DialogHeader>
          {selectedTrip && (
            <TripRow
              trip={selectedTrip}
              disabledDates={disabledDatesForSelectedTrip}
              onUpdate={handleTripUpdate}
              onDelete={handleTripDelete}
              layout="vertical"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
