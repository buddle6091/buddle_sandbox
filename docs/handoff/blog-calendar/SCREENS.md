# SCREENS — 화면·레이아웃 스펙

> 값은 `design.md` 토큰 이름으로 적는다. 와이어프레임 참조는 `Wireframes.dc.html` 의 배지 id.
> 공통: 헤더 = 상단 TopBar, **스크롤 0에서 투명**, 스크롤 후 glass base. 좌 `buddle`(Pretendard 700 lowercase) + 탭(블로그 · 캘린더, 활성 = accent/subtle-bg 알약) / 우 액션.

## A. 글 목록 — `/` (참조 2a)
- 컨테이너 `max-w` 800 중앙, 상단 패딩 space/9.
- 카테고리 탭: 밑줄형(본문 내부 탭), h 40, 활성 = fg/default 2px 밑줄, 비활성 fg/muted. 우측 태그 칩(Badge default / 활성 accent).
- 글 행: grid `1fr 200px`, gap space/7, padding-y space/7, 하단 `border/default`.
  - 제목 h3(20/28/600 → 와이어프레임은 700, **700 채택**), keep-all
  - 요약 body(15) 2줄 clamp, fg/body
  - 메타 caption fg/muted: 카테고리 Badge · 날짜 · 조회 N · 좋아요 N · 댓글 N (구분 ·)
  - 썸네일 16:9 radius/md, border/default. 없으면 grid 1열.
- compact: grid `1fr 84px`, 제목 15/700, 요약 body-sm, 썸네일 h 72. 탭 가로 스크롤+스냅.
- 게시 직후 새 행: height 0→auto + 투명도 300ms.

## B. 글 읽기 — `/posts/[slug]` (참조 2b)
- grid `1fr 180px` gap space/10, `max-w` 900. compact 1열.
- 헤더: Badge(카테고리·태그) → h1(32/40/700, 와이어프레임 34) → 메타 행(Avatar 28 · 작성자 · 날짜 · N분 읽기 · 조회) → `border/default`.
- 본문 body-lg(17/30), h2 24/700, 코드 블록 gray/900 + JetBrains Mono 13, radius/md.
- 하단 반응 바: 중앙 정렬, 알약 Button 44h radius/full ×3 — ♥ 좋아요 N(활성: accent/subtle-bg + accent 테두리) / 조회 N / 댓글 N. 위아래 `border/default`.
- 이전/다음 글: 좌우 2열, caption 라벨 + 14/600 제목.
- 우측 sticky(top 60): 목차(caption 라벨 + 12px 항목, 활성 accent 600) + 세로 ♥ N / 댓글 N 버튼. expanded+ 에서만.
- 댓글 섹션 (space/10 아래): h3 "댓글 N" → 작성 카드(flat Card: 닉네임(선택) 140w · 비밀번호 140w · 「익명」 Badge / Textarea 84h / 하단 caption 안내 + primary 「댓글 남기기」) → 목록(Avatar 32 · 이름 13/600 · 시간 caption · 본문 body · 액션 caption: 답글 · 좋아요 N · (본인) 수정 · 삭제). 답글은 padding-left 44, 작성자 답글에 accent Badge 「작성자」.
- compact: 하단 고정 입력 바(glass base, Input 40h + primary 「등록」).

## C. 에디터 — `/write`, `/write/[id]` (참조 1a + 1c 병합)
- 3열 grid `232px 1fr 300px`. medium은 사이드바 접힘(아이콘 레일), compact는 1열 + 속성은 하단 Sheet.
- TopBar 우측: 저장 상태 텍스트(caption) · 세그먼트 `편집 | md` · 「미리보기」 outline · 「게시하기」 primary.
- 좌 사이드바(bg/subtle, 불투명): 「+ 새 글」 outline 36h → 섹션 라벨(caption 700, 회고/개발) → 글 항목 32h(활성 accent/subtle-bg) → 태그.
- 문서 영역: `max-w` 640, 상단 패딩 space/10, 좌 패딩 88(블록 핸들 자리). Badge 행 → h1 → 블록들.
  - 블록 핸들: 좌측 -44px, `+` 와 `⋮⋮` 18² radius/sm bg/muted. 호버/포커스 블록에 표시(1c는 상시 — **호버 시만** 채택, 터치는 길게 누르기).
  - 포커스 블록 bg accent/subtle-bg radius/sm, margin -8 패딩 8.
  - 슬래시 메뉴: Popover solid, 260w, 섹션 라벨(기본 블록 / 회고 템플릿) + 항목 36h(아이콘 24² bg/muted + 라벨 + 우측 단축 Mono caption). 캐럿 기준 아래 8.
  - 버블 메뉴(1b): 텍스트 선택 시 gray/900 불투명 바, 버튼 26² — B / I / U / 코드 / 링크 / 블록 유형 ▾.
  - 핸들 메뉴: 유형 변경 / 복제 ⌘D / 위로 이동 / 삭제(danger 색).
