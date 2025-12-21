import { format } from 'date-fns';
import { Calendar } from './components/Calendar';
import { TripList } from './components/TripList';
import { useTrips } from './hooks/useTrips';
import { useDateSelection } from './hooks/useDateSelection';

function App() {
  const { trips, addTrip, addExistingTrip, removeTrip, updateTrip } = useTrips();
  const { selectedStart, handleDateClick, clearSelection } = useDateSelection();

  const handleTripCreate = (start: Date, end: Date) => {
    addTrip(start, end);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Schengen 90/180 Calculator
          </h1>
          <p className="text-gray-600">
            Track your stays in the Schengen area and calculate remaining days
          </p>
          {selectedStart && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
              <span className="text-sm font-medium">
                Start date selected: {format(selectedStart, 'MMM d, yyyy')}
              </span>
              <button
                onClick={clearSelection}
                className="text-sm underline hover:no-underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="mb-12">
          <Calendar
            trips={trips}
            selectedStart={selectedStart}
            onDateClick={(date) => handleDateClick(date, handleTripCreate)}
            onUpdateTrip={updateTrip}
            onRemoveTrip={removeTrip}
          />
        </div>

        {/* Trip List */}
        <div>
          <TripList trips={trips} onRemoveTrip={removeTrip} onUpdateTrip={updateTrip} onAddTrip={addExistingTrip} />
        </div>
      </div>
    </div>
  );
}

export default App;
