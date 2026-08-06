"use client";

import { useState } from "react";
import type { TrendPoint } from "@/lib/records";
import { GOAL } from "@/lib/constants";

const WIDTH = 760;
const HEIGHT = 300;
const PAD_LEFT = 56;
const PAD_RIGHT = 24;
const PAD_TOP = 28;
const PAD_BOTTOM = 40;

export default function ProgressTrendChart({ points }: { points: TrendPoint[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (points.length === 0) return null;

  const maxY = Math.max(...points.map((p) => p.cumulative), GOAL * 0.02);
  const niceMax = Math.ceil(maxY / 10) * 10 || maxY;
  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const xAt = (i: number) =>
    points.length === 1
      ? PAD_LEFT + plotW / 2
      : PAD_LEFT + (plotW * i) / (points.length - 1);
  const yAt = (v: number) => PAD_TOP + plotH - (plotH * Math.min(v, niceMax)) / niceMax;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(p.cumulative)}`)
    .join(" ");
  const areaPath = `${linePath} L ${xAt(points.length - 1)} ${PAD_TOP + plotH} L ${xAt(0)} ${PAD_TOP + plotH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f));
  const active = hoverIdx !== null ? points[hoverIdx] : null;
  const showGoalLine = GOAL <= niceMax;

  return (
    <div className="mb-8 border border-mgf-blue">
      <div className="border-b border-mgf-blue bg-mgf-blue px-6 py-3 text-center text-[10px] font-semibold tracking-[0.4em] text-white">
        CONNECTION GROWTH
      </div>
      <div className="px-4 pb-2 pt-5 sm:px-6">
        <div className="relative w-full">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="w-full"
            role="img"
            aria-label="누적 연결 성장 그래프"
            onMouseLeave={() => setHoverIdx(null)}
          >
            {yTicks.map((t) => (
              <g key={t}>
                <line
                  x1={PAD_LEFT}
                  x2={WIDTH - PAD_RIGHT}
                  y1={yAt(t)}
                  y2={yAt(t)}
                  stroke="#DCE6F1"
                  strokeWidth={1}
                />
                <text
                  x={PAD_LEFT - 8}
                  y={yAt(t) + 3}
                  textAnchor="end"
                  className="fill-mgf-muted"
                  fontSize={9}
                >
                  {t.toLocaleString("ko-KR")}
                </text>
              </g>
            ))}

            {showGoalLine && (
              <line
                x1={PAD_LEFT}
                x2={WIDTH - PAD_RIGHT}
                y1={yAt(GOAL)}
                y2={yAt(GOAL)}
                stroke="#0A66C2"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
            )}

            <path d={areaPath} fill="#0A66C2" opacity={0.08} stroke="none" />
            <path
              d={linePath}
              fill="none"
              stroke="#0A66C2"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {points.map((p, i) => (
              <g key={p.id}>
                <line
                  x1={xAt(i)}
                  x2={xAt(i)}
                  y1={PAD_TOP}
                  y2={PAD_TOP + plotH}
                  stroke="transparent"
                  strokeWidth={Math.max(24, plotW / points.length)}
                  onMouseEnter={() => setHoverIdx(i)}
                  style={{ cursor: "pointer" }}
                />
                <circle
                  cx={xAt(i)}
                  cy={yAt(p.cumulative)}
                  r={hoverIdx === i ? 6 : 4.5}
                  fill="#0A66C2"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                <text
                  x={xAt(i)}
                  y={HEIGHT - PAD_BOTTOM + 16}
                  textAnchor="middle"
                  className="fill-mgf-muted"
                  fontSize={9}
                >
                  {p.date}
                </text>
                {i === points.length - 1 && (
                  <text
                    x={xAt(i)}
                    y={yAt(p.cumulative) - 12}
                    textAnchor="end"
                    className="fill-mgf-blue"
                    fontSize={11}
                    fontWeight={700}
                  >
                    {p.cumulative.toLocaleString("ko-KR")}명
                  </text>
                )}
              </g>
            ))}
          </svg>

          {active && (
            <div className="pointer-events-none absolute left-2 top-0 rounded-sm border border-mgf-blue bg-white px-3 py-2 text-xs shadow-sm">
              <p className="font-semibold text-mgf-blue">{active.date}</p>
              <p className="mt-1 text-mgf-muted">
                당일 연결 <span className="tabular-nums text-mgf-blue">+{active.count}</span>
              </p>
              <p className="text-mgf-muted">
                누적 연결{" "}
                <span className="tabular-nums text-mgf-blue">
                  {active.cumulative.toLocaleString("ko-KR")}명
                </span>
              </p>
            </div>
          )}
        </div>
        <p className="px-2 pb-3 pt-1 text-[10px] tracking-wide text-mgf-muted">
          점선은 10,000명 목표선입니다. 신규 연결 성사 건을 시간순으로 누적 합산했습니다.
        </p>
      </div>
    </div>
  );
}
