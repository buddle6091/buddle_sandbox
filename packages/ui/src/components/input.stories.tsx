import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Labeled } from '../stories/matrix';

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: '닉네임 (선택)' },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

const AllStates = () => (
  <div className="grid max-w-[640px] gap-6 medium:grid-cols-2">
    <Labeled label="default">
      <Input placeholder="닉네임 (선택)" />
    </Labeled>
    <Labeled label="with label">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="pw">비밀번호</Label>
        <Input id="pw" type="password" placeholder="수정·삭제에 필요해요" />
      </div>
    </Labeled>
    <Labeled label="filled">
      <Input defaultValue="버들" />
    </Labeled>
    <Labeled label="error">
      <Input defaultValue="" error="제목을 입력해 주세요." />
    </Labeled>
    <Labeled label="disabled">
      <Input disabled placeholder="초대 전용" />
    </Labeled>
    <Labeled label="mono (slug)">
      <Input className="font-mono" defaultValue="react-19-server-components" />
    </Labeled>
    <Labeled label="textarea">
      <Textarea placeholder="댓글을 남겨 주세요 (1,000자)" />
    </Labeled>
    <Labeled label="textarea error">
      <Textarea error="댓글 내용을 입력해 주세요." />
    </Labeled>
  </div>
);

export const Light: Story = { render: AllStates };
export const Dark: Story = { render: AllStates, globals: { theme: 'dark' } };
