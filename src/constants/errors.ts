/** Declined-payment reasons returned by the mock gateway (random pick on failure). */
export const FAILURE_REASONS = [
  "Insufficient funds",
  "Card declined",
  "Bank server unavailable",
  "Suspicious activity detected",
  "Daily limit exceeded",
] as const;

export type FailureReason = (typeof FAILURE_REASONS)[number];

export const PAYMENT_API_VALIDATION_MESSAGES = {
  INVALID_JSON: "Request body must be valid JSON.",
  INVALID_BODY: "Request body must be a JSON object.",
  MISSING_TRANSACTION_ID: "Field `transactionId` is required and must be a non-empty string.",
  INVALID_AMOUNT: "Field `amount` is required and must be a finite number greater than zero.",
  INVALID_CURRENCY: "Field `currency` is required and must be a supported ISO currency code.",
  INTERNAL_SIMULATION_ERROR:
    "Something went wrong while simulating the payment. Please try again.",
} as const;

export const MOCK_GATEWAY_TIMEOUT_REASON =
  "Payment gateway did not respond within the allowed time.";

export const PAYMENT_FLOW_ERROR_MESSAGES = {
  NETWORK:
    "We could not reach the payment service. Check your connection and try again.",
  CLIENT_TIMEOUT:
    "The payment request took too long and was cancelled. You can retry without changing your reference.",
  UNEXPECTED: "Something unexpected happened. Please try again shortly.",
  FINAL_ATTEMPTS_USED:
    "Maximum payment attempts reached for this transaction. Start a new payment or use a different card.",
} as const;

/** Stable alias for payment-flow copy consumed by UI layers. */
export const DEFAULT_ERROR_MESSAGES = PAYMENT_FLOW_ERROR_MESSAGES;
