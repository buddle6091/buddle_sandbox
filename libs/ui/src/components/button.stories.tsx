import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, Search } from 'lucide-react';

import { Button } from './button';
import { Labeled, Matrix } from '../stories/matrix';

const VARIANTS = ['primary', 'glass', 'secondary', 'ghost', 'outline', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg', 'icon'] as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: '글 게시하기', variant: 'primary', size: 'md' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const AllVariants = () => (
  <Matrix
    rows={VARIANTS}
    cols={SIZES}
    render={(variant, size) => (
      <Button variant={variant} size={size} aria-label={size === 'icon' ? '검색' : undefined}>
        {size === 'icon' ? <Search /> : '글 게시하기'}
      </Button>
    )}
  />
);

export const Light: Story = { render: AllVariants };
export const Dark: Story = { render: AllVariants, globals: { theme: 'dark' } };

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8">
      <Labeled label="default">
        <Button>저장</Button>
      </Labeled>
      <Labeled label="with icon">
        <Button variant="outline">
          <Plus />새 글
        </Button>
      </Labeled>
      <Labeled label="disabled">
        <Button disabled>게시하기</Button>
      </Labeled>
      <Labeled label="focus-visible (Tab 으로 확인)">
        <Button variant="glass">초점</Button>
      </Labeled>
      <Labeled label="asChild → <a>">
        <Button asChild variant="ghost">
          <a href="#posts">글 목록으로</a>
        </Button>
      </Labeled>
    </div>
  ),
};

export const OnGlassContext: Story = {
  name: 'glass 버튼 — 페이지 배경 위',
  render: () => (
    <div className="bg-orb-primary bg-[length:480px_480px] bg-no-repeat p-10">
      <div className="flex gap-3">
        <Button variant="glass">초안 저장</Button>
        <Button variant="primary">게시하기</Button>
      </div>
    </div>
  ),
};
