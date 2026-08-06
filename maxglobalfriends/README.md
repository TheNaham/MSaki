# Maxglobalfriends (프로토타입)

2026.08.06 시작한 "링크드인 10,000명 연결" 프로젝트의 진행 상황을 기록하는
개인용 웹앱. `maxincome`/`tljquiz`와 동일한 Next.js + Vercel + Google Sheets
패턴을 사용합니다.

디자인은 링크드인 블루(#0A66C2) 톤에 세리프(Noto Serif KR / Playfair
Display) 서체를 사용해 구성했습니다.

## 콘텐츠 구조

- `lib/records.ts`의 `GOAL`(10,000), `START_DATE`(2026.08.06) 기준으로
  목표 대비 진행률·일평균 페이스·목표 달성 예상일을 계산합니다.
- 기록 카테고리 4종: `connect`(신규 연결 성사), `outreach`(연결 요청 발송),
  `content`(포스팅 등 인바운드 유입 활동), `milestone`(주요 이정표).
- `data/sample-records.json`에 샘플 데이터가 있습니다 (id, date, count,
  category, highlight, sourceUrl 순).

## 접근 제한 (비공개)

- 전체 사이트가 비밀번호로 보호됩니다 (미들웨어 쿠키 인증).
- 기본 비밀번호는 `8687`이며, Vercel 환경변수 `SITE_PASSWORD`로 재설정할 수
  있습니다. (재설정을 권장합니다 — 코드에 있는 기본값은 임시 편의용입니다.)
- `robots: noindex`로 검색엔진 노출도 차단되어 있습니다.

## 1. Google Sheets 연결 (실시간 연동 시)

1. 새 Google 스프레드시트를 만들고 탭 이름을 `Records`로 지정합니다.
   - 헤더: `id, date, count, category, highlight, sourceUrl`
2. Google Cloud Console에서 서비스 계정을 만들고 JSON 키를 발급합니다.
3. 스프레드시트를 서비스 계정 이메일(`...@...iam.gserviceaccount.com`)에
   **뷰어**로 공유합니다 (읽기 전용이라 편집 권한 불필요).
4. `.env.example`을 참고해 `GOOGLE_SERVICE_ACCOUNT_EMAIL`,
   `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`를 Vercel 환경변수에 등록합니다.
   미설정 시 `data/sample-records.json`을 사용합니다.

## 2. 로컬 실행

```bash
npm install
npm run dev
```

## 3. 새 GitHub 저장소로 이관 (독립 배포 시)

이 폴더는 현재 `tljquiz` 저장소 안에서 프로토타입으로 작성되었습니다.
`TheNaham/maxglobalfriends` 같은 독립 저장소로 옮기려면:

```bash
# 이 폴더만 히스토리 포함해서 새 저장소로 분리하고 싶다면 git subtree/filter-repo 사용,
# 히스토리 없이 현재 코드만 옮기려면 아래처럼 폴더 내용을 새 저장소 루트에 복사
cp -r maxglobalfriends/. <새 저장소 경로>/
cd <새 저장소 경로>
git init
git add .
git commit -m "Initial commit: Maxglobalfriends"
git remote add origin https://github.com/TheNaham/maxglobalfriends.git
git push -u origin main
```

## 4. Vercel 배포

1. https://vercel.com 에서 "Add New… > Project" 클릭
2. 새 저장소(`TheNaham/maxglobalfriends`)를 Import 합니다.
   (`tljquiz` 저장소 안에 그대로 둘 경우, Import 시 **Root Directory를
   `maxglobalfriends`로 지정**)
3. 프로젝트 이름을 `maxglobalfriends`로 설정 → 배포 후
   `maxglobalfriends.vercel.app`으로 접속 확인
4. 필요 시 Vercel 프로젝트 설정 > Environment Variables에서
   `SITE_PASSWORD` 및 Google Sheets 변수 등록 후 재배포

## 확장 아이디어 (다음 단계)

- 매일 발송/연결 수를 Google Sheets에 기록하면 페이스·예상 달성일이 자동
  갱신됨.
- 채팅(Claude Code Remote Routine)으로 매일 아침 전날 실적과 남은 목표를
  요약해 알려주는 기능과 연동.
