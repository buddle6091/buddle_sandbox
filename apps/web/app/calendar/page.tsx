import type { Metadata } from 'next';
import Link from 'next/link';

import { LANDING } from '../../src/landing/content/landing';

export const metadata: Metadata = { title: '캘린더', robots: { index: false } };

/** Phase 2(Step 3) 에서 초대 로그인 게이트로 교체된다. 지금은 어떤 화면이 될지와 문의 경로만 정직하게 적는다. */
export default function CalendarPage() {
  const email = LANDING.contact.email;
  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-8 px-4 pt-14 pb-24 medium:px-8 medium:pt-20">
      <h1 className="text-h1 text-fg-default medium:text-display">캘린더</h1>
      <div className="flex flex-col gap-3 border-t border-border-default pt-8">
        <p className="text-h3 font-semibold text-fg-default">초대받은 분만 볼 수 있는 일정표예요.</p>
        <p className="max-w-content text-body-lg text-fg-body">
          교육 · 멘토링 일정을 초대 링크로 로그인한 뒤 볼 수 있게 만드는 중입니다. 아직 열리지 않았어요.
        </p>
      </div>
      <ul className="flex flex-col border-t border-border-default">
        <li className="border-b border-border-default">
          <a href={`mailto:${email}`} className="focus-ring group flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-sm py-5 text-h3 font-semibold text-fg-default">
            <span className="underline-offset-4 group-hover-fine:underline">일정이 궁금하면 메일 주세요</span>
            <span className="font-mono text-label font-normal text-fg-muted">{email}</span>
          </a>
        </li>
        <li className="border-b border-border-default">
          <Link href="/" className="focus-ring group flex items-baseline justify-between gap-4 rounded-sm py-5 text-h3 font-semibold text-fg-default">
            <span className="underline-offset-4 group-hover-fine:underline">소개로 돌아가기</span>
            <span className="font-mono text-label font-normal text-fg-muted">/</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
