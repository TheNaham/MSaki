import { IncomeRecord, RecordCategory } from "./types";
import { fetchRecords } from "./sheets";
import sampleRecords from "@/data/sample-records.json";

const CATEGORY_WEIGHT: Record<RecordCategory, number> = {
  award: 3,
  promotion: 2,
  milestone: 1,
  income: 0,
};

/** 금액이 큰 순서로 정렬하되, 금액이 0인 항목(승진 등)은 의미(카테고리) 순으로 정렬 */
function sortRecords(records: IncomeRecord[]): IncomeRecord[] {
  return [...records].sort((a, b) => {
    if (b.amount !== a.amount) return b.amount - a.amount;
    if (CATEGORY_WEIGHT[b.category] !== CATEGORY_WEIGHT[a.category]) {
      return CATEGORY_WEIGHT[b.category] - CATEGORY_WEIGHT[a.category];
    }
    return b.year.localeCompare(a.year);
  });
}

export async function getRecords(): Promise<IncomeRecord[]> {
  const fromSheet = await fetchRecords();
  const records = fromSheet && fromSheet.length > 0
    ? fromSheet
    : (sampleRecords as IncomeRecord[]);
  return sortRecords(records);
}

export interface RecordSummary {
  totalIncome: number;
  companyCount: number;
  recordCount: number;
  topRecord: IncomeRecord | null;
  byYear: { year: string; total: number }[];
}

export function summarize(records: IncomeRecord[]): RecordSummary {
  const incomeRecords = records.filter((r) => r.category === "income");
  const totalIncome = incomeRecords.reduce((sum, r) => sum + r.amount, 0);
  const companyCount = new Set(records.map((r) => r.company)).size;

  const topRecord = incomeRecords.reduce<IncomeRecord | null>((top, r) => {
    if (!top || r.amount > top.amount) return r;
    return top;
  }, null);

  const yearTotals = new Map<string, number>();
  for (const r of incomeRecords) {
    yearTotals.set(r.year, (yearTotals.get(r.year) ?? 0) + r.amount);
  }
  const byYear = [...yearTotals.entries()]
    .map(([year, total]) => ({ year, total }))
    .sort((a, b) => b.year.localeCompare(a.year));

  return {
    totalIncome,
    companyCount,
    recordCount: records.length,
    topRecord,
    byYear,
  };
}

export interface TrendPoint {
  id: string;
  date: string; // "2024.01"
  company: string;
  amount: number;
  cumulative: number;
}

function periodStart(period: string): number {
  const [start] = period.split("-");
  const [y, m, d] = start.trim().split(".").map(Number);
  return new Date(y, (m || 1) - 1, d || 1).getTime();
}

/** 소득 기록을 시간순으로 누적 합산 — 커리어 전체 소득 성장 곡선(우상향) */
export function getIncomeTrend(records: IncomeRecord[]): TrendPoint[] {
  const incomeRecords = [...records]
    .filter((r) => r.category === "income")
    .sort((a, b) => periodStart(a.period) - periodStart(b.period));

  let cumulative = 0;
  return incomeRecords.map((r) => {
    cumulative += r.amount;
    const [start] = r.period.split("-");
    const [y, m] = start.trim().split(".");
    return {
      id: r.id,
      date: `${y}.${m}`,
      company: r.company,
      amount: r.amount,
      cumulative,
    };
  });
}
