import { PAYMENT_STATUS } from "@/constants/payment";
import type { PaymentFormData, Transaction } from "@/types/payment";
import { getCardType } from "@/utils/card/cardType";

export function createPaymentTransactionDraft(
  transactionId: string,
  values: PaymentFormData,
  submissionAttempt: number,
): Transaction {
  const amount = Number(values.amount.trim());
  return {
    id: transactionId,
    amount,
    currency: values.currency,
    status: PAYMENT_STATUS.PROCESSING,
    cardType: getCardType(values.cardNumber),
    timestamp: Date.now(),
    retryCount: Math.max(0, submissionAttempt - 1),
  };
}

export function createRetryProcessingTransaction(
  previous: Transaction,
  submissionAttempt: number,
): Transaction {
  return {
    ...previous,
    status: PAYMENT_STATUS.PROCESSING,
    timestamp: Date.now(),
    retryCount: Math.max(0, submissionAttempt - 1),
    failureReason: null,
  };
}
