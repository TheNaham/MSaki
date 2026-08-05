import { getRecords, summarize, getIncomeTrend } from "@/lib/records";
import RecordFeed from "@/components/RecordFeed";
import SummaryDashboard from "@/components/SummaryDashboard";
import IncomeTrendChart from "@/components/IncomeTrendChart";

export const revalidate = 0;

export default async function Home() {
  const records = await getRecords();
  const summary = summarize(records);
  const trend = getIncomeTrend(records);

  return (
    <>
      <header className="border-b-2 border-mi-navy bg-white px-6 pb-8 pt-12 text-center">
        <p className="text-[10px] font-semibold tracking-[0.5em] text-mi-muted">
          PERSONAL RECORD
        </p>
        <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-mi-navy">
          MaxIncome
        </h1>
        <p className="mt-2 text-xs tracking-wide text-mi-muted">
          커리어 &amp; 소득 기록
        </p>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8">
        <SummaryDashboard summary={summary} />
        <IncomeTrendChart points={trend} />
        <RecordFeed records={records} />
      </main>
    </>
  );
}
