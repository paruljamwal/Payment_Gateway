/** Maximum gateway submission attempts per payment (initial try + retries). */
export const MAX_RETRY_ATTEMPTS = 3;

/** Terminal API outcomes that may trigger an idempotent retry with the same transaction id. */
export const RETRYABLE_TERMINAL_STATUSES = ["failed", "timeout"] as const;

/** Alias for UI/service docs — same members as `RETRYABLE_TERMINAL_STATUSES`. */
export const RETRYABLE_STATUSES = RETRYABLE_TERMINAL_STATUSES;
