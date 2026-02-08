import React from 'react';
import clsx from 'clsx';

export function Chip({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral'|'success'|'danger'|'primary' }) {
  const map = {
    neutral: "bg-white/5 text-white/70 border-white/10",
    success: "bg-success/10 text-success border-success/20",
    danger: "bg-red-500/10 text-red-400 border-red-500/20",
    primary: "bg-primary/10 text-primary border-primary/20",
  } as const;
  return (
    <span className={clsx("px-2.5 py-1 text-xs rounded-full border", map[tone])}>
      {children}
    </span>
  );
}
