import { useState } from 'react';

export function useDateSelection() {
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);

  const handleDateClick = (date: Date, onTripCreate: (start: Date, end: Date) => void) => {
    if (!selectedStart) {
      // First click - select start date
      setSelectedStart(date);
    } else {
      // Second click - create trip and reset
      onTripCreate(selectedStart, date);
      setSelectedStart(null);
    }
  };

  const clearSelection = () => {
    setSelectedStart(null);
  };

  return {
    selectedStart,
    handleDateClick,
    clearSelection,
  };
}
