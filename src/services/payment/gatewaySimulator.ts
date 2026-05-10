import { PAYMENT_TIMEOUT_DELAY_MS } from "@/constants/api";
import { MOCK_GATEWAY_TIMEOUT_REASON } from "@/constants/errors";
import type { PaymentApiRequest, PaymentApiResponse } from "@/types/api";
import { delay } from "@/utils/api/delay";
import {
  pickRandomFailureReason,
  rollGatewaySimulationOutcome,
} from "@/utils/api/randomizer";
import {
  buildPaymentFailureResponse,
  buildPaymentSuccessResponse,
  buildPaymentTimeoutResponse,
} from "@/utils/api/responseBuilder";

export async function simulatePaymentGateway(
  request: PaymentApiRequest,
): Promise<PaymentApiResponse> {
  const outcome = rollGatewaySimulationOutcome();

  if (outcome === "timeout") {
    await delay(PAYMENT_TIMEOUT_DELAY_MS);
    return buildPaymentTimeoutResponse(
      request.transactionId,
      MOCK_GATEWAY_TIMEOUT_REASON,
    );
  }

  if (outcome === "failure") {
    return buildPaymentFailureResponse(
      request.transactionId,
      pickRandomFailureReason(),
    );
  }

  return buildPaymentSuccessResponse(request.transactionId);
}
