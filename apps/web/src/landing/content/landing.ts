/**
 * 랜딩 내용 — 유일한 수정 지점. 출처: 「이상원 강사 이력서」(2026-10).
 * 규칙: 이력서에 없는 수치·채움 문장 금지. 전화번호·생년월일·주소는 싣지 않는다(공개 페이지).
 */

export const SECTION_IDS = [
  'hero',
  'stats',
  'philosophy',
  'curriculum',
  'audience',
  'mentoring',
  'experience',
  'feedback',
  'contact',
] as const;
export type SectionId = (typeof SECTION_IDS)[number];

export type Stat = {
  /** 숫자(롤링 대상) */
  value: number;
  /** 단위·접미(곳, h, 명, 과정, 년 차) */
  unit: string;
  /** "이상" 표기(이력서의 ▲) */
  plus?: boolean;
  label: string;
};

export type Org = { name: string; hours: number; masked?: boolean };

export const LANDING = {
  hero: {
    name: '이상원',
    latin: 'SANGWON LEE',
    role: 'Frontend Developer · AX Instructor',
    tagline:
      '주니어 시절부터 시니어처럼 모든 프로젝트에 책임을 가지고 처음부터 끝까지 개발을 이끌어간 경험을 바탕으로, 수강생이 AX 분야에서 비즈니스 문제를 스스로 해결할 수 있게 컨설팅하는 강의를 합니다.',
    ctas: [
      { label: '글 보기', href: '/blog' },
      { label: '캘린더', href: '/calendar' },
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/buddle6091' },
      { label: 'velog', href: 'https://velog.io/@buddle6091' },
    ],
  },

  stats: [
    { value: 34, unit: '곳', label: '담당 기업 · 기관' },
    { value: 800, unit: 'h', plus: true, label: '누적 강의 시간' },
    { value: 1200, unit: '명', plus: true, label: '누적 수강 인원' },
    { value: 48, unit: '과정', label: '담당 과정 수' },
    { value: 3, unit: '년 차', label: '프론트엔드 실무 경력' },
  ] satisfies Stat[],

  philosophy: {
    eyebrow: 'Teaching Philosophy',
    title: '직접 해 보고, 스스로 풀 수 있다는 자신감까지',
    paragraphs: [
      '직접 실습해 보고 그 실습 안에서 얻는 CS 지식과 내 업무의 Pain Point 를 내 스스로 해결할 수 있겠다는 자신감을 가질 수 있게 하는 교육을 지향합니다.',
      '개발자로서 비즈니스 문제를 해결했던 경험을, 이제는 교육생 스스로 수업을 통해 자신의 비즈니스 문제를 해결할 수 있는 능력을 가질 수 있게 방향을 제시해 주는 사람이 되려고 합니다.',
    ],
    method: {
      label: '강의 자료 설계 방식',
      steps: ['문제', '원인 분석', '해결', '검증', '학습 포인트', '예방 조치'],
      note: '실무에서 남긴 1,200줄 규모의 트러블슈팅 기록 구조를 그대로 강의 자료에 씁니다.',
    },
  },

  curriculum: {
    eyebrow: 'Curriculum Coverage',
    title: '담당 가능 커리큘럼',
    groups: [
      {
        label: '웹 개발',
        items: [
          '프론트엔드 파트 리드 개발',
          'React · Vue3 · Next.js',
          'Monorepo (Nx · Turborepo)',
          'Module Federation',
          '디자인시스템 구축 (Storybook)',
          '외부 기기(프린터 · 태블릿) 연동',
        ],
      },
      {
        label: 'AI · AX',
        items: [
          'AI Literacy',
          '바이브코딩',
          'Agent Orchestration 구축',
          'Agent · RAG (Python 코드 개발)',
          'Claude Code',
          'ChatGPT',
          'Gemini',
        ],
      },
      {
        label: '과정 운영',
        items: ['해커톤 등 PBL 과정', '개발 현업 경험이 필요한 개발 교육', '해커톤 TA · 기술 지원'],
      },
    ],
  },

  audience: {
    eyebrow: 'Audience',
    title: '교육 대상 기업 · 기관',
    note: '누적 34곳. 표기 시간은 강의 이력에 기재된 확정 과정 기준입니다.',
    orgs: [
      { name: '삼성전자', hours: 329 },
      { name: '포스코DX', hours: 256 },
      { name: '포스코인터내셔널', hours: 35 },
      { name: '한솔그룹', hours: 35 },
      { name: '노원 미래산업고', hours: 35 },
      { name: '팀스파르타 AX 교육팀', hours: 25 },
      { name: '삼성인력개발원', hours: 24 },
      { name: '삼성바이오에피스', hours: 24 },
      { name: '세방전지', hours: 21 },
      { name: '씨젠의료재단', hours: 19 },
      { name: '롯데월드', hours: 16 },
      { name: '농심', hours: 16 },
      { name: '애드이피션시', hours: 15 },
    ] as Org[],
    rest: { count: 19, hours: 119 },
  },

  mentoring: {
    eyebrow: 'Mentoring',
    title: '멘토링 · 실습 지도',
    items: [
      {
        title: '1:1 실습 밀착 지도',
        body: '강의 중 실습 구간에서 개별 진도를 확인하며 막힌 지점을 직접 잡아 드립니다. 컴퓨터 사용이 익숙하지 않은 리더급 수강생도 결과물을 완성하고 돌아가는 것을 기준으로 삼습니다.',
      },
      {
        title: '수준별 눈높이 조정',
        body: '사장단 · 임원부터 실무자, 대졸 신입, 고교생, 비개발 직군까지 담당했습니다. 같은 주제라도 대상의 업무 맥락에 맞춰 실습 과제와 예시를 다시 설계합니다.',
      },
      {
        title: '팀 리드 · 코드리뷰',
        body: '프론트엔드 팀장으로 팀을 리드하며 컨벤션 수립과 코드리뷰로 동료 개발자의 성장을 지원했고, 아키텍처 문서와 트러블슈팅 기록을 팀 학습 자산으로 남겼습니다.',
      },
      {
        title: 'PBL · 해커톤 코칭',
        body: '해커톤 · 미니 프로젝트 과정에서 TA 로 팀별 기술 지원을 맡아, 문제 정의부터 데모까지 각 팀의 막힌 구간을 함께 풀어냅니다.',
      },
    ],
  },

  experience: {
    eyebrow: 'Experience',
    title: '강의 이력과 그 근거가 된 실무',
    teaching: [
      {
        year: '2026',
        role: '기업 · 기관 대상 AI · 개발 교육 (강사)',
        items: [
          { org: '삼성전자', course: '임원 AI 교육 (8차수 · 16일)', hours: 152 },
          { org: '삼성전자', course: 'DS 보직장 교육 (9회)', hours: 72 },
          { org: '삼성전자', course: 'DS부문 B Track : AI Agent 설계 (8일)', hours: 64 },
          { org: '포스코DX', course: '전문개발 과정 — Agent · RAG 코드 개발 (8회)', hours: 256 },
          { org: '포스코인터내셔널', course: '바이브코딩 교육 (2일 차수 × 2회)', hours: 28 },
          { org: '한솔그룹 · 한솔홀딩스', course: '서울역 교육 (3회) · 클로드 코드 교육', hours: 35 },
          { org: '세방전지', course: '하반기 핵심인재 PBL (3일)', hours: 21 },
          { org: '삼성바이오에피스', course: 'Claude Code 교육 (2일) · 운영지표 리포팅', hours: 24 },
        ],
        more: '씨젠의료재단 · 롯데월드 · 농심 · 애드이피션시 · 셀트리온 · 카카오페이 · LIG D&A · 크래프톤 · 현대중공업 등',
      },
      {
        year: '2024',
        role: '팀스파르타 DX 교육팀 AI 기술 튜터 (프리랜서)',
        items: [
          { org: '팀스파르타', course: 'AI 해커톤 TA (24시간 연속) · TA OT', hours: 25 },
          { org: '노원 미래산업고', course: '튜터 근무 (5회)', hours: 35 },
          { org: '롯데지주', course: '튜터 근무 (2일)', hours: 11 },
          { org: '한국투자증권', course: '기술튜터 근무', hours: 8 },
        ],
        more: '애드이피션시 · 한섬',
      },
    ],
    career: [
      {
        org: '(주) 화이트블록',
        role: '프론트엔드 · 팀 리드',
        period: '2024.08 – 2025.12',
        stack: 'React 19 · TypeScript · Next.js · Nx · Module Federation · Rspack · Vite · Jotai · TanStack Query · Radix UI · Tailwind · AG Grid · GitHub Actions',
        summary: '대학 캠퍼스 F&B 플랫폼 1인 담당 · 도입 학교 20개교 이상 · 3개 모노레포 / 약 205K LOC / 1,323 commits',
        highlights: [
          'Next.js 단일 앱의 한계를 진단하고 컨벤션 · 폴더 구조 · 패키지 전략을 재수립한 뒤, SPA + Module Federation 아키텍처(3 host / 11 remote)로 직접 마이그레이션',
          'React 18 → 19, Next 14 → 15 메이저 업그레이드를 단독 수행. use 훅 적용 중 발견한 React 코어 버그를 오픈소스 이슈로 등록 · 원인 규명',
          'OpenAPI 스키마 기반 코드 생성 파이프라인(약 1,000줄)으로 55개 도메인의 타입 815개 · React Query 훅 308개를 자동 생성',
          '아키텍처 문서, 1,200줄 규모의 트러블슈팅 기록, 클린 아키텍처 가이드 작성',
        ],
      },
      {
        org: '(주) 스왈라비 · (주) 클라 코퍼레이션',
        role: '프론트엔드',
        period: '2023.07 – 2024.01',
        stack: 'React · Next.js · TypeScript · Recoil · React Query · Emotion · Styled-Components · AWS Amplify · Figma',
        summary: '소상공인 프로젝트 전 페이지 제작 · 크리에이터-광고주 매칭 플랫폼 초기 빌딩, 디자인 시스템 부재 속 공통 컴포넌트 개발',
        highlights: [],
      },
    ],
    award: { title: '2023 항해커톤 우승 (팀스파르타 주최)', body: '한글 코딩 서비스 「호랑에듀」 LMS 기업 과제 — 동일 기업 과제 및 전체 참가 팀 중 최우수 작품' },
  },

  feedback: {
    eyebrow: 'Feedback',
    title: '수강생 · 교육 담당자 후기',
    quotes: [
      {
        quote:
          '기술 강사님의 실습 중 지도로 인해 컴퓨터 사용에 어려움을 가진 팀장님조차 AI 활용에 자신감을 얻게 되었습니다. 큰 도움이 되어 주셔서 감사합니다!',
        from: '롯데 글로벌 로직스 — 영업 / 마케팅 / 신사업 반 교육 담당자',
      },
      {
        quote:
          '3개월 간의 Agent, RAG 코드 개발 교육에서 힘써 주신 덕분에 3개월(8회차) 교육의 평점이 4.8 / 5 를 달성할 수 있었습니다! 감사함에 따로 편지 드려요!',
        from: '포스코 DX — 교육 담당자',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: '강의 · 멘토링 문의',
    body: '기업 · 기관 AI 교육, 프론트엔드 실무 교육, 해커톤 TA 를 맡습니다. 대상과 기간을 알려 주시면 커리큘럼을 함께 설계합니다.',
    email: 'buddle6091@naver.com',
    links: [
      { label: 'GitHub', href: 'https://github.com/buddle6091' },
      { label: 'velog', href: 'https://velog.io/@buddle6091' },
    ],
  },
} as const;

export type Landing = typeof LANDING;
