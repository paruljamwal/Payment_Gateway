import type {
  PaymentApiErrorBody,
  PaymentApiErrorCode,
  PaymentApiResponse,
} from "@/types/api";
import { paymentApiErrorCodes } from "@/types/api";

export type ParsedPaymentHttpResult =
  | { ok: true; data: PaymentApiResponse }
  | { ok: false; body: PaymentApiErrorBody; httpStatus: number };

export async function parsePaymentHttpResponse(
  response: Response,
): Promise<ParsedPaymentHttpResult> {
  const httpStatus = response.status;

  try {
    const data: unknown = await response.json();

    if (!response.ok) {
      const body = parseApiErrorBody(data, httpStatus);
      return { ok: false, body, httpStatus };
    }

    const successPayload = parseGatewayPayload(data);
    if (!successPayload) {
      return {
        ok: false,
        body: {
          success: false,
          error: "Unexpected gateway response shape.",
          code: "INTERNAL_SIMULATION_ERROR",
          timestamp: new Date().toISOString(),
        },
        httpStatus,
      };
    }

    return { ok: true, data: successPayload };
  } catch {
    return {
      ok: false,
      body: {
        success: false,
        error: "Could not read gateway response.",
        code: "INTERNAL_SIMULATION_ERROR",
        timestamp: new Date().toISOString(),
      },
      httpStatus,
    };
  }
}

function toPaymentApiErrorCode(value: unknown): PaymentApiErrorCode {
  if (typeof value !== "string") {
    return "INTERNAL_SIMULATION_ERROR";
  }
  return (paymentApiErrorCodes as readonly string[]).includes(value)
    ? (value as PaymentApiErrorCode)
    : "INTERNAL_SIMULATION_ERROR";
}

function parseApiErrorBody(data: unknown, httpStatus: number): PaymentApiErrorBody {
  if (typeof data === "object" && data !== null && "error" in data) {
    const record = data as Record<string, unknown>;
    const error = typeof record.error === "string" ? record.error : "Invalid request.";
    const code = toPaymentApiErrorCode(record.code);
    const timestamp =
      typeof record.timestamp === "string"
        ? record.timestamp
        : new Date().toISOString();
    return {
      success: false,
      error,
      code,
      timestamp,
    };
  }

  return {
    success: false,
    error: `Request failed with status ${httpStatus}.`,
    code: "INTERNAL_SIMULATION_ERROR",
    timestamp: new Date().toISOString(),
  };
}

function parseGatewayPayload(data: unknown): PaymentApiResponse | null {
  if (typeof data !== "object" || data === null) {
    return null;
  }

  const row = data as Record<string, unknown>;
  const success = row.success === true;
  const transactionId =
    typeof row.transactionId === "string" ? row.transactionId : "";
  const timestamp =
    typeof row.timestamp === "string"
      ? row.timestamp
      : new Date().toISOString();
  const status = row.status;

  if (success && status === "success") {
    return {
      success: true,
      status: "success",
      transactionId,
      timestamp,
    };
  }

  if (!success && status === "failed" && typeof row.reason === "string") {
    return {
      success: false,
      status: "failed",
      transactionId,
      reason: row.reason,
      timestamp,
    };
  }

  if (!success && status === "timeout" && typeof row.reason === "string") {
    return {
      success: false,
      status: "timeout",
      transactionId,
      reason: row.reason,
      timestamp,
    };
  }

  return null;
}
