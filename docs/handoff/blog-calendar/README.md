# Handoff: 블로그 + 비공개 캘린더 (apps/web)

> Claude Design에서 그린 와이어프레임을 `buddle_sandbox` 모노레포에 구현하기 위한 핸드오프 문서.
> 동반: 루트 `CLAUDE.md`(규칙), `design.md` v0.2(토큰 SSOT), `sandbox-roadmap.md`(Phase), `docs/state/handoff.md`(상태 원장).
> 구현 프롬프트는 `PROMPT.md`, 화면별 스펙은 `SCREENS.md`, 상태·예외는 `STATES.md`.

## 이 번들에 대해
- `wireframes/Wireframes.dc.html` 은 **HTML로 그린 디자인 참고물**이다. 브라우저로 열면 보이고, 캔버스 모드라 드래그·휠로 이동/확대한다. 코드로 복사하지 않는다.
- 작업은 **이 화면들을 Next.js 16 App Router + `@sandbox/ui` + `@sandbox/tokens` 로 다시 구현**하는 것이다.
- 충실도: **중간(mid-fi)**. 레이아웃·정보 구조·상태·모션 규칙은 확정, 픽셀 값은 `design.md` 토큰으로 치환한다. 와이어프레임의 hex는 참고용이며 코드에 하드코딩하지 않는다.

## 와이어프레임 읽는 법
파일 안은 턴(section) 단위, 최신이 위. 각 안은 `1a`·`2b` 같은 배지로 식별한다.

| 턴 | 내용 | 채택 |
|---|---|---|
| 4 | 상태·예외 11묶음 (4a~4k) | **전부 채택** → `STATES.md` |
| 3 | 헤더 탐색 (세로 레일 3안) | **미채택** — 참고용. 헤더는 상단 투명 바로 확정 |
| 2 | 글 목록 (2a) · 게시글 읽기 (2b) | **채택** |
| 1 | 에디터 3안 (1a~1c) · 캘린더 3안 (1d~1f) | 에디터 **1a 기본 + 1c 속성 패널 병합**, 캘린더 **1d 기본 + 1e 선택일 리스트(모바일)** |

## 범위 (1차 — 둘 다 한 번에)
1. **블로그** — 글 목록 / 글 읽기 / 블록 에디터(노션식, md 소스 토글) / 태그·카테고리 / 검색 / 익명 댓글 / 좋아요 / 조회수
2. **비공개 캘린더** — 초대 로그인(매직 링크) / 월간 뷰 / 일정 팝오버 / 필터(기업·기관, 유형, 기간, 장소) / Google Calendar 읽기 전용 동기화 / 기업·기관명 마스킹 규칙

## 서체 결정 (design.md와 일치)
- 모든 위계 **Pretendard Variable**, 코드 **JetBrains Mono**. 세리프 없음.
- 이 번들의 와이어프레임도 같은 기준으로 그렸다 (`--ds-font-serif`는 Pretendard로 재지정된 상태).

## ⚠ 먼저 확인할 것 — 토큰 레이어 불일치
`libs/tokens/src/semantic.css` 는 아직 **v0.1(indigo, glass 토큰 없음)** 이다. `design.md` 는 v0.2(벽청/청자/자운 + glass/glaze/shadow). 화면 구현 전에 토큰을 v0.2로 올려야 한다 → `PROMPT.md` Step 0.

## 파일
- `PROMPT.md` — Claude Code에 붙여넣을 작업 프롬프트 (Step 0~5)
- `SCREENS.md` — 화면·컴포넌트·레이아웃 스펙
- `STATES.md` — 로딩/빈/오류/확인/성공 상태 전수
- `DATA.md` — 데이터 모델·API·권한·동기화 규칙
- `wireframes/` — 디자인 참고 HTML (+ 로컬 토큰 CSS)
