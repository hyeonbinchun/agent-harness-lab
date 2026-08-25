import { describe, it, expect, vi, afterEach } from 'vitest';

describe('date boundary check', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('reports the correct day for a fixed instant', () => {
    vi.useFakeTimers();
    // UTC 15:30 = KST(UTC+9) 다음날 00:30
    vi.setSystemTime(new Date('2026-08-25T15:30:00Z'));

    const today = new Date();

    // 로컬(KST)에서는 26일이라 통과, CI(UTC)에서는 25일이라 실패
    expect(today.getDate()).toBe(26);
  });
});