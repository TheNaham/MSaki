import { IncomeRecord } from "@/lib/types";
import RecordCard from "./RecordCard";

export default function RecordFeed({ records }: { records: IncomeRecord[] }) {
  if (records.length === 0) {
    return (
      <p className="text-center text-sm text-mi-muted">기록이 없습니다.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {records.map((record) => (
        <RecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}
