'use client';

interface NoteSpaceControlProps {
  width: number;
  onChange: (width: number) => void;
}

export default function NoteSpaceControl({ width, onChange }: NoteSpaceControlProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="note-space-width" className="text-sm font-medium text-gray-700">
        Note Space Width (px): {width}
      </label>
      <div className="flex items-center gap-4">
        <input
          type="range"
          id="note-space-width"
          min="100"
          max="500"
          step="10"
          value={width}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <input
          type="number"
          min="100"
          max="500"
          step="10"
          value={width}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
    </div>
  );
} 