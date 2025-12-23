import { useState } from 'react';
import { isBefore, isEqual, format } from 'date-fns';
import type { Trip } from '../lib/storage/types';
import { storage } from '../lib/storage/storage';
import { getTotalTripDays } from '../lib/schengen/calculator';

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>(() => {
    // Initialize state with localStorage data
    return storage.getTrips();
  });

  // Add a new trip
  const addTrip = (startDate: Date, endDate: Date, name?: string) => {
    // Ensure start is before end
    const [start, end] = isBefore(startDate, endDate) || isEqual(startDate, endDate)
      ? [startDate, endDate]
      : [endDate, startDate];

    const startISO = format(start, 'yyyy-MM-dd');
    const endISO = format(end, 'yyyy-MM-dd');

    const newTrip: Trip = {
      id: crypto.randomUUID(),
      name,
      startDate: startISO,
      endDate: endISO,
      days: getTotalTripDays(startISO, endISO),
    };

    storage.addTrip(newTrip);
    setTrips(storage.getTrips());
    return newTrip;
  };

  // Remove a trip by ID
  const removeTrip = (id: string) => {
    storage.removeTrip(id);
    setTrips(storage.getTrips());
  };

  // Update a trip
  const updateTrip = (id: string, updates: Partial<Trip>) => {
    storage.updateTrip(id, updates);
    setTrips(storage.getTrips());
  };

  // Add an existing trip (for undo functionality)
  const addExistingTrip = (trip: Trip) => {
    storage.addTrip(trip);
    setTrips(storage.getTrips());
  };

  // Clear all trips
  const clearAllTrips = () => {
    storage.clear();
    setTrips([]);
  };

  return {
    trips,
    addTrip,
    addExistingTrip,
    removeTrip,
    updateTrip,
    clearAllTrips,
  };
}
