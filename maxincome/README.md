# MaxIncome (프로토타입)

정성열의 커리어·소득 기록을 카드 형태로 보여주는 개인용 웹앱. `mahb`와 동일한
Next.js + Vercel + Google Sheets 패턴을 사용하되, Telegram 연동은 없음 (읽기 전용,
비공개 개인 기록이라 실시간 알림이 필요하지 않음).

## 현재 상태 (프로토타입)

- `GOOGLE_*` 환경변수가 없으면 `data/sample-records.json`(샘플 2건)을 사용합니다.
- 환경변수를 채우면 코드 변경 없이 실제 Google Sheets 데이터로 자동 전환됩니다.

## 1. Google Sheets 연결

1. 새 Google 스프레드시트를 만들고 시트(탭) `Records`를 만듭니다.
   - `Records!A1:H1` 헤더: `id, company, period, role, amount, highlight, category, year`
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
