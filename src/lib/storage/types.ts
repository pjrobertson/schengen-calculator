export interface Trip {
  id: string;
  name?: string;     // Optional name/description of the trip
  icon?: string;     // Optional emoji icon for the trip
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
  days: number;      // Total days in Schengen area (inclusive)
}

export interface AppState {
  trips: Trip[];
}
