import { useEffect, useMemo, useState } from 'react';

export interface Countdown {
  hours: string;
  minutes: string;
  seconds: string;
  /** True once the target time has passed. */
  expired: boolean;
}

function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, '0');
}

function remainingMs(targetIso: string, now: number): number {
  const target = new Date(targetIso).getTime();
  if (Number.isNaN(target)) return 0;
  return Math.max(0, target - now);
}

/**
 * Ticking countdown for flash deals.
 *
 * The hook stores only "now" and derives the remaining time from it, rather than
 * storing the remaining time and rewriting it every tick. That keeps the
 * interval callback the only place state changes, avoids a setState during the
 * effect body, and means a changed target can never leave a stale value behind.
 */
export function useCountdown(targetIso: string | undefined): Countdown | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return useMemo(() => {
    if (!targetIso) return null;

    const remaining = remainingMs(targetIso, now);
    const totalSeconds = Math.floor(remaining / 1000);

    return {
      hours: pad(Math.floor(totalSeconds / 3600)),
      minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
      seconds: pad(totalSeconds % 60),
      expired: remaining <= 0,
    };
  }, [targetIso, now]);
}
