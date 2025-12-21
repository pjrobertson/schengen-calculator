import * as React from 'react';
import { parseISO, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  onRangeChange: (startDate: string, endDate: string) => void;
  className?: string;
  triggerClassName?: string;
  children?: React.ReactNode;
  disabledDates?: Date[]; // Array of dates to disable
}

export function DateRangePicker({
  startDate,
  endDate,
  onRangeChange,
  className,
  triggerClassName,
  children,
  disabledDates = [],
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [isFirstClick, setIsFirstClick] = React.useState(true);

  // Convert ISO strings to Date objects for initial value
  const initialRange = React.useMemo(() => {
    const from = parseISO(startDate);
    const to = parseISO(endDate);
    return { from, to };
  }, [startDate, endDate]);

  // Initialize date range when popover opens, reset state when it closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setDateRange(initialRange);
      setIsFirstClick(true);
    } else {
      // Reset to first click mode when closing
      setIsFirstClick(true);
    }
  };

  const handleSelect = (_nextRange: DateRange | undefined, selectedDay: Date) => {
    setDateRange((prev) => {
      if (isFirstClick) {
        // First click: Set 'from' date to the clicked date
        setIsFirstClick(false);

        const newFrom = selectedDay;
        const existingTo = prev?.to;

        // If new 'from' is after existing 'to', clear 'to'
        if (existingTo && newFrom > existingTo) {
          return { from: newFrom, to: undefined };
        }

        // Otherwise keep the existing 'to' date
        return { from: newFrom, to: existingTo };
      } else {
        // Second click
        setIsFirstClick(true);

        const existingFrom = prev?.from;

        if (!existingFrom) {
          // Shouldn't happen, but handle it
          return { from: selectedDay, to: undefined };
        }

        if (selectedDay < existingFrom) {
          // If clicked date is before 'from', extend 'from' back to this date
          const newRange = { from: selectedDay, to: existingFrom };

          // Call onRangeChange when both dates are selected
          const startISO = format(newRange.from, 'yyyy-MM-dd');
          const endISO = format(newRange.to, 'yyyy-MM-dd');
          onRangeChange(startISO, endISO);

          return newRange;
        } else {
          // If clicked date is equal to or after 'from', set it as 'to'
          const newRange = { from: existingFrom, to: selectedDay };

          // Call onRangeChange when both dates are selected
          const startISO = format(newRange.from, 'yyyy-MM-dd');
          const endISO = format(newRange.to, 'yyyy-MM-dd');
          onRangeChange(startISO, endISO);

          return newRange;
        }
      }
    });
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className={cn('cursor-pointer', triggerClassName)}>
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', className)} align="start">
        <div className={isFirstClick ? 'first-click-mode' : 'second-click-mode'}>
          <style>{`
            
            .first-click-mode .rdp-range_end button {
              background: #666666;
            }
            .second-click-mode .rdp-range_start button {
              background: #666666;
            }
            .rdp-day button:hover {
              border: 2px solid #3b82f6;
              border-radius: 0.375rem;
            }
          `}</style>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            defaultMonth={initialRange.from}
            disabled={disabledDates}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
