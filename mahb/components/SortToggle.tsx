"use client";

export type SortMode = "year" | "color";

export default function SortToggle({
  mode,
  onChange,
}: {
  mode: SortMode;
  onChange: (mode: SortMode) => void;
}) {
  return (
    <div className="mx-auto mb-6 flex w-fit items-center gap-1 rounded-full bg-white/70 p-1 text-xs shadow-sm backdrop-blur-sm">
      <button
        onClick={() => onChange("year")}
        className={`rounded-full px-3 py-1.5 transition ${
          mode === "year"
            ? "bg-gray-800 text-white"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        연도순
      </button>
      <button
        onClick={() => onChange("color")}
        className={`rounded-full px-3 py-1.5 transition ${
          mode === "color"
            ? "bg-gray-800 text-white"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        색상순
      </button>
    </div>
  );
}
