# Saki Global Engine (프로토타입)

Max의 14년 글로벌 실무 데이터를 기반으로, 본부장급 영향력을 트레이닝하는
비공개 시나리오 학습 사이트. `maxincome`과 달리 소득/급여 데이터는 전혀
다루지 않으며, 순수하게 의사결정 시뮬레이션·퀴즈 콘텐츠만 담습니다.

디자인은 차콜(#14181F) + 골드(#C9A24B) 톤에 세리프(Noto Serif KR / Playfair
Display) 서체를 사용한 프로페셔널한 임원 브리핑 톤으로 구성했습니다.

## 콘텐츠 구조

- `data/scenarios.ts`에 시나리오가 정의되어 있습니다. 각 시나리오는 3단계
  분기형 의사결정 + 선택지별 피드백 + 마무리 takeaway로 구성됩니다.
- 6개 핵심 테마(전략가/기술가/경제가/실행가/규제 대응/리더십)와, 본부장급
  영향력을 다루는 `executive` 티어 시나리오(이사회 갈등 중재, 위기 대응)를
  포함합니다.
- 모든 회사명·동료 특징은 코드네임/역할명으로 익명화되어 있습니다 (예: "APAC
  파트너", "R&D팀장"). 실명이나 특정 개인을 식별할 수 있는 정보는 없습니다.
- 홈 화면 상단의 "오늘의 챌린지"는 날짜 기준으로 시나리오 풀 중 하나를
  자동으로 선택해 매일 다른 문제가 노출되도록 합니다.

## 접근 제한 (비공개)

- 전체 사이트가 비밀번호로 보호됩니다 (미들웨어 쿠키 인증).
- 기본 비밀번호는 `8687`이며, Vercel 환경변수 `SITE_PASSWORD`로 재설정할 수
  있습니다.
- `robots: noindex`로 검색엔진 노출도 차단되어 있습니다.

## 로컬 실행

```bash
cd saki-engine
npm install
npm run dev
```

## Vercel 배포

1. https://vercel.com 에서 "Add New… > Project" 클릭
2. 이 GitHub 리포(`thenaham/msaki`)를 Import 하고, **Root Directory를
   `saki-engine`으로 지정**
3. 프로젝트 이름을 `saki-engine`으로 설정 → 배포 후 `saki-engine.vercel.app`으로
   접속 확인
4. 필요 시 Vercel 프로젝트 설정 > Environment Variables에서 `SITE_PASSWORD`
   재설정 후 재배포

## 확장 아이디어 (다음 단계)

- 시나리오 결과(선택 이력)를 Google Sheets 등에 기록해 "본부장급 판단력"
  추이를 시간 순으로 추적.
- 채팅(Claude Code Remote Routine)으로 매일 아침 새 시나리오를 요약해
  알려주는 기능과 연동 — 사이트 기록과 채팅 알림을 이중화.
