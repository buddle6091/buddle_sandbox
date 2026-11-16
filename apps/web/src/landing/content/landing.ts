import type { IntroSegment } from '../fx/intro';

/**
 * 랜딩 v2 내용 — 유일한 수정 지점. 출처: 2026-10 공개용 이력서(docs/handoff/landing-v2/design/Profile.dc.html 의 _data()).
 * v3(2026-11-10): 말투만 1인칭 대화체로 다듬었다 — 사실·수치·기간·고객사 표기는 이력서 그대로.
 * 역할 표기(2026-11-10 사용자 확인): 멘토링을 빼면 메인 강사로 단독 진행한 과정이 아니다 → "가르칩니다 · 강의했습니다 · 담당" 대신
 *   "기술 강사로 참여 · 실습 지도 · 교육 참여" 로 쓴다. 과정 제목 · 시간 · 수치는 그대로.
 * 규칙: 이력서에 없는 수치·채움 문장 금지. 전화번호·생년월일·주소·사진 없음(공개 페이지).
 * 기업 고객사는 업종·대상·일반화된 주제로만, 지자체·학교·공공기관은 실명.
 */

export const SECTION_IDS = [
  'top',
  'about',
  'expertise',
  'philosophy',
  'audience',
  'teaching',
  'mentoring',
  'career',
  'feedback',
  'contact',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** 진행 막대·우측 인디케이터가 가리키는 내비 대상(시안 navDefs) */
export const NAV_SECTIONS: Array<{ id: SectionId; label: string }> = [
  { id: 'about', label: '소개' },
  { id: 'expertise', label: '전문 분야' },
  { id: 'teaching', label: '교육 이력' },
  { id: 'mentoring', label: '멘토링' },
  { id: 'career', label: '개발 경력' },
  { id: 'contact', label: '문의' },
];

/** 헤더의 현재 위치 표시(`buddle / 교육 이력`)용 — 섹션 10개 전부. top 은 표시하지 않는다. */
export const SECTION_LABELS: Record<SectionId, string | null> = {
  top: null,
  about: '소개',
  expertise: '전문 분야',
  philosophy: '교육 철학',
  audience: '산업군',
  teaching: '교육 이력',
  mentoring: '멘토링',
  career: '개발 경력',
  feedback: '후기',
  contact: '문의',
};

export type Stat = { value: number; unit: string; plus?: boolean; label: string };
export type Course = { date: string; hours: string; industry: string; target: string; title: string; tool: string };
export type CareerItem = { period: string; title: string; stack?: string; summary?: string; bullets: string[] };

export const HERO_VIDEO = {
  src: '/hero/glaze-loop.mp4',
  poster: '/hero/glaze-poster.jpg',
  /** 시안 D 의 videoStrength */
  opacity: 0.85,
} as const;

export const LANDING = {
  hero: {
    name: '이상원',
    role: 'Frontend Developer · AX Instructor',
    /** 첫 줄은 크게, 나머지는 본문 크기 */
    lines: [
      '프론트엔드 개발자로 일했고, 지금은 기업과 기관의 AI 교육 현장에서 기술 강사로 실습을 지도합니다.',
      '주니어 때부터 시니어처럼 프로젝트를 책임지고, 처음부터 끝까지 개발을 끌고 간 경험이 제 실습 지도의 바탕이에요.',
      '수강생이 AX 분야에서 자기 비즈니스 문제를 스스로 풀 수 있도록, 눈높이를 맞춰 옆에서 돕고 멘토링합니다.',
    ],
    recentLabel: '최근 참여 과정',
    ctas: [
      { label: '교육 문의하기', href: '#contact' },
      { label: '교육 이력 보기', href: '#teaching' },
    ],
    canvasLabel: {
      light: '청자 유약 방울이 궤도 고리 안에서 천천히 일렁이는 3D 장식',
      dark: '흑요석 구체 둘레로 청자빛 성운 원반이 천천히 도는 3D 장식',
    },
  },

  about: {
    title: '숫자로 먼저 보면',
    stats: [
      { value: 38, unit: '곳', label: '참여 기업 · 기관' },
      { value: 1000, unit: 'h', plus: true, label: '누적 교육 참여 시간' },
      { value: 1200, unit: '명', plus: true, label: '누적 수강 인원' },
      { value: 51, unit: '과정', label: '참여 과정 수' },
      { value: 3, unit: '년 차', label: '프론트엔드 실무 경력' },
    ] satisfies Stat[],
    clientsLabel: 'Clients',
    clientsLine: '노원 미래산업고 · S 반도체 기업 외 기업 · 기관 교육 참여 36곳',
  },

  expertise: {
    title: '현업에서 쓰던 기술로 실습을 지도합니다',
    hint: '분야 이름을 누르면 그 분야만 또렷해져요.',
    groups: [
      {
        title: '개발 스택',
        chips: [
          '프론트엔드 파트 리드 개발',
          'React · Vue3 · NextJS',
          'Python',
          'Monorepo (Nx, Turborepo)',
          'Module Federation',
          '디자인시스템 구축 (Storybook)',
          '외부 기기 (프린터, 태블릿) 기능 연동',
        ],
      },
      {
        title: 'AI · AX',
        chips: ['AI Literacy', '바이브코딩', 'Agent Orchestration 구축', 'Agent · RAG (Python 코드 개발)', 'Claude Code', 'ChatGPT', 'Gemini'],
      },
      {
        title: '과정 운영',
        chips: ['해커톤 · PBL 과정 운영 및 TA', '개발 현업 경험이 필요한 AI 개발 교육', 'AI 프로젝트 개발 멘토링 (온 · 오프라인)'],
      },
    ],
  },

  /**
   * 히어로와 소개 사이 인트로 문장(DayDream 식) — 스크롤에 따라 앞 단어부터 칠해지고, 칩은 장식(aria-hidden).
   * 사실은 기존 값(3년 차 · 38곳 · 기술 강사로 실습 지도)만 쓴다. em 은 그라데이션 강조.
   */
  intro: [
    { text: '3년 차 프론트엔드 개발자로 직접 만들어 본 경험' },
    { chip: 'code', label: '코드' },
    { text: '그대로, 기업 · 기관 38곳의' },
    { chip: 'building', label: '기업 · 기관' },
    { text: 'AI 교육 현장에서 수강생 옆에서' },
    { text: '실습을 함께 풀어요', em: true },
    { chip: 'spark', label: 'AI' },
  ] satisfies IntroSegment[],
  philosophy: {
    sentence:
      '직접 실습해 보고, 그 안에서 CS 지식을 얻고, 내 업무의 Pain Point를 스스로 해결할 수 있겠다는 자신감까지 가져가도록 돕고 싶습니다.',
    support:
      '개발자일 때는 제가 비즈니스 문제를 풀었습니다. 이제는 교육생이 수업을 통해 자기 비즈니스 문제를 스스로 풀 수 있도록, 방향을 잡아 주는 사람이 되려고 합니다.',
  },

  audience: {
    title: '이런 산업군의 교육에 참여했습니다',
    note: '산업군별 누적 교육 참여 시간이에요.',
    hint: '화살표가 붙은 막대를 누르면 아래 교육 이력이 그 산업군으로 걸러집니다.',
    max: 329,
    bars: [
      { name: '전자/반도체', hours: 329 },
      { name: 'IT/제조', hours: 256 },
      { name: '종합상사', hours: 35 },
      { name: '제조 지주', hours: 35 },
      { name: '노원 미래산업고', hours: 35 },
      { name: '에듀테크', hours: 25 },
      { name: '그룹 연수원', hours: 24 },
      { name: '바이오', hours: 24 },
      { name: '제조/배터리', hours: 21 },
      { name: '의료', hours: 19 },
      { name: '레저/서비스', hours: 16 },
      { name: '식품', hours: 16 },
      { name: '광고/마케팅', hours: 15 },
      { name: '그 외 19곳', hours: 119 },
    ],
  },

  teaching: {
    title: '주요 교육 참여 이력',
    roleNote: '멘토링을 제외한 과정은 메인 강사 단독 진행이 아니라 기술 강사(실습 지도)로 참여했습니다.',
    policy:
      '기업 고객사는 비밀유지 의무가 있어 업종 · 대상 계층 · 일반화한 교육 주제로만 적었습니다. 지자체 · 학교 · 공공기관은 실명입니다.',
    filterAll: '전체',
    filterLabel: '대상으로 걸러 보기',
    courses: [
      { date: '2026.09.28 ~ 10.08', hours: '64h', industry: '전자/반도체', target: '개발자', title: 'AI Agent 아키텍트 과정 — Agent 설계 · RAG · MCP · Multi-Agent (8일)', tool: 'Claude Code · OpenAI API' },
      { date: '2026.04.06 ~ 06.22', hours: '256h', industry: '철강', target: '개발자', title: '전문개발 과정 — Agent · RAG 코드 개발 (8회, 회차별 2~5일 블록)', tool: 'Claude Code' },
      { date: '2026.06.11 ~ 07.30', hours: '152h', industry: '전자/반도체', target: '임원', title: '임원 AI 교육 (8차수, 2일씩 총 16일분)', tool: 'Claude Code' },
      { date: '2026.08.24 ~ 09.18', hours: '72h', industry: '전자/반도체', target: '보직장', title: '코딩 에이전트 설계 교육', tool: 'Gemini · Claude Code' },
      { date: '2026.10.12 ~ 10.23', hours: '45h', industry: '전자/반도체', target: '보직장', title: '보직장 바이브코딩 교육 (5일)', tool: 'Claude Code' },
      { date: '2026.10.13 ~ 10.22', hours: '28.5h', industry: '생명보험', target: '핵심인재', title: 'AI-EXPERT PBL 멘토링 (3일)', tool: 'Claude' },
      { date: '2026.09.09 ~ 09.30', hours: '21h', industry: '제조/배터리', target: '핵심인재', title: '하반기 핵심인재 PBL (3일 강의 + 2주간 집중 개발 멘토링)', tool: 'Claude Code' },
      { date: '2026.09.28 ~ 10.15', hours: '6h+', industry: '양주시', target: '공모전 참가자', title: 'AI 공모전 개발 멘토링', tool: 'Claude Code' },
      { date: '2026.01.13 ~ 03.16', hours: '20h', industry: '그룹 연수원', target: '임직원', title: '연수원 순회 AI 교육 (3개 연수소, 5회)', tool: 'Claude Code' },
      { date: '2024', hours: '40h', industry: '노원 미래산업고', target: '고교생', title: '파이썬 기초 과정 및 데이터 시각화 교육', tool: 'Python' },
    ] satisfies Course[],
  },

  mentoring: {
    title: '강의실에서 제가 하는 일',
    lead: '멘토링 · 실습 지도 · 트러블슈팅',
    items: [
      { title: '1:1 실습 밀착 지도', body: '강의 중 실습 구간에서 개별 진도를 확인하고, 막힌 지점은 직접 잡아 드립니다. 컴퓨터 사용이 익숙하지 않은 리더급 수강생도 결과물을 완성하고 돌아가는 것이 제 기준입니다.' },
      { title: '수준별 눈높이 조정', body: '사장단 · 임원부터 실무자, 대졸 신입, 고교생, 비개발 직군까지 실습을 지도해 봤습니다. 같은 주제라도 대상의 업무 맥락에 맞는 예시로 바꿔 설명합니다.' },
      { title: '강의실 환경 대응', body: '네트워크를 이해하고 있어서 강의실의 망 · 접속 문제를 빠르게 파악합니다. 원인은 수강생이 납득할 수 있게 설명하면서 해결해요.' },
      { title: '실습 에러 핸들링', body: '웹 서비스를 처음부터 끝까지 개발 · 운영해 봤기 때문에, 실습과 AI 툴에서 나는 대부분의 에러는 제가 직접 처리합니다. 수업 중 병목이 생겨도 빠르고 유연하게 풀어 갑니다.' },
      { title: 'PBL · 해커톤 코칭', body: '해커톤 · 미니 프로젝트 과정에서는 TA로 팀별 기술 지원을 맡습니다. 문제 정의부터 데모까지, 팀마다 막힌 구간을 같이 풉니다.' },
    ],
  },

  career: {
    title: '교육에서 다루는 건 제가 직접 만들어 본 것들입니다',
    moreLabel: (n: number) => `나머지 ${n}개 더 보기`,
    lessLabel: '접기',
    /** 접힌 상태에서 보이는 불릿 수 */
    collapsedBullets: 3,
    items: [
      {
        period: '2024.08 ~ 2025.12',
        title: '(주) 화이트블록 — 프론트엔드 개발자 (1인 담당)',
        stack: 'React 19 · TypeScript · Next.js · Nx · Module Federation · Rspack · Vite · Jotai · TanStack Query · Radix UI · Tailwind · AG Grid Enterprise · GitHub Actions',
        summary: '대학 캠퍼스 플랫폼 ‘잇츠미 엔터프라이즈’ 프론트엔드 전담 · 3개 모노레포 / 약 205K LOC / 1,323 commits',
        bullets: [
          '잇츠미 엔터프라이즈를 지속 고도화하며 도입 대학을 8개교에서 20개교 이상으로 확장 (경희대, 한국외대, 시립대, 제주대 등), 학교별 요구사항을 공통 기능으로 흡수해 신규 도입 비용 절감',
          'Next.js 단일 앱을 SPA + Module Federation 아키텍처(3 host / 11 remote)로 단독 마이그레이션, 컨벤션 · 폴더 구조 · 패키지 전략 재수립',
          'OpenAPI 스키마 기반 코드 생성 파이프라인 구축 — 55개 도메인의 타입 815개 · React Query 훅 308개 자동 생성으로 API 연동 수작업 제거',
          'React 18 → 19, Next 14 → 15 메이저 업그레이드 단독 수행, 적용 중 발견한 React 코어 버그를 오픈소스 이슈로 등록 · 원인 규명',
          'GitHub Copilot Bot 기반 PR QA 체계 구축 — 코드 컨벤션 · 보안 · 수정사항을 1인 개발 환경에서도 PR 단계에서 자체 관리',
          'PAGER · KDS 외부 기기 연동 프로그램, 현대자동차 블루핸즈 결제 시스템 외주 개발 병행',
        ],
      },
      {
        period: '2023.11 ~ 2024.01',
        title: '(주) 스왈라비 — 일경험 프로그램 체험형 인턴',
        stack: 'React · TypeScript · Recoil · React Query · Emotion · CSS · Axios · Figma',
        bullets: ['소상공인 대상 서비스 프론트엔드 전담 — 전 페이지 · 기능 구현, Figma 공통 컴포넌트를 props 기반으로 설계해 중복 코드 최소화'],
      },
      {
        period: '2023.09',
        title: '2023 항해커톤 우승 (팀스파르타 주최)',
        bullets: ['한글 코딩 서비스 ‘호랑에듀’ LMS 기업 과제 수행, 전체 참가 팀 중 최우수 작품으로 우승 (상금 500만 원)'],
      },
      {
        period: '2023.07 ~ 2023.09',
        title: '(주) 클라 코퍼레이션',
        stack: 'NextJS · TypeScript · Recoil · React Query · Styled-Components · CSS · Axios · AWS Amplify · Figma',
        bullets: ['크리에이터 · 광고주 매칭 플랫폼 ‘크리플래닛’ 초기 빌딩, 디자인 시스템 없이 공통 컴포넌트 체계 구축'],
      },
    ] satisfies CareerItem[],
    education: { title: '교육', school: '한국 IT 직업 전문학교 (학점은행제) 졸업', detail: '2017.03 ~ 2022.02 · 정보보호학 학사 취득' },
    certs: {
      title: '자격증',
      items: [
        { name: 'NCS 확인강사 — 정보기술개발', date: '2026.10' },
        { name: '정보처리 산업기사', date: '2018.12' },
        { name: '네트워크 관리사 2급', date: '2018.12' },
        { name: 'GTQ 1급', date: '2012.12' },
      ],
    },
  },

  feedback: {
    title: '수업이 끝나고 받은 후기',
    note: '수강생 · 교육 담당자 후기입니다. 고객사 실명은 비공개가 원칙이라 업종으로 적었어요.',
    quotes: [
      {
        quote: '기술 강사님의 실습 중 지도로 인해 컴퓨터 사용에 어려움을 가진 팀장님조차 AI 활용에 자신감을 얻게 되었습니다. 큰 도움이 되어 주셔서 감사합니다!',
        from: '물류 대기업 — 영업 / 마케팅 / 신사업 반 교육 담당자',
      },
      {
        quote: '3개월 간의 Agent, RAG 코드 개발 교육에서 힘써 주신 덕분에 3개월(8회차) 교육의 평점이 4.8 / 5 를 달성할 수 있었습니다! 감사함에 따로 편지 드려요!',
        from: 'IT 서비스 대기업 — 교육 담당자',
      },
    ],
  },

  contact: {
    title: 'AX 교육 현장, 실습 지도와 멘토링으로 함께합니다',
    body: '임원부터 실무자, 개발자, 고교생까지. 대상의 업무 맥락에 맞춰 실습을 돕습니다.',
    copyLabel: '이메일 주소 복사',
    copied: '이메일을 복사했어요',
    openMail: '메일 앱으로 보내기',
    email: 'sangwon.lee@buddle.it.kr',
    links: [
      { label: 'GitHub', href: 'https://github.com/buddle6091' },
      { label: 'Tech Blog', href: 'https://velog.io/@buddle6091' },
    ],
  },

  footer: 'buddle · 공개용 프로필 — 고객사 실명과 증빙 자료는 제출용 이력서에 따로 적습니다.',
} as const;

export type Landing = typeof LANDING;
