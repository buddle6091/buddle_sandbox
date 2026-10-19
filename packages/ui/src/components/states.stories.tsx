import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { Button } from './button';
import { EmptyState } from './empty-state';
import { ErrorState } from './error-state';
import { SyncBanner } from './sync-banner';
import { Labeled } from '../stories/matrix';

const meta = {
  title: 'Components/States',
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** STATES.md 4b · 4c · 4j */
const All = () => (
  <div className="flex max-w-[800px] flex-col gap-10">
    <Labeled label="빈 상태 — 글 없음 (소유자)">
      <EmptyState
        title="아직 글이 없어요"
        description="첫 글을 쓰면 여기에 보여요."
        action={<Button>새 글 쓰기</Button>}
      />
    </Labeled>
    <Labeled label="빈 상태 — 검색 0건 + 추천 칩">
      <EmptyState
        title={<>「react 19」 검색 결과가 없어요</>}
        description="맞춤법을 확인하거나 다른 단어로 찾아 보세요."
        action={
          <div className="flex gap-2">
            <Badge asChild variant="outline">
              <a href="#q=react">react</a>
            </Badge>
            <Badge asChild variant="outline">
              <a href="#q=server-components">server components</a>
            </Badge>
          </div>
        }
      />
    </Labeled>
    <Labeled label="빈 상태 — 빈 달">
      <EmptyState
        title="10월에는 일정이 없어요"
        description="구글 캘린더에 등록되면 10분 안에 반영돼요."
        action={
          <Button variant="outline" size="sm">
            가장 가까운 일정으로 · 11월 3일
          </Button>
        }
      />
    </Labeled>
    <Labeled label="오류 상태">
      <ErrorState title="글 목록을 불러오지 못했어요" onRetry={() => undefined} debug="GET /posts · 503" />
    </Labeled>
    <Labeled label="동기화 띠 — 연결 끊김 (소유자)">
      <SyncBanner variant="warning" action={{ label: '다시 연결', onClick: () => undefined }}>
        구글 캘린더와 연결이 끊겼어요. 10월 2일 14:00 기준 일정이에요.
      </SyncBanner>
    </Labeled>
    <Labeled label="동기화 띠 — 지연">
      <SyncBanner variant="subtle">마지막 동기화 3시간 전 · 평소보다 늦어지고 있어요</SyncBanner>
    </Labeled>
    <Labeled label="동기화 띠 — 실패">
      <SyncBanner variant="danger" action={{ label: '다시 시도', onClick: () => undefined }}>
        일정을 불러오지 못했어요.
      </SyncBanner>
    </Labeled>
    <Labeled label="오프라인 띠 (상단 gray/900)">
      <SyncBanner variant="inverse" dot="warning">
        오프라인 · 저장된 글을 보여주고 있어요
      </SyncBanner>
    </Labeled>
    <Labeled label="재연결 (success 1.5s 후 접힘)">
      <SyncBanner variant="inverse" dot="success">
        다시 연결됐어요
      </SyncBanner>
    </Labeled>
  </div>
);

export const Light: Story = { render: All };
export const Dark: Story = { render: All, globals: { theme: 'dark' } };
