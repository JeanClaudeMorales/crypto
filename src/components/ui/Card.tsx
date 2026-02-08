import React from 'react';
import clsx from 'clsx';

export function Card(
  props: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
) {
  const { className, children, ...rest } = props;
  return (
    <div
      {...rest}
      className={clsx("rounded-3xl border border-white/5 bg-bg-card/60 glass-panel shadow-card", className)}
    >
      {children}
    </div>
  );
}
