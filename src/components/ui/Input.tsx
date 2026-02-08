import React from 'react';
import clsx from 'clsx';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & {
  right?: React.ReactNode;
  wrapperClassName?: string;
}) {
  const { right, className, wrapperClassName, ...rest } = props;
  return (
    <div className={clsx("relative", wrapperClassName)}>
      <input
        {...rest}
        className={clsx(
          "w-full h-12 bg-transparent border border-white/10 rounded-2xl px-4 text-white placeholder-white/30 focus:border-primary focus:ring-0 outline-none transition-colors",
          right ? "pr-12" : "",
          className
        )}
      />
      {right && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
          {right}
        </div>
      )}
    </div>
  );
}
