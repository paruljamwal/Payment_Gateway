import { NextResponse } from "next/server";
import { PAYMENT_API_VALIDATION_MESSAGES } from "@/constants/errors";
import { simulatePaymentGateway } from "@/services/payment/gatewaySimulator";
import { buildPaymentApiErrorBody } from "@/utils/api/responseBuilder";
import { parsePaymentApiBody } from "@/utils/api/paymentRequestValidation";

export async function POST(request: Request): Promise<NextResponse> {
  let parsedBody: unknown;
  try {
    parsedBody = await request.json();
  } catch {
    return NextResponse.json(
      buildPaymentApiErrorBody(
        PAYMENT_API_VALIDATION_MESSAGES.INVALID_JSON,
        "INVALID_JSON",
      ),
      { status: 400 },
    );
  }

  const parsed = parsePaymentApiBody(parsedBody);
  if (!parsed.ok) {
    return NextResponse.json(parsed.body, { status: parsed.status });
  }

  try {
    const payload = await simulatePaymentGateway(parsed.value);
    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json(
      buildPaymentApiErrorBody(
        PAYMENT_API_VALIDATION_MESSAGES.INTERNAL_SIMULATION_ERROR,
        "INTERNAL_SIMULATION_ERROR",
      ),
      { status: 500 },
    );
  }
}
