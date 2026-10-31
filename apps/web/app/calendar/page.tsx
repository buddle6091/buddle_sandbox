import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@sandbox/ui/components/button';
import { EmptyState } from '@sandbox/ui/components/empty-state';

export const metadata: Metadata = { title: '캘린더', robots: { index: false } };

/** Phase 2(Step 3) 에서 초대 로그인 게이트로 교체된다. */
export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 pt-9">
      <h1 className="text-h1">캘린더</h1>
      <EmptyState
        title="초대받은 분만 볼 수 있어요"
        description="강의 · 멘토링 일정은 초대 링크로 로그인한 뒤 볼 수 있어요. 준비 중입니다."
        action={
          <Button asChild variant="outline">
            <Link href="/">소개로 돌아가기</Link>
          </Button>
        }
      />
    </div>
  );
}
