import { RecordSummary } from "@/lib/records";

export default function SummaryDashboard({
  summary,
}: {
  summary: RecordSummary;
}) {
  return (
    <div className="mb-8 border border-mgf-blue">
      <div className="border-b border-mgf-blue bg-mgf-blue px-6 py-3 text-center text-[10px] font-semibold tracking-[0.4em] text-white">
        10,000 FRIENDS GOAL
      </div>
      <div className="px-6 py-5">
        <div className="h-3 w-full overflow-hidden rounded-full bg-mgf-bg">
          <div
            className="h-full rounded-full bg-mgf-blue transition-all"
            style={{ width: `${summary.percent}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs tracking-wide text-mgf-muted">
          {summary.percent.toFixed(1)}% 달성 · 목표까지{" "}
          <span className="font-semibold text-mgf-blue">
            {summary.remaining.toLocaleString("ko-KR")}명
          </span>{" "}
          남음
        </p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-mgf-line border-t border-mgf-line sm:grid-cols-4 sm:divide-y-0">
        <Stat
          label="누적 연결 수"
          value={`${summary.totalConnections.toLocaleString("ko-KR")}명`}
        />
        <Stat
          label="누적 요청 발송"
          value={`${summary.totalOutreach.toLocaleString("ko-KR")}건`}
        />
        <Stat label="경과 일수" value={`${summary.daysElapsed}일`} />
        <Stat
          label="일평균 연결"
          value={summary.avgPerDay.toFixed(1)}
        />
      </div>
      {summary.projectedDaysLeft !== null && (
        <div className="border-t border-mgf-line px-6 py-4 text-center text-sm text-mgf-muted">
          현재 페이스 유지 시 약{" "}
          <span className="font-semibold text-mgf-blue">
            {summary.projectedDaysLeft.toLocaleString("ko-KR")}일
          </span>{" "}
          후 목표 달성 예상
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-5 text-center">
      <p className="font-serif text-xl font-extrabold tabular-nums text-mgf-blue sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 text-[10px] tracking-widest text-mgf-muted">{label}</p>
    </div>
  );
}
