import { google } from "googleapis";
import { Photo, Suggestion } from "./types";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const APPROVED_TAB = "Approved";
const PENDING_TAB = "Pending";

function isConfigured(): boolean {
  return Boolean(
    SHEET_ID &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

/** Approved 탭 컬럼: id, imageUrl, color, comment, link, category, score, year */
export async function fetchApprovedPhotos(): Promise<Photo[] | null> {
  if (!isConfigured()) return null;

  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${APPROVED_TAB}!A2:H`,
  });

  const rows = res.data.values ?? [];
  return rows.map((row) => ({
    id: row[0],
    imageUrl: row[1],
    color: (row[2] || "yellow") as Photo["color"],
    comment: row[3] ?? "",
    link: row[4] || null,
    category: Number(row[5] || 2) as Photo["category"],
    score: Number(row[6] || 0),
    year: row[7] ?? "",
  }));
}

/**
 * Pending 탭 컬럼: id(photoId), field, proposedValue, submittedAt, ipHash, status
 * status 는 "pending" | "approved" | "rejected" — 승인/반려는 Claude Code 세션에서 수동으로 갱신
 */
export async function appendPendingSuggestion(
  suggestion: Suggestion
): Promise<void> {
  if (!isConfigured()) {
    console.warn("[sheets] Google Sheets 미설정, 제안 저장 스킵(로컬 모드)");
    return;
  }

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${PENDING_TAB}!A:F`,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          suggestion.photoId,
          suggestion.field,
          suggestion.proposedValue,
          suggestion.submittedAt,
          suggestion.ipHash,
          "pending",
        ],
      ],
    },
  });
}

/** 특정 사진에 대해 미승인(status=pending) 제안이 있는지 확인 (카드에 "제안 있음" 표시용) */
export async function fetchPendingPhotoIds(): Promise<Set<string>> {
  if (!isConfigured()) return new Set();

  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${PENDING_TAB}!A2:F`,
  });

  const rows = res.data.values ?? [];
  return new Set(
    rows.filter((r) => (r[5] ?? "pending") === "pending").map((r) => r[0])
  );
}

/** 같은 ipHash 로 최근 24시간 내 제출된 제안 개수 (스팸 방지, 하루 10회 제한) */
export async function countRecentSuggestionsByIp(
  ipHash: string
): Promise<number> {
  if (!isConfigured()) return 0;

  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${PENDING_TAB}!A2:F`,
  });

  const rows = res.data.values ?? [];
  const since = Date.now() - 24 * 60 * 60 * 1000;
  return rows.filter((r) => r[4] === ipHash && new Date(r[3]).getTime() > since)
    .length;
}
