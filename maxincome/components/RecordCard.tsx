import { IncomeRecord } from "@/lib/types";

const CATEGORY_LABEL: Record<IncomeRecord["category"], string> = {
  promotion: "PROMOTION",
  income: "INCOME",
  award: "AWARD",
  milestone: "MILESTONE",
};

function formatKRW(amount: number): string {
  if (!amount) return "";
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export default function RecordCard({ record }: { record: IncomeRecord }) {
  return (
    <article className="border border-mi-line bg-white p-6">
      <div className="flex items-center justify-between border-b border-mi-line pb-3 text-[10px] font-semibold tracking-[0.3em] text-mi-muted">
        <span>{CATEGORY_LABEL[record.category]}</span>
        <span>{record.period}</span>
      </div>
      <h3 className="mt-4 font-serif text-lg font-bold text-mi-navy">
        {record.company}
      </h3>
      <p className="mt-1 text-sm text-mi-muted">{record.role}</p>
      {record.amount > 0 && (
        <p className="mt-4 font-serif text-3xl font-extrabold tabular-nums text-mi-navy">
          {formatKRW(record.amount)}
          <span className="ml-1 align-super text-[10px] font-sans font-normal tracking-widest text-mi-muted">
            세전
          </span>
        </p>
      )}
      <p className="mt-4 text-sm leading-relaxed text-mi-navy/80">
        {record.highlight}
      </p>
    </article>
  );
}
