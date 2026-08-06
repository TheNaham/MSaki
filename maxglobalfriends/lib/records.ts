import { FriendRecord, RecordCategory } from "./types";
import { fetchRecords } from "./sheets";
import { GOAL, START_DATE } from "./constants";
import sampleRecords from "@/data/sample-records.json";

const CATEGORY_WEIGHT: Record<RecordCategory, number> = {
  milestone: 3,
  connect: 2,
  outreach: 1,
  content: 0,
};

function parseDate(date: string): number {
  const [y, m, d] = date.split(".").map(Number);
  return new Date(y, (m || 1) - 1, d || 1).getTime();
}

/** 최신 날짜순으로 정렬하되, 같은 날짜면 중요도(카테고리) 순으로 정렬 */
function sortRecords(records: FriendRecord[]): FriendRecord[] {
  return [...records].sort((a, b) => {
    const dateDiff = parseDate(b.date) - parseDate(a.date);
    if (dateDiff !== 0) return dateDiff;
    return CATEGORY_WEIGHT[b.category] - CATEGORY_WEIGHT[a.category];
  });
}

export async function getRecords(): Promise<FriendRecord[]> {
  const fromSheet = await fetchRecords();
  const records = fromSheet && fromSheet.length > 0
    ? fromSheet
    : (sampleRecords as FriendRecord[]);
  return sortRecords(records);
}

export interface RecordSummary {
  totalConnections: number;
  totalOutreach: number;
  goal: number;
  remaining: number;
  percent: number;
  recordCount: number;
  daysElapsed: number;
  avgPerDay: number;
  projectedDaysLeft: number | null;
}

export function summarize(records: FriendRecord[]): RecordSummary {
  const totalConnections = records
    .filter((r) => r.category === "connect")
    .reduce((sum, r) => sum + r.count, 0);
  const totalOutreach = records
    .filter((r) => r.category === "outreach")
    .reduce((sum, r) => sum + r.count, 0);

  const remaining = Math.max(GOAL - totalConnections, 0);
  const percent = Math.min((totalConnections / GOAL) * 100, 100);

  const now = Date.now();
  const daysElapsed = Math.max(
    1,
    Math.round((now - parseDate(START_DATE)) / (1000 * 60 * 60 * 24)) + 1
  );
  const avgPerDay = totalConnections / daysElapsed;
  const projectedDaysLeft = avgPerDay > 0 ? Math.ceil(remaining / avgPerDay) : null;

  return {
    totalConnections,
    totalOutreach,
    goal: GOAL,
    remaining,
    percent,
    recordCount: records.length,
    daysElapsed,
    avgPerDay,
    projectedDaysLeft,
  };
}

export interface TrendPoint {
  id: string;
  date: string; // "08.06"
  count: number;
  cumulative: number;
}

/** 신규 연결 성사 기록을 시간순으로 누적 합산 — 1만 명 목표 대비 진행 곡선 */
export function getConnectionTrend(records: FriendRecord[]): TrendPoint[] {
  const connectRecords = [...records]
    .filter((r) => r.category === "connect")
    .sort((a, b) => parseDate(a.date) - parseDate(b.date));

  let cumulative = 0;
  return connectRecords.map((r) => {
    cumulative += r.count;
    const [, m, d] = r.date.split(".");
    return {
      id: r.id,
      date: `${m}.${d}`,
      count: r.count,
      cumulative,
    };
  });
}
