import { ColorStage } from "./types";

export const COLOR_STAGES: Record<
  ColorStage,
  { hex: string; label: string; description: string }
> = {
  gray: {
    hex: "#E6E4E0",
    label: "회색",
    description: "잊고 싶은 기억, 다시 꺼내지 않을 지난 일",
  },
  red: {
    hex: "#F7D6D5",
    label: "빨강",
    description: "아직 시작하지 않은, 부정적으로 남은 마음",
  },
  orange: {
    hex: "#F9E0C8",
    label: "주황",
    description: "부정에서 조금씩 벗어나려는, 여전히 망설이는 단계",
  },
  yellow: {
    hex: "#FBF0C4",
    label: "노랑",
    description: "할까 말까 고민하는 애매한 단계",
  },
  green: {
    hex: "#DCEED2",
    label: "초록",
    description: "조금 더 긍정적으로 바라보게 된 단계",
  },
  blue: {
    hex: "#D6E8F5",
    label: "파랑",
    description: "긍정을 실제로 시작한 단계",
  },
  navy: {
    hex: "#D8DCF0",
    label: "남색",
    description: "고난 속에서도 지속하며 성과가 보이기 시작하는 단계",
  },
  purple: {
    hex: "#E7DBF2",
    label: "보라",
    description: "완료하고 자랑스럽게 나눌 수 있는 성취의 단계",
  },
};

const DEFAULT_STAGE: ColorStage = "yellow";

/**
 * 규칙 기반 자동 분류. 명시적 override가 없으면 기본값은 파스텔 노랑.
 * score/category 조합으로 점진적으로 확장 가능하도록 남겨둠.
 */
export function classifyColor(override?: ColorStage | null): ColorStage {
  return override ?? DEFAULT_STAGE;
}
