# MaxIncome (프로토타입)

정성열의 커리어·소득 기록을 카드 형태로 보여주는 개인용 웹앱. `mahb`와 동일한
Next.js + Vercel + Google Sheets 패턴을 사용하되, Telegram 연동은 없음 (읽기 전용,
비공개 개인 기록이라 실시간 알림이 필요하지 않음).

디자인은 네이비(#0B1F3A) + 화이트 톤에 세리프(Noto Serif KR / Playfair Display)
서체를 사용한 격식 있는 톤으로 구성했습니다. 금액은 세전(총급여) 기준으로
크게 표시됩니다.

## 접근 제한 (비공개)

- 전체 사이트가 비밀번호로 보호됩니다 (미들웨어 쿠키 인증).
- 기본 비밀번호는 `8687`이며, Vercel 환경변수 `SITE_PASSWORD`로 재설정할 수 있습니다.
  (재설정을 권장합니다 — 코드에 있는 기본값은 임시 편의용입니다.)
- `robots: noindex`로 검색엔진 노출도 차단되어 있습니다.

회사명은 실명 대신 코드네임(영문)을 사용합니다 — 앱 화면과 시트 데이터 모두 동일.
각 카드 우측 상단의 작은 `↗` 아이콘을 누르면 Drive에 있는 원본 증빙 문서로 이동합니다.

## 현재 상태 (프로토타입)

- `GOOGLE_*` 환경변수가 없으면 `data/sample-records.json`(6건, 코드네임 적용)을 사용합니다.
- 환경변수를 채우면 코드 변경 없이 실제 Google Sheets 데이터로 자동 전환됩니다.
- 연동용 Google Sheet가 이미 생성되어 있습니다: [MaxIncome Records (v2)](https://docs.google.com/spreadsheets/d/1SQIc39aQ-zdcHXdk7P9dSwnuBbb-aprcVFCGQPK4z-U/edit)
  (sample-records.json과 동일한 데이터 + 원본 문서 링크(`sourceUrl`) 포함)
  - ⚠️ 이전에 만든 `MaxIncome Records`(실명 포함, id: `1frEMljK7...`)는 더 이상 쓰지 않습니다.
    실수로 공유되지 않도록 Drive에서 직접 삭제해 주세요 (MCP 도구로는 파일 삭제가 불가능해 수동 삭제가 필요합니다).

## 1. Google Sheets 연결 (실시간 연동 시 아래 3가지를 직접 진행해 주세요)

1. 위 v2 시트를 열어 탭 이름을 `Sheet1` → `Records`로 변경합니다 (탭 이름 변경은 Drive API로 대신할 수 없어 수동 작업이 필요합니다).
   - 헤더는 이미 `id, company, period, role, amount, highlight, category, year, sourceUrl` 순서로 들어가 있습니다.
2. Google Cloud Console에서 서비스 계정을 만들고 JSON 키를 발급합니다.
3. 스프레드시트를 서비스 계정 이메일(`...@...iam.gserviceaccount.com`)에 **뷰어**로 공유합니다 (읽기 전용이라 편집 권한 불필요).
4. `.env.example`을 참고해 `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`를 Vercel 환경변수에 등록합니다.

## 2. 로컬 실행

```bash
cd maxincome
npm install
npm run dev
```

## 3. Vercel 배포

1. https://vercel.com 에서 "Add New… > Project" 클릭
2. 이 GitHub 리포(`thenaham/msaki`)를 Import 하고, **Root Directory를 `maxincome`으로 지정**
3. 프로젝트 이름을 `maxincome`으로 설정 → 배포 후 `maxincome.vercel.app`으로 접속 확인
4. 위 Google Sheets 환경변수를 Vercel 프로젝트 설정 > Environment Variables에 등록 후 재배포

## 보안 메모

- Telegram 봇 토큰 같은 비밀값은 절대 코드에 하드코딩하지 않고 환경변수로만 관리합니다.
- 이 앱은 개인 소득/커리어 정보를 다루므로 `robots: noindex`로 검색엔진 노출을 막고,
  민감한 원본 서류(주민등록번호 등)는 절대 레코드 데이터에 포함하지 않습니다.
- 현재 화면(및 최신 커밋)에는 회사 실명 대신 코드네임만 노출됩니다. 다만 **git 히스토리의
  이전 커밋에는 실명이 남아 있습니다** — GitHub 저장소가 비공개인지 다시 한번 확인해 주시고,
  히스토리까지 완전히 지우려면 별도로 요청해 주세요 (rebase/squash 또는 새 저장소 이관 필요).
