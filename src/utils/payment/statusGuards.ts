import { PAYMENT_STATUS } from "@/constants/payment";
import type { PaymentStatus, TerminalPaymentStatus } from "@/types/payment";

export function isTerminalPaymentStatus(
  value: PaymentStatus,
): value is TerminalPaymentStatus {
  return (
    value === PAYMENT_STATUS.SUCCESS ||
    value === PAYMENT_STATUS.FAILED ||
    value === PAYMENT_STATUS.TIMEOUT
  );
}
