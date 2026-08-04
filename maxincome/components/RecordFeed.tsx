import { IncomeRecord } from "@/lib/types";
import RecordCard from "./RecordCard";

export default function RecordFeed({ records }: { records: IncomeRecord[] }) {
  if (records.length === 0) {
    return <p className="text-center text-sm text-gray-400">기록이 없습니다.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {records.map((record) => (
        <RecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}
