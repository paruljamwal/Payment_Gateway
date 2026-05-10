import { MAX_RETRY_ATTEMPTS } from "@/constants/retry";
import type { PaymentStatus } from "@/types/payment";

export function isRetryableTerminalStatus(
  status: PaymentStatus,
): status is "failed" | "timeout" {
  return status === "failed" || status === "timeout";
}

export function canRetryPaymentSubmission(
  submissionAttempt: number,
  maxAttempts: number = MAX_RETRY_ATTEMPTS,
): boolean {
  return submissionAttempt < maxAttempts;
}
