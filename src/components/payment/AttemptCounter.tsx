"use client";

import { memo } from "react";

export type AttemptCounterProps = {
  attempt: number;
  maxAttempts: number;
};

function AttemptCounterImpl({
  attempt,
  maxAttempts,
}: AttemptCounterProps) {
  const clampedAttempt = Math.min(Math.max(attempt, 1), maxAttempts);

  return (
    <p
      className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      aria-live="polite"
    >
      Attempt {clampedAttempt} of {maxAttempts}
    </p>
  );
}

export default memo(AttemptCounterImpl);
