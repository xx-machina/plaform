// 秒数をhh:mm:ssの形にフォーマットする
export function formatSeconds(seconds: number): string {
  const h = `${Math.floor(seconds / 3600)}`.padStart(2, '0');
  const m = `${Math.floor(seconds % 3600 / 60)}`.padStart(2, '0');
  const s = `${Math.floor(seconds % 3600 % 60)}`.padStart(2, '0');
  return `${h}:${m}:${s}`;
}