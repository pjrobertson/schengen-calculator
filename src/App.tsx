import { useState } from 'react';
import { Info } from 'lucide-react';
import { Calendar } from './components/Calendar';
import { TripList } from './components/TripList';
import { AboutDialog } from './components/AboutDialog';
import { useTrips } from './hooks/useTrips';

function App() {
  const { trips, addTrip, addExistingTrip, removeTrip, updateTrip } = useTrips();
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleTripCreate = (start: Date, end: Date) => {
    const newTrip = addTrip(start, end);
    return newTrip;
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
        </div>


        {/* Calendar */}
        <div className="mb-12">
          <Calendar
            trips={trips}
            onCreateTrip={handleTripCreate}
            onUpdateTrip={updateTrip}
            onRemoveTrip={removeTrip}
          />
        </div>

        {/* Trip List */}
        <div>
          <TripList trips={trips} onRemoveTrip={removeTrip} onUpdateTrip={updateTrip} onAddTrip={addExistingTrip} />
        </div>

        <div className="text-right mt-6 max-w-4xl mx-auto">
          <button
            onClick={() => setAboutOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm cursor-pointer font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
          >
            <Info className="w-4 h-4" />
            About Schengen Days Calculator
          </button>
        </div>
      </div>
      {/* Footer with copyright Patrick Robertson and link to patrick.is */}
      <footer className="mt-12 text-center text-sm text-gray-500">
        <div>
          &copy; {new Date().getFullYear()} Paddy Robertson. Built with ❤️ Visit{' '}
          <a
            href="https://patrick.is"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            patrick.is
          </a>
        </div>
        <div className="mt-1 text-xs text-gray-400">
          Version: {import.meta.env.VITE_GIT_HASH}
        </div>
      </footer>
      {/* About Dialog */}
      <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}

export default App;
