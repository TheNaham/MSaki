import { getRecords } from "@/lib/records";
import RecordFeed from "@/components/RecordFeed";

export const revalidate = 0;

export default async function Home() {
  const records = await getRecords();

  return (
    <main className="mx-auto max-w-md px-4 pt-8 pb-16">
      <header className="mb-6 text-center">
        <h1 className="text-lg font-semibold tracking-tight text-gray-800">
          MaxIncome
        </h1>
        <p className="mt-1 text-xs text-gray-400">커리어 &amp; 소득 기록</p>
      </header>
      <RecordFeed records={records} />
    </main>
  );
}
