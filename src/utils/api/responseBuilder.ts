import type {
  PaymentApiErrorBody,
  PaymentApiErrorCode,
  PaymentFailureResponse,
  PaymentSuccessResponse,
  PaymentTimeoutResponse,
} from "@/types/api";

export function createApiTimestamp(): string {
  return new Date().toISOString();
}

export function buildPaymentSuccessResponse(
  transactionId: string,
): PaymentSuccessResponse {
  return {
    success: true,
    status: "success",
    transactionId,
    timestamp: createApiTimestamp(),
  };
}

export function buildPaymentFailureResponse(
  transactionId: string,
  reason: string,
): PaymentFailureResponse {
  return {
    success: false,
    status: "failed",
    transactionId,
    reason,
    timestamp: createApiTimestamp(),
  };
}

export function buildPaymentTimeoutResponse(
  transactionId: string,
  reason: string,
): PaymentTimeoutResponse {
  return {
    success: false,
    status: "timeout",
    transactionId,
    reason,
    timestamp: createApiTimestamp(),
  };
}

export function buildPaymentApiErrorBody(
  message: string,
  code: PaymentApiErrorCode,
): PaymentApiErrorBody {
  return {
    success: false,
    error: message,
    code,
    timestamp: createApiTimestamp(),
  };
}
