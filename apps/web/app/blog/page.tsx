import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@sandbox/ui/components/button';
import { EmptyState } from '@sandbox/ui/components/empty-state';

export const metadata: Metadata = { title: '블로그' };

/** Phase 2(Step 2) 에서 글 목록으로 교체된다. 지금은 정직한 빈 상태. */
export default function BlogPage() {
  return (
    <div className="mx-auto max-w-[800px] px-4 pt-9">
      <h1 className="text-h1">블로그</h1>
      <EmptyState
        title="글을 준비하고 있어요"
        description="개발 · 회고 · 강의 글이 여기에 올라와요."
        action={
          <Button asChild variant="outline">
            <Link href="/">소개로 돌아가기</Link>
          </Button>
        }
      />
    </div>
  );
}
