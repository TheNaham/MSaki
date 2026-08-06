import { google } from "googleapis";
import { FriendRecord } from "./types";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const RECORDS_TAB = "Records";

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
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

/** Records 탭 컬럼: id, date, count, category, highlight, sourceUrl */
export async function fetchRecords(): Promise<FriendRecord[] | null> {
  if (!isConfigured()) return null;

  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${RECORDS_TAB}!A2:F`,
  });

  const rows = res.data.values ?? [];
  return rows.map((row) => ({
    id: row[0],
    date: row[1] ?? "",
    count: Number(row[2] || 0),
    category: (row[3] || "milestone") as FriendRecord["category"],
    highlight: row[4] ?? "",
    sourceUrl: row[5] || undefined,
  }));
}
