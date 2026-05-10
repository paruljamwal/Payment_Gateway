import { FRONTEND_TIMEOUT_MS, PAYMENT_API_PAY_ROUTE } from "@/constants/api";
import { PAYMENT_FLOW_ERROR_MESSAGES } from "@/constants/errors";
import type { PaymentApiRequest, PaymentApiResponse } from "@/types/api";
import type { PaymentApiErrorBody } from "@/types/api";
import { postPaymentRequest } from "@/services/payment/paymentApi";
import { parsePaymentHttpResponse } from "@/services/payment/requestHandler";
import {
  createAbortTimeout,
  isAbortError,
} from "@/utils/payment/timeoutHandler";

export type PaymentGatewayFlowSuccess = Extract<
  PaymentApiResponse,
  { success: true }
>;

export type PaymentGatewayFlowFailure = Extract<
  PaymentApiResponse,
  { success: false; status: "failed" }
>;

export type PaymentGatewayFlowGatewayTimeout = Extract<
  PaymentApiResponse,
  { success: false; status: "timeout" }
>;

export type PaymentGatewayFlowResult =
  | { outcome: "success"; payload: PaymentGatewayFlowSuccess }
  | { outcome: "gateway_failed"; payload: PaymentGatewayFlowFailure }
  | { outcome: "gateway_timeout"; payload: PaymentGatewayFlowGatewayTimeout }
  | { outcome: "client_timeout"; message: string }
  | { outcome: "http_error"; body: PaymentApiErrorBody }
  | { outcome: "network"; message: string }
  | { outcome: "unexpected"; message: string };

export async function executeGatewayPayment(
  payload: PaymentApiRequest,
  options?: { apiPath?: string; timeoutMs?: number },
): Promise<PaymentGatewayFlowResult> {
  const apiUrl = options?.apiPath ?? PAYMENT_API_PAY_ROUTE;
  const timeoutMs = options?.timeoutMs ?? FRONTEND_TIMEOUT_MS;

  const { controller, clear } = createAbortTimeout(timeoutMs);

  try {
    const response = await postPaymentRequest(
      apiUrl,
      payload,
      controller.signal,
    );
    clear();

    const parsed = await parsePaymentHttpResponse(response);

    if (!parsed.ok) {
      return { outcome: "http_error", body: parsed.body };
    }

    const data = parsed.data;

    if (data.success) {
      return { outcome: "success", payload: data };
    }

    if (data.status === "failed") {
      return { outcome: "gateway_failed", payload: data };
    }

    return { outcome: "gateway_timeout", payload: data };
  } catch (error) {
    clear();

    if (isAbortError(error)) {
      return {
        outcome: "client_timeout",
        message: PAYMENT_FLOW_ERROR_MESSAGES.CLIENT_TIMEOUT,
      };
    }

    if (error instanceof TypeError) {
      return {
        outcome: "network",
        message: PAYMENT_FLOW_ERROR_MESSAGES.NETWORK,
      };
    }

    return {
      outcome: "unexpected",
      message: PAYMENT_FLOW_ERROR_MESSAGES.UNEXPECTED,
    };
  }
}
