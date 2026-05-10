import {
  paymentStatuses,
  type PaymentStatus,
  type TransactionState,
} from "@/types/payment";
import { MAX_RETRY_ATTEMPTS } from "@/constants/retry";

/** Canonical status constants — use instead of string literals. */
export const PAYMENT_STATUS = {
  IDLE: "idle",
  PROCESSING: "processing",
  SUCCESS: "success",
  FAILED: "failed",
  TIMEOUT: "timeout",
} as const satisfies Record<string, PaymentStatus>;

export const PAYMENT_STATUSES = paymentStatuses;

export const CLIENT_PAYMENT_ABORT_MS = 6_000;

export const PAYMENT_TIMEOUT_MS = CLIENT_PAYMENT_ABORT_MS;

export const PAYMENT_GATEWAY_TIMEOUT_MS = 8_000;

export { MAX_RETRY_ATTEMPTS } from "@/constants/retry";

export { DEFAULT_ERROR_MESSAGES } from "@/constants/errors";

export { currencies as SUPPORTED_CURRENCIES } from "@/types/payment";

export const PAYMENT_STATUS_SCREEN_COPY = {
  success: {
    title: "Payment successful",
    message: "Your payment has been authorised. You can start another payment anytime.",
  },
  failed: {
    title: "Payment failed",
    message: "We could not complete this payment. You can try again with a different card.",
  },
  timeout: {
    title: "Payment timed out",
    message: "The request took too long. Please check your connection and try again.",
  },
} as const;

export const PAYMENT_PROCESSING_ANNOUNCEMENT =
  "Processing payment. Please wait.";

export const PAYMENT_PROCESSING_VISIBLE_TITLE = "Processing payment…";

export const PAYMENT_RETRY_BUTTON_LABEL = "Retry payment";

export const PAYMENT_RETRY_AVAILABLE_HINT =
  "Retries reuse the same transaction reference until attempts are used.";

export const PAYMENT_RETRY_EXHAUSTED_HINT =
  "No further retries are available for this transaction.";

export const PAYMENT_NEW_PAYMENT_LABEL = "New payment";

export const TRANSACTION_HISTORY_SECTION_TITLE = "Transaction history";

export const TRANSACTION_HISTORY_EMPTY_TITLE = "No payments yet";

export const TRANSACTION_HISTORY_EMPTY_BODY =
  "Completed and attempted payments appear here and stay on this device after refresh.";

export const TRANSACTION_HISTORY_SHOW_MORE_LABEL = "Show more";

export const TRANSACTION_DETAILS_CLOSE_LABEL = "Close";

export const TRANSACTION_DETAILS_TITLE = "Transaction details";

/** Readable labels for persisted history rows and badges. */
export const TRANSACTION_STATUS_LABELS: Record<PaymentStatus, string> = {
  idle: "Idle",
  processing: "Processing",
  success: "Successful",
  failed: "Failed",
  timeout: "Timed out",
};

/** Initial Redux payment slice snapshot (empty history). */
export const DEFAULT_PAYMENT_STATE: TransactionState = {
  paymentStatus: PAYMENT_STATUS.IDLE,
  currentTransaction: null,
  submissionAttempt: 0,
  isGatewayRequestPending: false,
  maxRetries: MAX_RETRY_ATTEMPTS,
  transactionHistory: [],
  selectedTransactionId: null,
  errorMessage: null,
  paymentErrorType: null,
};
