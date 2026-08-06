import { google } from "googleapis";
import { ColorStage, Photo } from "./types";
import { driveImageUrl } from "./drive";

const COLOR_WORDS: [string, ColorStage][] = [
  ["회색", "gray"],
  ["빨간색", "red"],
  ["빨강색", "red"],
  ["빨강", "red"],
  ["주황색", "orange"],
  ["주황", "orange"],
  ["노란색", "yellow"],
  ["노랑색", "yellow"],
  ["노랑", "yellow"],
  ["초록색", "green"],
  ["초록", "green"],
  ["녹색", "green"],
  ["파란색", "blue"],
  ["파랑색", "blue"],
  ["파랑", "blue"],
  ["남색", "navy"],
  ["보라색", "purple"],
  ["보라", "purple"],
] as [string, ColorStage][];

COLOR_WORDS.sort((a, b) => b[0].length - a[0].length);

// 명시적 점수 태그가 없을 때 색상 단계별 기본 점수
const COLOR_DEFAULT_SCORE: Record<ColorStage, number> = {
  gray: 10,
  red: 15,
  orange: 30,
  yellow: 40,
  green: 55,
  blue: 65,
  navy: 78,
  purple: 92,
};

interface DriveFile {
  id?: string | null;
  name?: string | null;
  createdTime?: string | null;
  modifiedTime?: string | null;
}

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

export async function listDriveFolderFiles(
  folderId: string
): Promise<DriveFile[]> {
  const drive = google.drive({ version: "v3", auth: getAuth() });
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`,
    fields: "files(id, name, createdTime, modifiedTime)",
    pageSize: 1000,
    orderBy: "name",
  });
  return res.data.files ?? [];
}

function stripExtension(name: string): string {
  return name.replace(/\.(jpe?g|png|gif|webp|heic)$/i, "");
}

function extractColor(text: string): { color: ColorStage; rest: string } {
  for (const [word, stage] of COLOR_WORDS) {
    const idx = text.indexOf(word);
    if (idx !== -1) {
      const rest = (text.slice(0, idx) + text.slice(idx + word.length))
        .replace(/[()]/g, " ")
        .trim();
      return { color: stage, rest };
    }
  }
  return { color: "yellow", rest: text };
}

function extractScore(text: string): { score: number | null; rest: string } {
  const match = text.match(/(?:^|\s)(\d{1,3})(?:\s|$)/);
  if (match) {
    const n = Number(match[1]);
    if (n >= 1 && n <= 100) {
      return { score: n, rest: (text.slice(0, match.index) + text.slice((match.index ?? 0) + match[0].length)).trim() };
    }
  }
  return { score: null, rest: text };
}

function extractYear(text: string, fallback: DriveFile): string {
  const dotMatch = text.match(/(20\d{2})[.\-](\d{1,2})/);
  if (dotMatch) {
    return `${dotMatch[1]}.${dotMatch[2].padStart(2, "0")}`;
  }
  const korMatch = text.match(/(20\d{2})년\s*(\d{1,2})월/);
  if (korMatch) {
    return `${korMatch[1]}.${korMatch[2].padStart(2, "0")}`;
  }
  const source = fallback.modifiedTime || fallback.createdTime;
  if (source) {
    return source.slice(0, 7).replace("-", ".");
  }
  return "";
}

/** Google Drive 폴더의 이미지 파일명을 파싱해 Photo 배열로 변환 */
export async function photosFromDriveFolder(
  folderId: string,
  defaultCategory: 1 | 2 | 3 = 3
): Promise<Photo[]> {
  const files = await listDriveFolderFiles(folderId);

  return files
    .filter((f) => f.id && f.name)
    .map((f) => {
      const name = stripExtension(f.name!);
      const { color, rest: afterColor } = extractColor(name);
      const { score, rest: afterScore } = extractScore(afterColor);
      const year = extractYear(name, f);
      const comment = afterScore.replace(/\s+/g, " ").trim().slice(0, 30) || "제목 없음";

      return {
        id: f.id!,
        imageUrl: driveImageUrl(f.id!),
        color,
        comment,
        link: null,
        category: defaultCategory,
        score: score ?? COLOR_DEFAULT_SCORE[color],
        year,
      };
    });
}
