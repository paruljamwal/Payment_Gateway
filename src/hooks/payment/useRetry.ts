"use client";

import { useCallback } from "react";

export function useRetry(
  canRetry: boolean,
  isBusy: boolean,
  retryPayment: () => Promise<void>,
) {
  const handleRetry = useCallback(async () => {
    if (!canRetry || isBusy) {
      return;
    }
    await retryPayment();
  }, [canRetry, isBusy, retryPayment]);

  return { handleRetry };
}
