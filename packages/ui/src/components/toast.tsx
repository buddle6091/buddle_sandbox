'use client';

import { Toaster as Sonner, toast, type ToasterProps } from 'sonner';

/**
 * Toast — STATES.md 공통 규칙
 * 하단 중앙, 반전 표면(bg/inverse + fg/inverse) 불투명, radius/lg, 48h, 4s, 액션 1개, 아래서 8px 300ms.
 * 삭제는 toastUndo(5s, 「실행 취소」). 테마는 토큰이 처리하므로 sonner 의 theme/next-themes 를 쓰지 않는다.
 */
function Toaster({ toastOptions, ...props }: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      duration={4000}
      gap={8}
      offset={16}
      mobileOffset={16}
      visibleToasts={3}
      className="toaster"
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          toast:
            'flex w-full min-h-12 items-center gap-3 rounded-lg bg-bg-inverse px-4 py-3 text-fg-inverse text-body-sm shadow-lg animate-bs-rise-in data-[removed=true]:animate-bs-rise-out',
          title: 'text-body-sm font-medium',
          description: 'text-caption opacity-80',
          actionButton:
            'ml-auto shrink-0 rounded-sm px-2.5 h-8 text-label text-fg-inverse underline-offset-4 focus-ring transition-colors duration-[var(--bs-motion-control)] ease-bs hover-fine:underline',
          cancelButton: 'ml-auto shrink-0 rounded-sm px-2.5 h-8 text-label text-fg-inverse opacity-70',
          icon: 'hidden',
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

/** 삭제 등 파괴적 행동 완료 토스트 — 「실행 취소」 5초 */
function toastUndo(message: string, onUndo: () => void) {
  return toast(message, {
    duration: 5000,
    action: { label: '실행 취소', onClick: onUndo },
  });
}

export { toast, Toaster, toastUndo };
