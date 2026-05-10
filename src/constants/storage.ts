/** Namespaced localStorage keys for payment persistence (Phase 8). */
export const LOCAL_STORAGE_KEYS = {
  /** Canonical blob: `{ version, transactions, selectedTransactionId }`. */
  PAYMENT_TRANSACTION_SNAPSHOT: "payment-gateway.paymentSnapshot.v1",
} as const;

/** Initial visible rows before “Show more” expands the list. */
export const HISTORY_PAGE_SIZE = 10;

export const PAYMENT_SNAPSHOT_VERSION = 1 as const;
