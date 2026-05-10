import { currencies } from "@/types/payment";
import { PAYMENT_API_VALIDATION_MESSAGES } from "@/constants/errors";
import type { PaymentApiErrorBody, PaymentApiRequest } from "@/types/api";
import { buildPaymentApiErrorBody } from "@/utils/api/responseBuilder";

export type PaymentRequestParseSuccess = {
  ok: true;
  value: PaymentApiRequest;
};

export type PaymentRequestParseFailure = {
  ok: false;
  body: PaymentApiErrorBody;
  status: number;
};

export type PaymentRequestParseResult =
  | PaymentRequestParseSuccess
  | PaymentRequestParseFailure;

function isSupportedCurrency(value: string): boolean {
  return (currencies as readonly string[]).includes(value);
}

function coercePositiveAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return null;
}

export function parsePaymentApiBody(
  input: unknown,
): PaymentRequestParseResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return {
      ok: false,
      body: buildPaymentApiErrorBody(
        PAYMENT_API_VALIDATION_MESSAGES.INVALID_BODY,
        "INVALID_BODY",
      ),
      status: 400,
    };
  }

  const body = input as Record<string, unknown>;

  const transactionIdRaw = body.transactionId;
  if (
    typeof transactionIdRaw !== "string" ||
    transactionIdRaw.trim().length === 0
  ) {
    return {
      ok: false,
      body: buildPaymentApiErrorBody(
        PAYMENT_API_VALIDATION_MESSAGES.MISSING_TRANSACTION_ID,
        "MISSING_TRANSACTION_ID",
      ),
      status: 400,
    };
  }

  const amount = coercePositiveAmount(body.amount);
  if (amount === null) {
    return {
      ok: false,
      body: buildPaymentApiErrorBody(
        PAYMENT_API_VALIDATION_MESSAGES.INVALID_AMOUNT,
        "INVALID_AMOUNT",
      ),
      status: 400,
    };
  }

  const currencyRaw = body.currency;
  if (typeof currencyRaw !== "string" || !isSupportedCurrency(currencyRaw)) {
    return {
      ok: false,
      body: buildPaymentApiErrorBody(
        PAYMENT_API_VALIDATION_MESSAGES.INVALID_CURRENCY,
        "INVALID_CURRENCY",
      ),
      status: 400,
    };
  }

  const value: PaymentApiRequest = {
    transactionId: transactionIdRaw.trim(),
    amount,
    currency: currencyRaw,
  };

  return { ok: true, value };
}
