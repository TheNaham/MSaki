import { google } from "googleapis";
import { IncomeRecord } from "./types";

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

/** Records 탭 컬럼: id, company, period, role, amount, highlight, category, year */
export async function fetchRecords(): Promise<IncomeRecord[] | null> {
  if (!isConfigured()) return null;

  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${RECORDS_TAB}!A2:H`,
  });

  const rows = res.data.values ?? [];
  return rows.map((row) => ({
    id: row[0],
    company: row[1] ?? "",
    period: row[2] ?? "",
    role: row[3] ?? "",
    amount: Number(row[4] || 0),
    highlight: row[5] ?? "",
    category: (row[6] || "milestone") as IncomeRecord["category"],
    year: row[7] ?? "",
  }));
}
