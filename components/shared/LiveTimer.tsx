'use client';

import { useEffect, useState } from 'react';

interface LiveTimerProps {
  startedAt: Date;
  running: boolean;
  className?: string;
}

function formatHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export default function LiveTimer({ startedAt, running, className = '' }: LiveTimerProps) {
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - startedAt.getTime()) / 1000)
  );

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt, running]);

  return (
    <span
      className={`font-mono tabular-nums tracking-tight ${className}`}
      aria-label={`Tempo trascorso: ${formatHMS(elapsed)}`}
    >
      {formatHMS(elapsed)}
    </span>
  );
}
