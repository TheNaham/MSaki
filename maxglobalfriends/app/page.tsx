import { getRecords, summarize, getConnectionTrend } from "@/lib/records";
import RecordFeed from "@/components/RecordFeed";
import SummaryDashboard from "@/components/SummaryDashboard";
import ProgressTrendChart from "@/components/ProgressTrendChart";

export const revalidate = 0;

export default async function Home() {
  const records = await getRecords();
  const summary = summarize(records);
  const trend = getConnectionTrend(records);

  return (
    <>
      <header className="border-b-2 border-mgf-blue bg-white px-6 pb-8 pt-12 text-center">
        <p className="text-[10px] font-semibold tracking-[0.5em] text-mgf-muted">
          8.6 GLOBAL NETWORK PROJECT
        </p>
        <h1 className="mt-3 font-serif text-3xl font-extrabold tracking-tight text-mgf-blue">
          Maxglobalfriends
        </h1>
        <p className="mt-2 text-xs tracking-wide text-mgf-muted">
          링크드인 10,000명 연결 프로젝트 기록
        </p>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8">
        <SummaryDashboard summary={summary} />
        <ProgressTrendChart points={trend} />
        <RecordFeed records={records} />
      </main>
    </>
  );
}