- 우 속성 패널(bg/subtle): 탭(속성 · 목차 · md 소스) → 상태 세그먼트(초안/검토 중/게시) · 카테고리 Select · 태그 Badge + 추가 · 슬러그 Input Mono · 템플릿 Select · 하단 caption(단어 N · 블록 N · 마지막 수정).
- md 소스(1b 드로어 대신 **속성 패널 탭** 으로 채택): JetBrains Mono 12.5/1.6, frontmatter 포함, 헤딩은 accent/tertiary, 구분선 accent/secondary. 상단 「복사」 「.md 내보내기」. 하단 caption "커서 위치가 양쪽에서 동기화됩니다". 읽기 전용.
- compact: 상단 바 ‹ 글 목록 · 세그먼트 · 게시, 키보드 위 바텀시트 = 블록 칩 행 + 슬래시 메뉴.

## D. 캘린더 — `/calendar/[yyyy-mm]` (참조 1d 기본 + 1e 모바일 리스트)
- TopBar 우측: Badge warning 「초대 전용 · 조회만」 · 이메일 caption · 「로그아웃」 ghost.
- 헤더 행: ‹ › icon Button 32² · 월 제목 28/700 · 「오늘」 ghost / 우측 범례(10² 사각 + 12px 라벨 ×4).
- 필터 칩 행: Button glass 30h radius/full — 기업·기관 ▾ · 유형 ▾ · 기간 ▾ · 장소 ▾(활성 accent 테두리 + subtle-bg), 우측 caption "이번 달 N건 · 강의 N · 멘토링 N".
- 그리드: 7열, 요일 헤더 bg/subtle caption 700(일 danger, 토 accent), 셀 min-h 76 bg/default, 이웃 달 bg/subtle + fg/subtle. 날짜 22² 원(오늘 accent + fg-on). 일정 칩 11/600 padding 3×6 radius/sm, 유형별 subtle-bg + ink 색, 말줄임. 3개 초과 시 「+N」.
- 팝오버: solid glass 260w radius/lg padding space/4 — 유형 Badge + ✕ / 제목 15/600 / kv(52px 라벨 열: 시간·장소·기관·출처). 기관 뒤 Badge 「필터 대상」(소유자만) 또는 「비공개」(마스킹).
- compact: 월 그리드 점 표시(dots 6², 셀 h 40) + 아래 선택일 리스트(flat Card, 좌측 3px 유형 바) 한 스크롤. 필터는 상단 「필터 N」 → 하단 Sheet. TabBar: 블로그 · 캘린더 · 내 계정.
- 게이트 `/calendar`(1d 모바일): 중앙 glass base Card — 「초대받은 캘린더」 18/700 · 설명 · 이메일 Input 44h · primary 「로그인 링크 받기」 · caption 안내.

## E. 반응형 요약
| 화면 | compact 390 | medium 768 | expanded 1280+ |
|---|---|---|---|
| 목록 | 1열, 썸네일 84 | 1열, 썸네일 160 | 1열 800 중앙, 썸네일 200 |
| 읽기 | 1열, 하단 입력 바 | 1열, 목차 숨김 | 본문 + 180 목차 |
| 에디터 | 1열 + 바텀시트 | 레일 + 문서(속성 Sheet) | 232 / 1fr / 300 |
| 캘린더 | 점 그리드 + 리스트 | 칩 그리드(2개 + N) | 칩 그리드 + 팝오버 |
