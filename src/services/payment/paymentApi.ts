import type { PaymentApiRequest } from "@/types/api";

export async function postPaymentRequest(
  apiUrl: string,
  payload: PaymentApiRequest,
  signal: AbortSignal,
): Promise<Response> {
  return fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
}
