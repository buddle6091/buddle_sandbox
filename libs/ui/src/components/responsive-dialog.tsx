'use client';

import * as React from 'react';

import { BREAKPOINTS, useMediaQuery } from '../hooks/use-media-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

/**
 * ResponsiveDialog — design.md §6.7: compact 는 하단 Sheet, medium+ 는 중앙 Dialog.
 * 확인/삭제/게시 Dialog 처럼 "제목 + 설명 + 액션" 구조에 쓴다.
 * 임의 구조가 필요하면 Dialog / Sheet 를 직접 조합한다.
 */
const Ctx = React.createContext<boolean>(false);

function ResponsiveDialog(props: React.ComponentProps<typeof Dialog>) {
  const isMedium = useMediaQuery(BREAKPOINTS.medium);
  const Root = isMedium ? Dialog : Sheet;
  return (
    <Ctx.Provider value={isMedium}>
      <Root {...props} />
    </Ctx.Provider>
  );
}

function ResponsiveDialogTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
  const isMedium = React.useContext(Ctx);
  const Trigger = isMedium ? DialogTrigger : SheetTrigger;
  return <Trigger {...props} />;
}

function ResponsiveDialogContent({
  title,
  description,
  footer,
  children,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** 액션 버튼들. Dialog 는 우측 정렬, Sheet 는 세로. */
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  const isMedium = React.useContext(Ctx);
  if (isMedium) {
    return (
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    );
  }
  return (
    <SheetContent className={className}>
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        {description && <SheetDescription>{description}</SheetDescription>}
      </SheetHeader>
      {children}
      {footer && <SheetFooter>{footer}</SheetFooter>}
    </SheetContent>
  );
}

export { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogTrigger };
