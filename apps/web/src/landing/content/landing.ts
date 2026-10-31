/**
 * 랜딩 v2 내용 — 유일한 수정 지점. 출처: 2026-10 공개용 이력서(docs/handoff/landing-v2/design/Profile.dc.html 의 _data()).
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
  { id: 'teaching', label: '강의 이력' },
  { id: 'mentoring', label: '멘토링' },
  { id: 'career', label: '개발 경력' },
  { id: 'contact', label: '문의' },
];

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
    badge: 'AI · 프론트엔드 교육 강사',
    name: '이상원',
    role: 'Frontend Developer · AX Instructor',
    tagline:
      '주니어 시절부터 시니어처럼 모든 프로젝트에 책임을 가지고, 처음부터 끝까지 개발을 이끌어 간 경험을 바탕으로 수강생이 AX 분야에서 비즈니스 문제를 스스로 해결할 수 있도록 눈높이를 맞춘 컨설팅형 강의를 진행합니다.',
    ctas: [
      { label: '강의 문의하기', href: '#contact' },
      { label: '강의 이력 보기', href: '#teaching' },
    ],
    canvasLabel: {
      light: '청자 유약 방울이 궤도 고리 안에서 천천히 일렁이는 3D 장식',
      dark: '흑요석 구체 둘레로 청자빛 성운 원반이 천천히 도는 3D 장식',
    },
  },

  about: {
    stats: [
      { value: 38, unit: '곳', label: '담당 기업 · 기관' },
      { value: 1000, unit: 'h', plus: true, label: '누적 강의 시간' },
      { value: 1200, unit: '명', plus: true, label: '누적 수강 인원' },
      { value: 51, unit: '과정', label: '담당 과정 수' },
      { value: 3, unit: '년 차', label: '프론트엔드 실무 경력' },
    ] satisfies Stat[],
    clientsLabel: 'Clients',
    clientsLine: '노원 미래산업고 · S 반도체 기업 외 기업 · 기관 출강 36곳',
  },

  expertise: {
    eyebrow: 'EXPERTISE & SKILLS',
    title: '현업 개발 역량을 그대로 교육으로',
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

  philosophy: {
    eyebrow: 'TEACHING PHILOSOPHY',
    sentence:
      '직접 실습해 보고, 그 실습 안에서 얻는 CS 지식과 내 업무의 Pain Point를 스스로 해결할 수 있겠다는 자신감을 갖게 하는 교육을 지향합니다.',
    support:
      '개발자로서 비즈니스 문제를 해결했던 경험을 바탕으로, 이제는 교육생이 수업을 통해 자신의 비즈니스 문제를 스스로 해결할 수 있는 능력을 갖추도록 방향을 제시하는 사람이 되려고 합니다.',
  },

  audience: {
    eyebrow: 'AUDIENCE',
    title: '교육 대상 산업군',
    note: '산업군별 누적 강의 시간입니다.',
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
    eyebrow: 'TEACHING EXPERIENCE',
    title: '주요 강의 이력',
    policy:
      '기업 고객사는 비밀유지 의무에 따라 업종 · 대상 계층 · 일반화된 교육 주제로만 표기하고, 지자체 · 학교 · 공공기관은 실명으로 표기합니다. 옆으로 넘겨 보세요.',
    deckLabel: '주요 강의 이력 카드 목록',
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
    eyebrow: 'MENTORING',
    title: '멘토링 · 실습 지도 · 트러블슈팅',
    items: [
      { title: '1:1 실습 밀착 지도', body: '강의 중 실습 구간에서 개별 진도를 확인하며 막힌 지점을 직접 잡아 드립니다. 컴퓨터 사용이 익숙하지 않은 리더급 수강생도 결과물을 완성하고 돌아가는 것을 기준으로 삼습니다.' },
      { title: '수준별 눈높이 조정', body: '사장단 · 임원부터 실무자, 대졸 신입, 고교생, 비개발 직군까지 담당했습니다. 같은 주제라도 대상의 업무 맥락에 맞춰 실습 과제와 예시를 다시 설계합니다.' },
      { title: '강의실 환경 대응', body: '네트워크에 대한 이해를 바탕으로 강의실의 망 · 접속 문제를 빠르게 파악하고, 수강생이 납득할 수 있게 원인을 안내하며 해결합니다.' },
      { title: '실습 에러 핸들링', body: '웹 서비스를 처음부터 끝까지 개발 · 운영한 경험으로 실습과 AI 툴에서 발생하는 대부분의 에러를 직접 처리해, 수업 중 병목에 빠르고 유연하게 대처합니다.' },
      { title: 'PBL · 해커톤 코칭', body: '해커톤 · 미니 프로젝트 과정에서 TA로 팀별 기술 지원을 맡아, 문제 정의부터 데모까지 각 팀의 막힌 구간을 함께 풀어냅니다.' },
    ],
  },

  career: {
    eyebrow: 'DEVELOPER CAREER',
    title: '가르치는 내용은 직접 만들어 본 것들입니다',
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
    eyebrow: 'FEEDBACK',
    title: '수강생 · 교육 담당자 후기',
    note: '고객사 실명은 비공개 원칙에 따라 업종으로 표기합니다.',
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
    title: '팀에 맞는 AX 교육을 함께 설계합니다',
    body: '임원부터 실무자, 개발자, 고교생까지 대상의 업무 맥락에 맞춰 과정을 구성합니다.',
    email: 'sangwon.lee@buddle.it.kr',
    links: [
      { label: 'GitHub', href: 'https://github.com/buddle6091' },
      { label: 'Tech Blog', href: 'https://velog.io/@buddle6091' },
    ],
  },

  footer: 'buddle · 공개용 프로필 — 고객사 실명과 증빙 자료는 제출용 이력서에 별도로 기재합니다.',
} as const;

export type Landing = typeof LANDING;
