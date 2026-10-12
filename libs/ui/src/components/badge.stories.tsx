import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { Labeled } from '../stories/matrix';

const VARIANTS = ['default', 'glass', 'accent', 'outline', 'success', 'warning', 'danger'] as const;

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: '개발', variant: 'default' },
  argTypes: { variant: { control: 'select', options: VARIANTS } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const LABELS: Record<(typeof VARIANTS)[number], string> = {
  default: '회고',
  glass: 'react',
  accent: '작성자',
  outline: 'nextjs',
  success: '메일을 보냈어요',
  warning: '초대 전용 · 조회만',
  danger: '저장 실패',
};

const AllVariants = () => (
  <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map((v) => (
        <Badge key={v} variant={v}>
          {LABELS[v]}
        </Badge>
      ))}
    </div>
    <Labeled label="16자 초과 말줄임">
      <Badge variant="outline">아주아주아주아주아주아주 긴 태그 이름입니다</Badge>
    </Labeled>
    <Labeled label="asChild → 링크 칩">
      <div className="flex gap-2">
        <Badge asChild variant="accent">
          <a href="#react">react</a>
        </Badge>
        <Badge asChild variant="outline">
          <a href="#supabase">supabase</a>
        </Badge>
      </div>
    </Labeled>
  </div>
);

export const Light: Story = { render: AllVariants };
export const Dark: Story = { render: AllVariants, globals: { theme: 'dark' } };
