"use client";

import { useState } from "react";
import Link from "next/link";
import type { Choice, ChoiceGrade, Scenario } from "@/lib/types";

const GRADE_STYLE: Record<ChoiceGrade, string> = {
  good: "border-se-good text-se-good",
  ok: "border-se-gold text-se-gold",
  risky: "border-se-risky text-se-risky",
};

const GRADE_LABEL: Record<ChoiceGrade, string> = {
  good: "탁월한 판단",
  ok: "무난한 판단",
  risky: "위험한 판단",
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function ScenarioPlayer({ scenario }: { scenario: Scenario }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [picked, setPicked] = useState<Choice | null>(null);
  const [history, setHistory] = useState<ChoiceGrade[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const step = scenario.steps[stepIndex];
  const isLastStep = stepIndex === scenario.steps.length - 1;
  const finished = isLastStep && picked !== null;

  function pick(choice: Choice) {
    setPicked(choice);
    if (isLastStep && saveStatus === "idle") {
      setSaveStatus("saving");
      fetch("/api/complete-scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioTitle: scenario.title,
          choiceText: choice.text,
          grade: choice.grade,
          feedback: choice.feedback,
        }),
      })
        .then((res) => (res.ok ? setSaveStatus("saved") : setSaveStatus("error")))
        .catch(() => setSaveStatus("error"));
    }
  }

  function next() {
    if (!picked) return;
    setHistory((h) => [...h, picked.grade]);
    setPicked(null);
    setStepIndex((i) => i + 1);
  }

  if (finished) {
    const finalHistory = [...history, picked.grade];
    const goodCount = finalHistory.filter((g) => g === "good").length;
    return (
      <div className="mx-auto max-w-2xl">
        <h2 className="font-serif text-2xl font-semibold text-se-ink">결과</h2>
        <p className="mt-2 text-se-muted">
          {finalHistory.length}개 판단 중{" "}
          <span className="text-se-gold">{goodCount}개</span>가 탁월한
          판단이었습니다.
        </p>
        <div className="mt-4 flex gap-2">
          {finalHistory.map((g, i) => (
            <span
              key={i}
              className={`h-2 flex-1 rounded-full ${
                g === "good"
                  ? "bg-se-good"
                  : g === "ok"
                  ? "bg-se-gold"
                  : "bg-se-risky"
              }`}
            />
          ))}
        </div>
        <div className="mt-8 rounded border border-se-line bg-se-panel p-6">
          <h3 className="text-xs uppercase tracking-widest text-se-gold">
            Takeaway
          </h3>
          <p className="mt-2 leading-relaxed text-se-ink">
            {scenario.takeaway}
          </p>
        </div>
        <p className="mt-4 text-xs text-se-muted">
          {saveStatus === "saving" && "대시보드에 기록 저장 중..."}
          {saveStatus === "saved" && "✓ 대시보드 '의사결정 이력'에 저장됨"}
          {saveStatus === "error" &&
            "⚠ 자동 저장 실패 — 잠시 후 새로고침해서 다시 시도해 주세요"}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded bg-se-gold px-5 py-2.5 text-sm font-medium tracking-wide text-se-charcoal transition hover:brightness-110"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2 text-xs tracking-widest text-se-muted">
        <span>
          STEP {stepIndex + 1} / {scenario.steps.length}
        </span>
      </div>
      <p className="mt-4 text-lg leading-relaxed text-se-ink">
        {step.situation}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {step.choices.map((choice) => {
          const isPicked = picked?.id === choice.id;
          return (
            <button
              key={choice.id}
              onClick={() => pick(choice)}
              disabled={picked !== null}
              className={`rounded border p-4 text-left text-sm transition ${
                isPicked
                  ? GRADE_STYLE[choice.grade]
                  : "border-se-line text-se-ink hover:border-se-gold/60"
              } ${picked && !isPicked ? "opacity-40" : ""}`}
            >
              {choice.text}
              {isPicked && (
                <div className="mt-3 border-t border-current/30 pt-3 text-xs">
                  <span className="font-semibold">
                    {GRADE_LABEL[choice.grade]}
                  </span>
                  <p className="mt-1 text-se-muted">{choice.feedback}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {picked && (
        <button
          onClick={next}
          className="mt-6 rounded bg-se-gold px-5 py-2.5 text-sm font-medium tracking-wide text-se-charcoal transition hover:brightness-110"
        >
          {isLastStep ? "결과 보기" : "다음 단계"}
        </button>
      )}
    </div>
  );
}
