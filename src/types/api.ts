/** POST /api/pay JSON body (validated server-side). */
export type PaymentApiRequest = {
  transactionId: string;
  amount: number;
  currency: string;
};

export type PaymentSuccessResponse = {
  success: true;
  status: "success";
  transactionId: string;
  timestamp: string;
};

export type PaymentFailureResponse = {
  success: false;
  status: "failed";
  transactionId: string;
  reason: string;
  timestamp: string;
};

export type PaymentTimeoutResponse = {
  success: false;
  status: "timeout";
  transactionId: string;
  reason: string;
  timestamp: string;
};

/** Terminal payloads produced by the mock gateway simulation. */
export type PaymentApiResponse =
  | PaymentSuccessResponse
  | PaymentFailureResponse
  | PaymentTimeoutResponse;

/** Alias emphasising status-bearing payloads (same union as `PaymentApiResponse`). */
export type PaymentStatusResponse = PaymentApiResponse;

/** Validation / malformed request payloads (HTTP 4xx). */
export type PaymentApiErrorBody = {
  success: false;
  error: string;
  code: PaymentApiErrorCode;
  timestamp: string;
};

export const paymentApiErrorCodes = [
  "INVALID_JSON",
  "INVALID_BODY",
  "MISSING_TRANSACTION_ID",
  "INVALID_AMOUNT",
  "INVALID_CURRENCY",
  "INTERNAL_SIMULATION_ERROR",
] as const;

export type PaymentApiErrorCode = (typeof paymentApiErrorCodes)[number];
