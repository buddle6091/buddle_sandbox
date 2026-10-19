import type { ReactNode } from 'react';

/**
 * 스토리 공용 — variant × 열 매트릭스.
 * light/dark 는 툴바 글로벌(theme) 또는 스토리의 `globals: { theme: 'dark' }` 로 고른다.
 * 뷰포트는 툴바(390/768/1280/1440).
 */
export function Matrix<R extends string, C extends string>({
  rows,
  cols,
  render,
  rowLabel = 'variant',
}: {
  rows: readonly R[];
  cols: readonly C[];
  render: (row: R, col: C) => ReactNode;
  rowLabel?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-x-6 border-spacing-y-3">
        <thead>
          <tr>
            <th className="text-caption text-fg-muted text-left font-medium">{rowLabel}</th>
            {cols.map((c) => (
              <th key={c} className="text-caption text-fg-muted text-left font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r}>
              <th scope="row" className="text-caption text-fg-muted text-left font-medium">
                {r}
              </th>
              {cols.map((c) => (
                <td key={c} className="align-middle">
                  {render(r, c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 라벨 + 내용 한 묶음(상태 열거용) */
export function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-fg-muted">{label}</span>
      {children}
    </div>
  );
}
