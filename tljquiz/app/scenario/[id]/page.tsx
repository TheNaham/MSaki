import { notFound } from "next/navigation";
import { getScenario, scenarios } from "@/data/scenarios";
import { CATEGORY_LABEL } from "@/lib/types";
import ScenarioPlayer from "@/components/ScenarioPlayer";

export function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.id }));
}

export default function ScenarioPage({ params }: { params: { id: string } }) {
  const scenario = getScenario(params.id);
  if (!scenario) return notFound();

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto mb-10 max-w-2xl">
        <span className="text-[11px] uppercase tracking-widest text-se-gold">
          {CATEGORY_LABEL[scenario.category]}
        </span>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-se-ink">
          {scenario.title}
        </h1>
        <p className="mt-2 text-sm text-se-muted">{scenario.intro}</p>
      </div>
      <ScenarioPlayer scenario={scenario} />
    </main>
  );
}
