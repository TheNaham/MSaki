import { IncomeRecord } from "./types";
import { fetchRecords } from "./sheets";
import sampleRecords from "@/data/sample-records.json";

export async function getRecords(): Promise<IncomeRecord[]> {
  const fromSheet = await fetchRecords();
  if (fromSheet && fromSheet.length > 0) return fromSheet;
  return sampleRecords as IncomeRecord[];
}
