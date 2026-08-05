export type ChoiceGrade = "good" | "ok" | "risky";

export interface Choice {
  id: string;
  text: string;
  feedback: string;
  grade: ChoiceGrade;
}

export interface Step {
  id: string;
  situation: string;
  choices: Choice[];
}

export type Category =
  | "strategist"
  | "technologist"
  | "economist"
  | "execution"
  | "compliance"
  | "leadership";

export type Tier = "core" | "executive";

export interface Scenario {
  id: string;
  category: Category;
  tier: Tier;
  title: string;
  intro: string;
  steps: Step[];
  takeaway: string;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  strategist: "전략가 · Master Strategist",
  technologist: "기술가 · Digital Transformation",
  economist: "경제가 · Cost Efficiency",
  execution: "실행가 · Market Execution",
  compliance: "규제 대응 · Compliance & Gov Relations",
  leadership: "리더십 · Peace-maker Leadership",
};
