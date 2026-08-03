import { Photo } from "./types";
import { fetchApprovedPhotos, fetchPendingPhotoIds } from "./sheets";
import sampleData from "@/data/sample-photos.json";

export async function getPhotos(): Promise<Photo[]> {
  const fromSheets = await fetchApprovedPhotos();
  const photos: Photo[] = fromSheets ?? (sampleData as Photo[]);

  const pendingIds = await fetchPendingPhotoIds();
  return photos.map((p) => ({
    ...p,
    hasPendingSuggestion: pendingIds.has(p.id),
  }));
}
