import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { LANDING } from '../../src/landing/content/landing';

export const metadata: Metadata = { title: '블로그' };

const velog = LANDING.contact.links.find((l) => l.label === 'Tech Blog');

/**
 * Phase 2(Step 2) 에서 글 목록으로 교체된다. 지금은 정직한 빈 상태 —
 * 범용 EmptyState(점선 상자) 대신 직접 쓴 안내 + 지금 글이 있는 곳(velog, 이력서의 Tech Blog 링크)으로 보낸다.
 */
export default function BlogPage() {
  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-8 px-4 pt-14 pb-24 medium:px-8 medium:pt-20">
      <h1 className="text-h1 text-fg-default medium:text-display">블로그</h1>
      <div className="flex flex-col gap-3 border-t border-border-default pt-8">
        <p className="text-h3 font-semibold text-fg-default">아직 이곳에 올린 글은 없어요.</p>
        <p className="max-w-content text-body-lg text-fg-body">개발 · 회고 · 교육 글을 여기에 올릴 예정입니다. 그 전까지 쓴 글은 velog 에 있어요.</p>
      </div>
      <ul className="flex flex-col border-t border-border-default">
        {velog && (
          <li className="border-b border-border-default">
            <a
              href={velog.href}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group flex items-baseline justify-between gap-4 rounded-sm py-5 text-h3 font-semibold text-fg-default"
            >
              <span className="underline-offset-4 group-hover-fine:underline">velog 에서 글 읽기</span>
              <span className="flex items-center gap-1 font-mono text-label font-normal text-fg-muted">
                velog.io/@buddle6091
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </span>
            </a>
          </li>
        )}
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
