"use client";

import clsx from "clsx";

export type SpinnerProps = {
  /** Visible label for assistive tech when used without surrounding live region. */
  label?: string;
  className?: string;
};

export default function Spinner({ label, className }: SpinnerProps) {
  return (
    <>
      {label ? (
        <span className="sr-only">{label}</span>
      ) : null}
      <div
        className={clsx(
          "h-10 w-10 rounded-full border-2 border-zinc-300 border-t-zinc-900 motion-safe:animate-spin motion-reduce:animate-none dark:border-zinc-600 dark:border-t-zinc-50",
          className,
        )}
        aria-hidden
      />
    </>
  );
}
