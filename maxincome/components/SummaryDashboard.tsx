import { RecordSummary } from "@/lib/records";

function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export default function SummaryDashboard({
  summary,
}: {
  summary: RecordSummary;
}) {
  return (
    <div className="mb-8 border border-mi-navy">
      <div className="border-b border-mi-navy bg-mi-navy px-6 py-3 text-center text-[10px] font-semibold tracking-[0.4em] text-white">
        SUMMARY
      </div>
      <div className="grid grid-cols-2 divide-x divide-mi-line border-b border-mi-line sm:grid-cols-4 sm:divide-y-0">
        <Stat label="누적 총소득 (세전)" value={formatKRW(summary.totalIncome)} wide />
        <Stat label="재직 기업 수" value={`${summary.companyCount}곳`} />
        <Stat label="총 기록" value={`${summary.recordCount}건`} />
        <Stat
          label="최고 수령액"
          value={summary.topRecord ? formatKRW(summary.topRecord.amount) : "-"}
        />
      </div>
      {summary.byYear.length > 0 && (
        <div className="flex flex-wrap gap-x-8 gap-y-2 px-6 py-4">
          {summary.byYear.map((y) => (
            <div key={y.year} className="text-sm">
              <span className="mr-2 font-serif font-semibold text-mi-navy">
                {y.year}
              </span>
              <span className="tabular-nums text-mi-muted">
                {formatKRW(y.total)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  wide,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`px-4 py-5 text-center ${wide ? "col-span-2 sm:col-span-1" : ""}`}>
      <p className="font-serif text-xl font-extrabold tabular-nums text-mi-navy sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 text-[10px] tracking-widest text-mi-muted">{label}</p>
    </div>
  );
}
