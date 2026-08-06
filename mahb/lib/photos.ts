import { Photo } from "./types";
import { fetchApprovedPhotos, fetchPendingPhotoIds } from "./sheets";
import { photosFromDriveFolder } from "./driveFolder";
import sampleData from "@/data/sample-photos.json";

async function loadPhotos(): Promise<Photo[]> {
  const fromSheets = await fetchApprovedPhotos();
  if (fromSheets) return fromSheets;

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const hasDriveAuth =
    folderId &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY;

  if (hasDriveAuth) {
    try {
      const photos = await photosFromDriveFolder(folderId!);
      if (photos.length > 0) return photos;
    } catch (e) {
      console.error("[photos] Drive 폴더 실시간 스캔 실패, 샘플 데이터로 폴백", e);
    }
  }

  return sampleData as Photo[];
}

export async function getPhotos(): Promise<Photo[]> {
  const photos = await loadPhotos();
  const pendingIds = await fetchPendingPhotoIds();
  return photos.map((p) => ({
    ...p,
    hasPendingSuggestion: pendingIds.has(p.id),
  }));
}
