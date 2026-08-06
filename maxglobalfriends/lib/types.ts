export type RecordCategory = "connect" | "outreach" | "content" | "milestone";

export interface FriendRecord {
  id: string;
  date: string; // "2026.08.06"
  count: number; // connect: 신규 연결 성사 수 / outreach: 발송한 연결 요청 수 / content, milestone: 0
  category: RecordCategory;
  highlight: string; // 한 줄 요약
  sourceUrl?: string; // 원본(캡처, 게시물 등) 링크
}
