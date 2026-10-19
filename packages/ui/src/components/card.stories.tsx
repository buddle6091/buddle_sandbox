import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Matrix } from '../stories/matrix';

const VARIANTS = ['glass', 'glass-flat', 'flat'] as const;
const HOVERS = ['none', 'pool', 'lift', 'edge'] as const;

const meta = {
  title: 'Components/Card',
  component: Card,
  args: { variant: 'glass', hover: 'none' },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    hover: { control: 'select', options: HOVERS },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const Sample = () => (
  <>
    <CardHeader>
      <div className="flex gap-1.5">
        <Badge variant="accent">개발</Badge>
        <Badge>react</Badge>
      </div>
      <CardTitle>React 19 서버 컴포넌트, 블로그에 실제로 써 보니</CardTitle>
      <CardDescription>2026년 10월 2일 · 조회 128 · 댓글 4</CardDescription>
    </CardHeader>
    <CardContent>
      캐시 컴포넌트는 필요할 때만 켜고, 나머지는 기본 동적 렌더링으로 두는 게 운영에서 덜 놀랐다.
    </CardContent>
  </>
);

export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="max-w-[420px]">
      <Sample />
      <CardFooter>
        <Button size="sm" variant="outline">
          읽기
        </Button>
      </CardFooter>
    </Card>
  ),
};

const AllVariants = () => (
  <div className="relative">
    {/* 유리가 보이도록 배경 광원 하나 */}
    <div
      aria-hidden
      className="bg-orb-primary pointer-events-none absolute -top-40 -left-24 size-[480px] blur-[30px]"
    />
    <div className="relative">
      <Matrix
        rows={VARIANTS}
        cols={HOVERS}
        render={(variant, hover) =>
          hover === 'lift' ? (
            <Card asChild variant={variant} hover={hover} className="w-[260px]">
              <a href="#post">
                <Sample />
              </a>
            </Card>
          ) : (
            <Card variant={variant} hover={hover} className="w-[260px]">
              <Sample />
            </Card>
          )
        }
      />
    </div>
  </div>
);

export const Light: Story = { render: AllVariants };
export const Dark: Story = { render: AllVariants, globals: { theme: 'dark' } };

export const PostList: Story = {
  name: 'compact 리스트 — glass-flat (blur 없음)',
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div className="mx-auto flex max-w-[390px] flex-col gap-3 p-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} variant="glass-flat" hover="edge">
          <Sample />
        </Card>
      ))}
    </div>
  ),
};
