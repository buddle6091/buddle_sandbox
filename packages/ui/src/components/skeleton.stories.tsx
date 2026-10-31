import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Skeleton } from './skeleton';
import { Labeled } from '../stories/matrix';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** STATES.md 4a — 글 목록 행 스켈레톤 3개 */
const PostRow = ({ width }: { width: string }) => (
  <div className="grid grid-cols-[1fr_200px] gap-7 border-b border-border-default py-7">
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4" style={{ width }} />
      <Skeleton className="h-[11px] w-full" />
      <Skeleton className="h-[11px] w-11/12" />
      <Skeleton className="mt-1 h-[9px] w-2/5" />
    </div>
    <Skeleton className="h-[60px] w-full rounded-md" />
  </div>
);

const ListSkeleton = () => (
  <div className="max-w-[800px]">
    <PostRow width="72%" />
    <PostRow width="58%" />
    <PostRow width="80%" />
  </div>
);

export const PostList: Story = { render: ListSkeleton };
export const PostListDark: Story = { render: ListSkeleton, globals: { theme: 'dark' } };

export const Delayed: Story = {
  name: '300ms 지연 후 표시 (새로고침해서 확인)',
  render: () => (
    <div className="flex flex-col gap-4">
      <Labeled label="delay (300ms)">
        <Skeleton delay className="h-6 w-60" />
      </Labeled>
      <Labeled label="delay=1000">
        <Skeleton delay={1000} className="h-6 w-60" />
      </Labeled>
      <Labeled label="조회수 자리 44×11">
        <Skeleton className="h-[11px] w-11" />
      </Labeled>
    </div>
  ),
};

const Avatars = () => (
  <div className="flex items-end gap-4">
    {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
      <Labeled key={size} label={size}>
        <Avatar size={size}>
          <AvatarFallback>버들</AvatarFallback>
        </Avatar>
      </Labeled>
    ))}
    <Labeled label="image">
      <Avatar size="md">
        <AvatarImage
          alt="buddle"
          src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><rect width='40' height='40' fill='%234275FF'/></svg>"
        />
        <AvatarFallback>버</AvatarFallback>
      </Avatar>
    </Labeled>
  </div>
);

export const AvatarSizes: Story = { name: 'Avatar 24/32/40/56', render: Avatars };
export const AvatarSizesDark: Story = { name: 'Avatar dark', render: Avatars, globals: { theme: 'dark' } };
