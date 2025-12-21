export function CalendarLegend() {
  return (
    <div className="flex flex-wrap gap-4 mt-4 px-2 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-100 border border-green-400 rounded"></div>
        <span>In Schengen</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-100 border border-red-400 rounded"></div>
        <span>Over Limit</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
        <span>Selected</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-white border-2 border-blue-500 rounded shadow-sm"></div>
        <span>Today</span>
      </div>
    </div>
  );
}
