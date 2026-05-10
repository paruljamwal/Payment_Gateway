"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

export type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionCard({ children, className }: SectionCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950",
        className,
      )}
    >
      {children}
    </div>
  );
}
