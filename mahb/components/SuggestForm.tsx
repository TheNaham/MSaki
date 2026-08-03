"use client";

import { useState } from "react";

const FIELD_LABEL: Record<string, string> = {
  comment: "코멘트 (30자 이내)",
  link: "링크",
  category: "카테고리 (1=가족, 2=관심사, 3=일)",
  score: "점수 (1~100)",
};

export default function SuggestForm({
  photoId,
  field,
  currentValue,
  onClose,
}: {
  photoId: string;
  field: "comment" | "link" | "category" | "score";
  currentValue: string;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function submit() {
    if (!value.trim()) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, field, proposedValue: value.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "전송 실패");
      }
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "전송 실패");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-xl bg-white p-5 shadow-xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {status === "done" ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-gray-700">
              제안이 접수되었어요.
              <br />
              승인 후에만 실제로 반영됩니다.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-full bg-gray-800 py-2 text-sm text-white"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <h3 className="mb-1 text-sm font-semibold text-gray-800">
              수정 제안하기
            </h3>
            <p className="mb-3 text-xs text-gray-400">
              {FIELD_LABEL[field]} · 현재 값: {currentValue || "없음"}
            </p>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={field === "comment" ? 30 : 200}
              placeholder="제안할 내용을 입력하세요"
              className="mb-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
            {field === "comment" && (
              <p className="mb-2 text-right text-[10px] text-gray-400">
                {value.length}/30
              </p>
            )}
            {status === "error" && (
              <p className="mb-2 text-xs text-rose-500">{errorMsg}</p>
            )}
            <div className="mt-2 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-gray-200 py-2 text-sm text-gray-600"
              >
                취소
              </button>
              <button
                onClick={submit}
                disabled={status === "sending" || !value.trim()}
                className="flex-1 rounded-full bg-gray-800 py-2 text-sm text-white disabled:opacity-40"
              >
                {status === "sending" ? "전송 중..." : "제안 보내기"}
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] text-gray-400">
              실제 반영은 관리자 승인 후에만 이루어집니다. 하루 최대 10회까지 제안할 수 있어요.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
