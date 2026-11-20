/** 텍스트를 클립보드에 넣는다. 성공 여부를 돌려준다(권한 거부 · 비보안 컨텍스트 · 미지원이면 false). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
