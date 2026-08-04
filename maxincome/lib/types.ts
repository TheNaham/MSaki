export type RecordCategory = "promotion" | "income" | "award" | "milestone";

export interface IncomeRecord {
  id: string;
  company: string;
  period: string; // "2026.02 - 2026.05"
  role: string; // "팀장 · 신사업개발팀"
  amount: number; // 0 이면 금액 없는 항목(승진 등)
  highlight: string; // 한 줄 요약
  category: RecordCategory;
  year: string; // "2026"
}
