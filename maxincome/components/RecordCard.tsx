import { IncomeRecord } from "@/lib/types";

const CATEGORY_LABEL: Record<IncomeRecord["category"], string> = {
  promotion: "승진 / 합류",
  income: "소득",
  award: "수상",
  milestone: "마일스톤",
};

function formatKRW(amount: number): string {
  if (!amount) return "";
  return `${amount.toLocaleString("ko-KR")}원`;
}

export default function RecordCard({ record }: { record: IncomeRecord }) {
  return (
    <article className="rounded-lg border border-maxincome-line bg-maxincome-card p-5 shadow-sm">
      <div className="flex items-center justify-between text-xs text-maxincome-gold">
        <span className="font-medium tracking-wide">
          {CATEGORY_LABEL[record.category]}
        </span>
        <span>{record.period}</span>
      </div>
      <h3 className="mt-2 text-base font-semibold text-gray-800">
        {record.company}
      </h3>
      <p className="mt-0.5 text-sm text-gray-500">{record.role}</p>
      {record.amount > 0 && (
        <p className="mt-3 text-xl font-bold text-maxincome-accent">
          {formatKRW(record.amount)}
        </p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        {record.highlight}
      </p>
    </article>
  );
}
