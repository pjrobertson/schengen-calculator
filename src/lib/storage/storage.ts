import type { AppState, Trip } from './types';

const STORAGE_KEY = 'schengen-calculator-data';

const defaultState: AppState = {
  trips: [],
};

export const storage = {
  // Load app state from localStorage
  load(): AppState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return defaultState;

      const parsed = JSON.parse(data) as AppState;
      return parsed;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultState;
    }
  },

  // Save app state to localStorage
  save(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Get all trips
  getTrips(): Trip[] {
    return this.load().trips;
  },

  // Add a new trip
  addTrip(trip: Trip): void {
    const state = this.load();
    state.trips.push(trip);
    this.save(state);
  },

  // Remove a trip by ID
  removeTrip(id: string): void {
    const state = this.load();
    state.trips = state.trips.filter(trip => trip.id !== id);
    this.save(state);
  },

  // Update an existing trip
  updateTrip(id: string, updatedTrip: Partial<Trip>): void {
    const state = this.load();
    const index = state.trips.findIndex(trip => trip.id === id);
    if (index !== -1) {
      state.trips[index] = { ...state.trips[index], ...updatedTrip };
      this.save(state);
    }
  },

  // Clear all trips
  clear(): void {
    this.save(defaultState);
  },
};
