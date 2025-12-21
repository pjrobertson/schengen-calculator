import { useState, useMemo } from 'react';
import { parseISO, format } from 'date-fns';
import { Undo, Plus, X, Check } from 'lucide-react';
import type { Trip } from '@/lib/storage/types';
import { getTotalTripDays } from '@/lib/schengen/calculator';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { getDatesInRange } from '@/lib/utils/date-utils';
import { TripRow } from '@/components/TripRow';
import { EmojiPickerPopover } from '@/components/ui/emoji-picker';

interface TripListProps {
  trips: Trip[];
  onRemoveTrip: (id: string) => void;
  onUpdateTrip: (id: string, updates: Partial<Trip>) => void;
  onAddTrip: (trip: Trip) => void;
}

export function TripList({ trips, onRemoveTrip, onUpdateTrip, onAddTrip }: TripListProps) {
  const [undoStack, setUndoStack] = useState<Trip[]>([]);

  // New trip state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState<string>('');
  const [newIcon, setNewIcon] = useState<string>('');
  const [newStartDate, setNewStartDate] = useState<string>('');
  const [newEndDate, setNewEndDate] = useState<string>('');

  // Calculate disabled dates for new trip (all dates from all trips)
  const disabledDatesForNewTrip = useMemo(() => {
    const allDisabledDates: Date[] = [];
    trips.forEach((trip) => {
      const dates = getDatesInRange(trip.startDate, trip.endDate);
      allDisabledDates.push(...dates);
    });
    return allDisabledDates;
  }, [trips]);

  const handleDeleteTrip = (trip: Trip) => {
    // Push the deleted trip to the undo stack
    setUndoStack((prev) => [...prev, trip]);

    // Actually delete the trip
    onRemoveTrip(trip.id);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      // Pop the last deleted trip from the undo stack
      const lastDeleted = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);

      // Restore the trip
      onAddTrip(lastDeleted);

      // Update the undo stack
      setUndoStack(newUndoStack);
    }
  };

  const handleStartAddTrip = () => {
    setIsAdding(true);
    setNewName('');
    setNewIcon('');
    // Set default dates to today
    const today = format(new Date(), 'yyyy-MM-dd');
    setNewStartDate(today);
    setNewEndDate(today);
  };

  const handleSaveNewTrip = () => {
    if (!newStartDate || !newEndDate) {
      alert('Please enter both start and end dates');
      return;
    }

    const days = getTotalTripDays(newStartDate, newEndDate);
    const newTrip: Trip = {
      id: crypto.randomUUID(),
      name: newName || undefined,
      icon: newIcon || undefined,
      startDate: newStartDate,
      endDate: newEndDate,
      days,
    };

    onAddTrip(newTrip);
    setIsAdding(false);
    setNewName('');
    setNewIcon('');
    setNewStartDate('');
    setNewEndDate('');
  };

  const handleCancelNewTrip = () => {
    setIsAdding(false);
    setNewName('');
    setNewIcon('');
    setNewStartDate('');
    setNewEndDate('');
  };

  // Sort trips by start date (oldest first)
  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => {
      return parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime();
    });
  }, [trips]);

  // Calculate disabled dates for each trip (memoized to avoid recalculation)
  const tripsWithDisabledDates = useMemo(() => {
    return sortedTrips.map((trip) => {
      const allDisabledDates: Date[] = [];
      trips.forEach((otherTrip) => {
        if (otherTrip.id !== trip.id) {
          const dates = getDatesInRange(otherTrip.startDate, otherTrip.endDate);
          allDisabledDates.push(...dates);
        }
      });
      return {
        trip,
        disabledDates: allDisabledDates,
      };
    });
  }, [trips, sortedTrips]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with Plus and Undo buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">All Trips</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartAddTrip}
            disabled={isAdding}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-green-500 cursor-pointer hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            title="Add trip"
          >
            <Plus className="w-4 h-4" />
            Add Trip
          </button>
          {undoStack.length > 0 && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
              title="Undo delete"
            >
              <Undo className="w-4 h-4" />
              Undo
            </button>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table header */}
        {(trips.length > 0 || isAdding) && (
        <div className="grid grid-cols-[1.5fr_2fr_60px_36px] sm:grid-cols-[0.7fr_1.2fr_0.6fr_36px] gap-2 sm:gap-4 bg-gray-50 px-2 sm:px-4 py-3 font-medium text-xs sm:text-sm border-b border-gray-200">
          <div>Name</div>
          <div>Date Range</div>
          <div className="text-center">
            <span className="sm:hidden">Days</span>
            <span className="hidden sm:inline">Days in Schengen</span>
          </div>
          <div></div>
        </div>
        )}

        {/* New trip row */}
        {isAdding && (
          <div className="grid grid-cols-[1.5fr_2fr_60px_36px] sm:grid-cols-[0.7fr_1.2fr_0.6fr_36px] gap-2 sm:gap-4 px-2 sm:px-4 py-3 border-b border-gray-200 bg-blue-50">
            {/* Name field with icon */}
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <EmojiPickerPopover
                value={newIcon}
                onChange={(emoji) => setNewIcon(emoji)}
              />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveNewTrip();
                  if (e.key === 'Escape') handleCancelNewTrip();
                }}
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm min-w-0"
                placeholder="Trip name (optional)"
                autoFocus
              />
            </div>

            {/* Date Range Picker */}
            <DateRangePicker
              startDate={newStartDate}
              endDate={newEndDate}
              onRangeChange={(start, end) => {
                setNewStartDate(start);
                setNewEndDate(end);
              }}
              triggerClassName="w-full min-w-0"
              disabledDates={disabledDatesForNewTrip}
              trips={trips}
            >
              <div className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded bg-white hover:border-blue-500 transition-colors cursor-pointer min-w-0">
                <div className="flex justify-between items-center gap-1 sm:gap-2">
                  <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                    <span className="hidden sm:inline">{format(parseISO(newStartDate), 'MMM d, yyyy')}</span>
                    <span className="sm:hidden">{format(parseISO(newStartDate), 'M/d/yy')}</span>
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm">→</span>
                  <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                    <span className="hidden sm:inline">{format(parseISO(newEndDate), 'MMM d, yyyy')}</span>
                    <span className="sm:hidden">{format(parseISO(newEndDate), 'M/d/yy')}</span>
                  </span>
                </div>
              </div>
            </DateRangePicker>

            {/* Days display */}
            <div className="font-medium text-gray-500 text-sm sm:text-base text-center py-1.5">
              {newStartDate && newEndDate ? getTotalTripDays(newStartDate, newEndDate) : '-'}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <button
                onClick={handleSaveNewTrip}
                className="p-1 sm:p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                aria-label="Save trip"
              >
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={handleCancelNewTrip}
                className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 cursor-pointer rounded transition-colors"
                aria-label="Cancel"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Table body */}
        {trips.length === 0 && !isAdding && (
          <div className="text-center py-8 text-gray-500">
          No trips added yet. Click two dates on the calendar or use the "Add Trip" button above.
        </div>
        )}
        {tripsWithDisabledDates.map(({ trip, disabledDates }) => (
          <TripRow
            key={trip.id}
            trip={trip}
            disabledDates={disabledDates}
            onUpdate={(updates) => onUpdateTrip(trip.id, updates)}
            onDelete={() => handleDeleteTrip(trip)}
            layout="horizontal"
            trips={trips}
          />
        ))}

      </div>

    </div>
  );
}
