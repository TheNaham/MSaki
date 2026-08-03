"use client";

import { useState } from "react";
import Image from "next/image";
import { Photo } from "@/lib/types";
import { COLOR_STAGES } from "@/lib/colors";
import SuggestForm from "./SuggestForm";

const CATEGORY_LABEL: Record<number, string> = {
  1: "가족",
  2: "관심사",
  3: "일",
};

export default function PolaroidCard({ photo }: { photo: Photo }) {
  const [openField, setOpenField] = useState<
    "comment" | "link" | "category" | "score" | null
  >(null);
  const stage = COLOR_STAGES[photo.color];

  return (
    <div
      className="relative mx-auto w-full max-w-sm rounded-md shadow-md p-3 pb-4"
      style={{ backgroundColor: stage.hex }}
    >
      {photo.hasPendingSuggestion && (
        <span className="absolute -top-2 -right-2 z-10 rounded-full bg-rose-400 px-2 py-0.5 text-[10px] font-medium text-white shadow">
          제안 있음
        </span>
      )}

      {/* 상단 우측: 카테고리 / 점수 (읽기 전용, 클릭 시 수정 제안) */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          title={`카테고리: ${CATEGORY_LABEL[photo.category]} — 수정 제안하기`}
          onClick={() => setOpenField("category")}
          className="flex h-5 w-5 items-center justify-center rounded-full bg-white/80 text-[10px] font-semibold text-gray-700 shadow-sm hover:bg-white"
        >
          {photo.category}
        </button>
        <button
          title="점수 — 수정 제안하기"
          onClick={() => setOpenField("score")}
          className="flex h-5 min-w-[1.75rem] items-center justify-center rounded-full bg-white/80 px-1.5 text-[10px] font-semibold text-gray-700 shadow-sm hover:bg-white"
        >
          {photo.score}
        </button>
      </div>

      {/* 이미지 영역 (~75%, 비율 유지 + 레터박스) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-white/40">
        <span className="absolute left-2 top-2 z-10 rounded bg-black/25 px-1.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
          {photo.year}
        </span>
        <div className="relative flex h-full w-full items-center justify-center">
          <Image
            src={photo.imageUrl}
            alt={photo.comment}
            fill
            sizes="(max-width: 400px) 100vw, 400px"
            className="object-contain"
          />
        </div>
      </div>

      {/* 코멘트 + 옵션 링크 (~80% 라인까지) */}
      <div className="mt-3 space-y-1 px-1">
        <button
          onClick={() => setOpenField("comment")}
          className="block w-full text-left text-[13px] leading-snug text-gray-800"
          title="코멘트 수정 제안하기"
        >
          {photo.comment}
        </button>
        {photo.link ? (
          <a
            href={photo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-[11px] text-gray-500 underline underline-offset-2"
          >
            {photo.link}
          </a>
        ) : (
          <button
            onClick={() => setOpenField("link")}
            className="text-[11px] text-gray-400 underline underline-offset-2"
          >
            + 링크 제안하기
          </button>
        )}
      </div>

      {openField && (
        <SuggestForm
          photoId={photo.id}
          field={openField}
          currentValue={String(photo[openField] ?? "")}
          onClose={() => setOpenField(null)}
        />
      )}
    </div>
  );
}
