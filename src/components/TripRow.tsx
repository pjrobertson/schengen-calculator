import { useState, useImperativeHandle, forwardRef } from 'react';
import { parseISO } from 'date-fns';
import { Trash2, Edit2, Check } from 'lucide-react';
import type { Trip } from '@/lib/storage/types';
import { getTotalTripDays } from '@/lib/schengen/calculator';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { EmojiPickerPopover } from '@/components/ui/emoji-picker';
import { formatLocaleDate } from '@/lib/utils/date-format';

interface TripRowProps {
  trip: Trip;
  disabledDates: Date[];
  onUpdate: (updates: Partial<Trip>) => void;
  onDelete: () => void;
  layout?: 'horizontal' | 'vertical';
  trips: Trip[];
}

export interface TripRowHandle {
  finalizePendingEdits: () => void;
}

export const TripRow = forwardRef<TripRowHandle, TripRowProps>(({
  trip,
  disabledDates,
  onUpdate,
  onDelete,
  layout = 'horizontal',
  trips,
}, ref) => {
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');

  const startDate = parseISO(trip.startDate);
  const endDate = parseISO(trip.endDate);

  const handleStartEditName = () => {
    setEditingName(true);
    setEditName(trip.name || '');
  };

  const handleSaveNameEdit = () => {
    onUpdate({ name: editName });
    setEditingName(false);
    setEditName('');
  };

  const handleCancelNameEdit = () => {
    setEditingName(false);
    setEditName('');
  };

  // Expose method to finalize any pending edits
  useImperativeHandle(ref, () => ({
    finalizePendingEdits: () => {
      if (editingName) {
        handleSaveNameEdit();
      }
    }
  }));

  const handleDateRangeChange = (newStartDate: string, newEndDate: string) => {
    const days = getTotalTripDays(newStartDate, newEndDate);
    onUpdate({
      startDate: newStartDate,
      endDate: newEndDate,
      days,
    });
  };

  if (layout === 'vertical') {
    return (
      <div className="space-y-4">
        {/* Name field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <div className="flex items-center gap-2">
            {/* Emoji Icon */}
            <EmojiPickerPopover
              value={trip.icon}
              onChange={(emoji) => onUpdate({ icon: emoji })}
            />

            {editingName ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveNameEdit();
                    if (e.key === 'Escape') handleCancelNameEdit();
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Trip name"
                  autoFocus
                />
                <button
                  onClick={handleSaveNameEdit}
                  className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                  aria-label="Save name"
                >
                  <Check className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <span
                  onClick={handleStartEditName}
                  className="flex-1 text-gray-900 px-3 py-2 cursor-pointer hover:bg-gray-100 rounded transition-colors"
                >
                  {trip.name || <span className="text-gray-400 italic">No name</span>}
                </span>
                <button
                  onClick={handleStartEditName}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Edit name"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <DateRangePicker
            startDate={trip.startDate}
            endDate={trip.endDate}
            onRangeChange={handleDateRangeChange}
            triggerClassName="w-full"
            disabledDates={disabledDates}
            trips={trips.filter(t => t.id !== trip.id)}
          >
            <div className="px-3 py-2 border border-gray-300 rounded bg-white hover:border-blue-500 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                <span className="font-medium">{formatLocaleDate(startDate, 'medium')}</span>
                <span className="text-gray-400">→</span>
                <span className="font-medium">{formatLocaleDate(endDate, 'medium')}</span>
              </div>
            </div>
          </DateRangePicker>
        </div>

        {/* Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Days in Schengen</label>
          <div className="px-3 py-2 bg-gray-50 rounded font-medium text-gray-900">
            {trip.days} days
          </div>
        </div>
      </div>
    );
  }

  // Horizontal layout (for table)
  return (
    <div className="grid grid-cols-[1.5fr_2fr_60px_36px] sm:grid-cols-[0.7fr_1.2fr_0.6fr_36px] gap-2 sm:gap-4 px-2 sm:px-4 py-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
      {/* Name column with inline editing */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {/* Emoji Icon */}
        <EmojiPickerPopover
          value={trip.icon}
          onChange={(emoji) => onUpdate({ icon: emoji })}
        />

        {editingName ? (
          <>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNameEdit();
                if (e.key === 'Escape') handleCancelNameEdit();
              }}
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
              placeholder="Trip name"
              autoFocus
            />
            <button
              onClick={handleSaveNameEdit}
              className="p-1 sm:p-1.5 text-green-600 hover:bg-green-50 cursor-pointer rounded transition-colors shrink-0"
              aria-label="Save name"
            >
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </>
        ) : (
          <>
            <span
              onClick={handleStartEditName}
              className="flex-1 text-gray-700 text-sm sm:text-base truncate cursor-pointer hover:bg-gray-100 rounded px-1 transition-colors"
            >
              {trip.name || <span className="text-gray-400 italic">No name</span>}
            </span>
            <button
              onClick={handleStartEditName}
              className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer hover:bg-gray-100 rounded transition-colors shrink-0"
              aria-label="Edit name"
            >
              <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </>
        )}
      </div>

      {/* Date Range - clickable to open date picker */}
      <DateRangePicker
        startDate={trip.startDate}
        endDate={trip.endDate}
        onRangeChange={handleDateRangeChange}
        triggerClassName="w-full min-w-0"
        disabledDates={disabledDates}
        trips={trips.filter(t => t.id !== trip.id)}
      >
        <div className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded bg-white hover:border-blue-500 transition-colors cursor-pointer min-w-0">
          <div className="flex justify-between items-center gap-1 sm:gap-2">
            <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
              <span className="hidden sm:inline">{formatLocaleDate(startDate, 'medium')}</span>
              <span className="sm:hidden">{formatLocaleDate(startDate, 'short')}</span>
            </span>
            <span className="text-gray-400 text-xs sm:text-sm">→</span>
            <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
              <span className="hidden sm:inline">{formatLocaleDate(endDate, 'medium')}</span>
              <span className="sm:hidden">{formatLocaleDate(endDate, 'short')}</span>
            </span>
          </div>
        </div>
      </DateRangePicker>

      <div className="font-medium text-sm sm:text-base text-center py-1.5">{trip.days}</div>

      <button
        onClick={onDelete}
        className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
        aria-label="Delete trip"
      >
        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
});

TripRow.displayName = 'TripRow';
