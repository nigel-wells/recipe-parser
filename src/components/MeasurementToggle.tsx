'use client';

interface MeasurementToggleProps {
  showOriginal: boolean;
  onToggle: (value: boolean) => void;
}

export function MeasurementToggle({ showOriginal, onToggle }: MeasurementToggleProps) {
  return (
    <div className="print:hidden flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
      <span className={`text-sm font-medium transition-colors ${!showOriginal ? 'text-blue-600' : 'text-gray-500'}`}>
        Metric (NZ)
      </span>
      <button
        onClick={() => onToggle(!showOriginal)}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-inner ${
          showOriginal ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gray-300'
        }`}
        aria-label="Toggle measurements"
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
            showOriginal ? 'translate-x-8' : 'translate-x-1'
          }`}
        />
      </button>
      <span className={`text-sm font-medium transition-colors ${showOriginal ? 'text-blue-600' : 'text-gray-500'}`}>
        Original
      </span>
    </div>
  );
}
