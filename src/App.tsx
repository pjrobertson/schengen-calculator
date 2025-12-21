import { useState } from 'react';
import { format } from 'date-fns';
import { Info } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { TripList } from './components/TripList';
import { AboutDialog } from './components/AboutDialog';
import { useTrips } from './hooks/useTrips';
import { useDateSelection } from './hooks/useDateSelection';

function App() {
  const { trips, addTrip, addExistingTrip, removeTrip, updateTrip } = useTrips();
  const { selectedStart, handleDateClick, clearSelection } = useDateSelection();
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleTripCreate = (start: Date, end: Date) => {
    addTrip(start, end);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Free Schengen Calculator - Track Your 90/180 Visa Days
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-4 max-w-3xl mx-auto">
            Calculate remaining days in the Schengen Area with this free Schengen Visa Calculator.
            Track and check your days in Schengen under the 90/180 rule.
          </p>
          <button
            onClick={() => setAboutOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
          >
            <Info className="w-4 h-4" />
            About Schengen Days Calculator
          </button>
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

      {/* About Dialog */}
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}

export default App;
