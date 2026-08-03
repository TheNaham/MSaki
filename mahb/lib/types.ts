export type ColorStage =
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "navy"
  | "purple";

export type Category = 1 | 2 | 3; // 1=가족, 2=개인 관심사, 3=일

export interface Photo {
  id: string;
  imageUrl: string;
  color: ColorStage;
  comment: string; // 한글 30자 이내
  link?: string | null;
  category: Category;
  score: number; // 1-100
  year: string; // "YYYY.MM"
  hasPendingSuggestion?: boolean;
}

export interface Suggestion {
  photoId: string;
  field: "comment" | "link" | "category" | "score" | "color";
  proposedValue: string;
  submittedAt: string;
  ipHash: string;
}
