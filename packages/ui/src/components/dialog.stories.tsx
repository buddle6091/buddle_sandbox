import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogTrigger } from './responsive-dialog';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** STATES.md 4e — 게시 확인 */
const PublishDialog = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button>게시하기</Button>
    </DialogTrigger>
    <DialogContent className="max-w-[340px]">
      <DialogHeader>
        <DialogTitle>이 글을 게시할까요?</DialogTitle>
        <DialogDescription>게시하면 목록 맨 위에 보이고, 검색에 포함돼요.</DialogDescription>
      </DialogHeader>
      <dl className="grid grid-cols-[64px_1fr] gap-y-2 text-body-sm">
        <dt className="text-fg-muted">카테고리</dt>
        <dd>
          <Badge variant="accent">개발</Badge>
        </dd>
        <dt className="text-fg-muted">태그</dt>
        <dd className="flex gap-1">
          <Badge>react</Badge>
          <Badge>nextjs</Badge>
        </dd>
        <dt className="text-fg-muted">썸네일</dt>
        <dd className="text-fg-subtle">없음 (선택)</dd>
      </dl>
      <DialogFooter>
        <Button variant="ghost">취소</Button>
        <Button>게시하기</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const Publish: Story = { render: PublishDialog };
export const PublishDark: Story = { render: PublishDialog, globals: { theme: 'dark' } };

/** STATES.md 4f — 파괴적 행동만 danger 버튼 */
export const Destructive: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">글 삭제</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>글을 삭제할까요?</DialogTitle>
          <DialogDescription>「React 19 서버 컴포넌트」와 댓글 4개가 함께 삭제돼요. 되돌릴 수 없어요.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost">취소</Button>
          <Button variant="danger">삭제하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const BottomSheet: Story = {
  name: 'Sheet — compact 하단 (390 뷰포트에서 확인)',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="glass">필터 2</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>필터</SheetTitle>
          <SheetDescription>기업·기관 · 유형 · 기간 · 장소</SheetDescription>
        </SheetHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent">강의</Badge>
          <Badge>멘토링</Badge>
          <Badge>출장·이동</Badge>
          <Badge>휴무</Badge>
        </div>
        <SheetFooter>
          <Button>적용</Button>
          <Button variant="ghost">초기화</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const SideSheet: Story = {
  name: 'Sheet — right (에디터 속성 패널)',
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">속성</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>속성</SheetTitle>
          <SheetDescription>상태 · 카테고리 · 태그 · 슬러그</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Responsive: Story = {
  name: 'ResponsiveDialog — 뷰포트에 따라 Dialog ↔ Sheet',
  render: () => (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button variant="outline">나가기</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent
        title="저장되지 않은 변경이 있어요"
        description="지금 나가면 마지막 저장(14:02) 이후 내용이 사라져요."
        footer={
          <>
            <Button variant="ghost">나가기</Button>
            <Button>저장하고 나가기</Button>
          </>
        }
      />
    </ResponsiveDialog>
  ),
};
