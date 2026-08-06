import { FriendRecord } from "@/lib/types";

const CATEGORY_LABEL: Record<FriendRecord["category"], string> = {
  connect: "CONNECT",
  outreach: "OUTREACH",
  content: "CONTENT",
  milestone: "MILESTONE",
};

export default function RecordCard({ record }: { record: FriendRecord }) {
  return (
    <article className="relative border border-mgf-line bg-white p-6">
      {record.sourceUrl && (
        <a
          href={record.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="원본 보기"
          aria-label="원본 보기"
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-sm text-[10px] text-mgf-muted/60 transition hover:text-mgf-blue"
        >
          ↗
        </a>
      )}
      <div className="flex items-center justify-between border-b border-mgf-line pb-3 text-[10px] font-semibold tracking-[0.3em] text-mgf-muted">
        <span>{CATEGORY_LABEL[record.category]}</span>
        <span>{record.date}</span>
      </div>
      {record.count > 0 && (
        <p className="mt-4 font-serif text-3xl font-extrabold tabular-nums text-mgf-blue">
          +{record.count.toLocaleString("ko-KR")}
          <span className="ml-1 align-super text-[10px] font-sans font-normal tracking-widest text-mgf-muted">
            명
          </span>
        </p>
      )}
      <p className="mt-4 text-sm leading-relaxed text-mgf-ink/80">
        {record.highlight}
      </p>
    </article>
  );
}
