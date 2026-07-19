export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export const normalizeTime = (input: string) => {
  const cleaned = input.replace(/[^\d:]/g, '');
  const [h = '', m = ''] = cleaned.split(':');

  const hour = clamp(Number(h || 0), 0, 23);
  const minute = clamp(Number(m || 0), 0, 59);

  return cleaned.includes(':')
    ? `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    : cleaned;
};
