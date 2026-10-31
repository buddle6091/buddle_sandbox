import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { Card, CardDescription, CardHeader, CardTitle } from './card';
import { ThemeToggle } from './theme-toggle';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 툴바 테마와 별개로 실제 html[data-theme] 를 바꾼다 — 눌러서 카드가 함께 바뀌는지 본다. */
export const Default: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <ThemeToggle />
      <Card className="w-[320px]">
        <CardHeader>
          <Badge variant="accent">미리보기</Badge>
          <CardTitle>테마 토글</CardTitle>
          <CardDescription>localStorage(bs-theme) 에 저장되고 html[data-theme] 로 적용됩니다.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};
