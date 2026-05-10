"use client";

import clsx from "clsx";

export type EmptyStateProps = {
  title: string;
  description: string;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div className={clsx("text-center", className)}>
      <p className="text-base font-medium text-zinc-800 dark:text-zinc-100">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
