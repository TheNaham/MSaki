"use client";

import { useMemo, useState } from "react";
import { Photo } from "@/lib/types";
import PolaroidCard from "./PolaroidCard";
import SortToggle, { SortMode } from "./SortToggle";

export default function PhotoFeed({ photos }: { photos: Photo[] }) {
  const [mode, setMode] = useState<SortMode>("year");

  const sorted = useMemo(() => {
    const copy = [...photos];
    if (mode === "year") {
      copy.sort((a, b) => a.year.localeCompare(b.year));
    } else {
      copy.sort((a, b) => a.category - b.category);
    }
    return copy;
  }, [photos, mode]);

  return (
    <div>
      <SortToggle mode={mode} onChange={setMode} />
      <div className="flex flex-col gap-6 pb-16">
        {sorted.map((photo) => (
          <PolaroidCard key={photo.id} photo={photo} />
        ))}
      </div>
    </div>
  );
}
