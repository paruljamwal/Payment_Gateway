export const paymentStatuses = [
  "idle",
  "processing",
  "success",
  "failed",
  "timeout",
] as const;

export type PaymentStatus = (typeof paymentStatuses)[number];

export const currencies = ["INR", "USD"] as const;
export type Currency = (typeof currencies)[number];

/** Alias used by form types (matches Phase 2 spec naming). */
export type CurrencyType = Currency;

export type PaymentFormData = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: string;
  currency: CurrencyType;
};

export type PaymentFormField = keyof PaymentFormData;

export type ValidationErrors = Partial<Record<PaymentFormField, string>>;

export const cardBrands = ["visa", "mastercard", "amex", "unknown"] as const;

export type CardBrand = (typeof cardBrands)[number];

/** Same union as `CardBrand` (spec naming). */
export type CardType = CardBrand;

export type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly message: string };

export type CardPreviewProps = {
  brand: CardBrand;
  cardholderName: string;
  /** Raw PAN digits (no spaces). */
  cardNumberDigits: string;
  expiryDisplay: string;
};

/** Terminal outcomes only — used for receipts and status UI. */
export type TerminalPaymentStatus = Extract<
  PaymentStatus,
  "success" | "failed" | "timeout"
>;

export type PaymentErrorType = "network" | "gateway";

export type PaymentError = {
  type: PaymentErrorType;
  message: string;
};

/** Persisted payment attempt / receipt row (Phase 5+). */
export type Transaction = {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  cardType: CardType;
  timestamp: number;
  retryCount: number;
  /** User-facing decline / timeout summary when terminal outcome is not success. */
  failureReason?: string | null;
};

/** Legacy alias — prefer `Transaction`. */
export type TransactionSummary = Transaction;

/** Redux payment slice shape (global payment flow). */
export type TransactionState = {
  paymentStatus: PaymentStatus;
  currentTransaction: Transaction | null;
  /** Number of gateway calls started this payment session (1-based while in flight / after outcome). */
  submissionAttempt: number;
  /** True while a submission is in flight without forcing `paymentStatus` away from a terminal state (retries). */
  isGatewayRequestPending: boolean;
  maxRetries: number;
  transactionHistory: Transaction[];
  selectedTransactionId: string | null;
  errorMessage: string | null;
  paymentErrorType: PaymentErrorType | null;
};
