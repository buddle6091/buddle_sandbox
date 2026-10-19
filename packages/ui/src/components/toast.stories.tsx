import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { toast, Toaster, toastUndo } from './toast';

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

const Triggers = () => (
  <div className="flex flex-wrap gap-3">
    <Button onClick={() => toast('글을 게시했어요', { action: { label: '보기', onClick: () => undefined } })}>
      게시 완료
    </Button>
    <Button variant="outline" onClick={() => toast('잠시 후 다시 시도해 주세요')}>
      좋아요 실패
    </Button>
    <Button variant="danger" onClick={() => toastUndo('댓글을 삭제했어요', () => toast('복구했어요'))}>
      삭제 (실행 취소 5s)
    </Button>
    <Button variant="ghost" onClick={() => toast('이 캘린더는 조회만 가능해요')}>
      조회 전용 (compact)
    </Button>
  </div>
);

export const Light: Story = { render: Triggers };
export const Dark: Story = { render: Triggers, globals: { theme: 'dark' } };
