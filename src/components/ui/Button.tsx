import React from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
}) {
  const { variant = 'primary', fullWidth = true, className, ...rest } = props;

  const base = "h-12 px-5 rounded-2xl font-semibold transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2";
  const variants: Record<Variant, string> = {
    primary: "bg-primary text-white shadow-[0_6px_24px_rgba(127,102,255,0.25)] hover:bg-primary-dark",
    secondary: "bg-bg-input text-white hover:bg-bg-lighter",
    outline: "border border-white/10 bg-transparent text-white hover:bg-white/5",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5",
  };

  return (
    <button
      {...rest}
      className={clsx(base, variants[variant], fullWidth && "w-full", className)}
    />
  );
}
