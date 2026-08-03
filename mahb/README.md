# MaHB — 회고 (프로토타입)

폴라로이드 형태로 순간을 기록하는 회고 웹앱. 방문자는 코멘트/링크/카테고리/점수 **수정 제안**만 가능하고, 실제 반영은 Claude Code 세션에서 승인해야만 이루어집니다.

## 현재 상태 (프로토타입)

- `GOOGLE_*` 환경변수가 없으면 `data/sample-photos.json`(샘플 10장)을 사용합니다.
- 환경변수를 채우면 코드 변경 없이 실제 Google Sheets 데이터로 자동 전환됩니다.

## 1. Google Sheets 연결

1. 새 Google 스프레드시트를 만들고 시트(탭)를 두 개 만듭니다: `Approved`, `Pending`
   - `Approved!A1:H1` 헤더: `id, imageUrl, color, comment, link, category, score, year`
   - `Pending!A1:F1` 헤더: `photoId, field, proposedValue, submittedAt, ipHash, status`
2. Google Cloud Console에서 서비스 계정을 만들고 JSON 키를 발급합니다.
3. 스프레드시트를 서비스 계정 이메일(`...@...iam.gserviceaccount.com`)에 **편집자**로 공유합니다.
4. `.env.example`을 참고해 `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`를 Vercel 환경변수에 등록합니다.

이미지(`imageUrl`)는 Google Drive 파일 ID를 `lib/drive.ts`의 `driveImageUrl()`로 변환해 넣으면 됩니다 (Drive 파일은 "링크가 있는 모든 사용자"로 공유 필요).

## 2. Telegram 알림 연결

1. 텔레그램에서 봇 `@MaxatHisBest_bot`에게 아무 메시지나 보냅니다(예: `/start`).
2. 브라우저로 아래 주소를 열어 `chat.id` 값을 확인합니다:
   `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
3. `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`를 Vercel 환경변수에 등록합니다.

> ⚠️ 봇 토큰은 이미 대화 중 한 번 노출되었으므로, BotFather에서 `/revoke` 후 재발급하는 것을 권장합니다.

## 3. 로컬 실행

```bash
cd mahb
npm install
npm run dev
```

## 4. Vercel 배포

1. https://vercel.com 에서 "Add New… > Project" 클릭
2. 이 GitHub 리포(`thenaham/msaki`)를 Import 하고, **Root Directory를 `mahb`로 지정**
3. 프로젝트 이름을 `mahb`로 설정 → 배포 후 `mahb.vercel.app`으로 접속 확인
   - 이름이 이미 사용 중이라면 `maxathisbest`로 대체
4. 위 환경변수(Google Sheets, Telegram)를 Vercel 프로젝트 설정 > Environment Variables에 등록 후 재배포

## 승인 워크플로우

1. 방문자가 카드에서 수정 제안 → `Pending` 시트에 `status=pending` 행 추가 + 텔레그램 알림 발송
2. Claude Code 세션에서 `Pending` 시트 검토
3. 승인 시 `Approved` 시트의 해당 값 갱신 + `Pending` 행의 `status`를 `approved`로 변경
4. 반려 시 `status`를 `rejected`로 변경 (Approved 시트는 변경하지 않음)
5. 승인된 값은 즉시 웹사이트에 반영되어 전 세계 어디서나 동일하게 보입니다.

## 색상 8단계

| 색상 | 의미 |
|---|---|
| 회색 | 잊고 싶은 기억 |
| 빨강 | 아직 시작하지 않은, 부정적인 마음 |
| 주황 | 부정에서 조금씩 벗어나려는 단계 |
| 노랑 | 할까 말까 고민하는 애매한 단계 (기본값) |
| 초록 | 긍정적으로 바라보게 된 단계 |
| 파랑 | 긍정을 실제로 시작한 단계 |
| 남색 | 고난 속에서도 지속하며 성과가 보이기 시작 |
| 보라 | 완료하고 자랑스럽게 나눌 수 있는 성취 |
