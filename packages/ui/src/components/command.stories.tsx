import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarDays, Copy, FileText, Home, Moon, Sun } from 'lucide-react';

import { Button } from './button';
import { CommandDialog, type CommandItem } from './command';

const ITEMS: CommandItem[] = [
  { id: 'home', label: '소개', group: '페이지', hint: '/', icon: Home },
  { id: 'blog', label: '블로그', group: '페이지', hint: '/blog', icon: FileText },
  { id: 'calendar', label: '캘린더', group: '페이지', hint: '/calendar', icon: CalendarDays },
  { id: 'teaching', label: '강의 이력', group: '이 페이지에서' },
  { id: 'career', label: '개발 경력', group: '이 페이지에서' },
  { id: 'contact', label: '문의', group: '이 페이지에서' },
  { id: 'light', label: '라이트 모드', group: '테마', icon: Sun, keywords: 'light' },
  { id: 'dark', label: '다크 모드', group: '테마', icon: Moon, keywords: 'dark' },
  { id: 'copy', label: '이메일 주소 복사', group: '연락', icon: Copy, keywords: 'email mail' },
];

const meta = {
  title: 'Components/Command',
  component: CommandDialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof CommandDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ defaultOpen = true, items = ITEMS }: { defaultOpen?: boolean; items?: CommandItem[] }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="glass" onClick={() => setOpen(true)}>
        팔레트 열기
      </Button>
      <p className="text-body-sm text-fg-muted">{last ? `실행: ${last}` : '항목을 골라 보세요'}</p>
      <CommandDialog open={open} onOpenChange={setOpen} items={items} onSelect={(it) => setLast(it.label)} />
    </div>
  );
}

/** 열린 상태 — 그룹 4개, 아이콘 · 힌트 */
export const Open: Story = {
  args: { open: true, onOpenChange: () => undefined, items: ITEMS, onSelect: () => undefined },
  render: () => <Demo />,
};

/** 닫힌 상태에서 버튼으로 연다 */
export const Closed: Story = {
  args: { open: false, onOpenChange: () => undefined, items: ITEMS, onSelect: () => undefined },
  render: () => <Demo defaultOpen={false} />,
};

/** 항목이 없을 때 — 빈 안내 */
export const Empty: Story = {
  args: { open: true, onOpenChange: () => undefined, items: [], onSelect: () => undefined },
  render: () => <Demo items={[]} />,
};
