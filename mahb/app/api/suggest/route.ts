import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { appendPendingSuggestion, countRecentSuggestionsByIp } from "@/lib/sheets";
import { sendTelegramMessage } from "@/lib/telegram";

const DAILY_LIMIT = 10;
const ALLOWED_FIELDS = ["comment", "link", "category", "score", "color"];

// Sheets 미설정(로컬 개발) 환경에서만 쓰는 메모리 폴백 — 서버리스 재시작 시 초기화됨
const localMemoryCounts = new Map<string, { count: number; day: string }>();

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (
    !body ||
    typeof body.photoId !== "string" ||
    !ALLOWED_FIELDS.includes(body.field) ||
    typeof body.proposedValue !== "string" ||
    !body.proposedValue.trim()
  ) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (body.field === "comment" && body.proposedValue.length > 30) {
    return NextResponse.json(
      { error: "코멘트는 30자 이내로 입력해주세요." },
      { status: 400 }
    );
  }

  const ipHash = hashIp(getClientIp(req));
  const today = new Date().toISOString().slice(0, 10);

  const recentCount = await countRecentSuggestionsByIp(ipHash);
  const localEntry = localMemoryCounts.get(ipHash);
  const localCount = localEntry?.day === today ? localEntry.count : 0;

  if (recentCount + localCount >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: "하루 최대 제안 횟수(10회)를 초과했습니다." },
      { status: 429 }
    );
  }

  const submittedAt = new Date().toISOString();

  await appendPendingSuggestion({
    photoId: body.photoId,
    field: body.field,
    proposedValue: body.proposedValue.trim(),
    submittedAt,
    ipHash,
  });

  localMemoryCounts.set(ipHash, { count: localCount + 1, day: today });

  await sendTelegramMessage(
    `📝 <b>MaHB 수정 제안</b>\n사진: ${body.photoId}\n항목: ${body.field}\n제안 값: ${body.proposedValue.trim()}\n\nClaude Code 세션에서 검토 후 승인해주세요.`
  ).catch((e) => console.error("[suggest] telegram 알림 실패", e));

  return NextResponse.json({ ok: true });
}
