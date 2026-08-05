import Link from "next/link";
import type { Scenario } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/types";

export default function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <Link
      href={`/scenario/${scenario.id}`}
      className="group block rounded border border-se-line bg-se-panel p-5 transition hover:border-se-gold"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest text-se-gold">
          {CATEGORY_LABEL[scenario.category]}
        </span>
        {scenario.tier === "executive" && (
          <span className="rounded-full border border-se-gold/50 px-2 py-0.5 text-[10px] tracking-widest text-se-gold">
            EXECUTIVE
          </span>
        )}
      </div>
      <h3 className="mt-3 font-serif text-lg font-semibold text-se-ink group-hover:text-se-gold">
        {scenario.title}
      </h3>
      <p className="mt-2 text-sm text-se-muted">{scenario.intro}</p>
    </Link>
  );
}
