import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Labeled } from '../stories/matrix';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const Both = () => (
  <div className="flex max-w-[800px] flex-col gap-10">
    <Labeled label="pill — 헤더 탐색 (활성 탭만 glass subtle 알약)">
      <Tabs defaultValue="blog">
        <TabsList>
          <TabsTrigger value="blog">블로그</TabsTrigger>
          <TabsTrigger value="calendar">캘린더</TabsTrigger>
        </TabsList>
      </Tabs>
    </Labeled>

    <Labeled label="underline — 본문 내부 (카테고리) + 우측 태그 칩">
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between gap-4">
          <TabsList variant="underline">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="dev">개발</TabsTrigger>
            <TabsTrigger value="retro">회고</TabsTrigger>
            <TabsTrigger value="lecture">강의</TabsTrigger>
          </TabsList>
          <div className="hidden gap-1.5 medium:flex">
            <Badge variant="accent">react</Badge>
            <Badge>nextjs</Badge>
            <Badge>supabase</Badge>
          </div>
        </div>
        <TabsContent value="all" className="text-body text-fg-body">
          전체 글 24개
        </TabsContent>
        <TabsContent value="dev" className="text-body text-fg-body">
          개발 글 15개
        </TabsContent>
        <TabsContent value="retro" className="text-body text-fg-body">
          회고 글 6개
        </TabsContent>
        <TabsContent value="lecture" className="text-body text-fg-body">
          강의 글 3개
        </TabsContent>
      </Tabs>
    </Labeled>

    <Labeled label="compact 가로 스크롤 + 스냅 (390 뷰포트)">
      <Tabs defaultValue="a" className="max-w-[300px]">
        <TabsList variant="underline">
          {['전체', '개발', '회고', '강의', '멘토링', '출장·이동', '휴무'].map((t, i) => (
            <TabsTrigger key={t} value={String.fromCharCode(97 + i)}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </Labeled>

    <Labeled label="에디터 속성 패널 탭">
      <Tabs defaultValue="props" className="max-w-[300px]">
        <TabsList className="w-full">
          <TabsTrigger value="props" className="flex-1">
            속성
          </TabsTrigger>
          <TabsTrigger value="toc" className="flex-1">
            목차
          </TabsTrigger>
          <TabsTrigger value="md" className="flex-1">
            md 소스
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </Labeled>
  </div>
);

export const Light: Story = { render: Both };
export const Dark: Story = { render: Both, globals: { theme: 'dark' } };
