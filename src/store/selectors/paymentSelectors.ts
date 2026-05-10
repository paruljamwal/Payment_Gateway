import { createSelector } from "@reduxjs/toolkit";
import { PAYMENT_STATUS } from "@/constants/payment";
import type { RootState } from "@/store/store";
import type { Transaction } from "@/types/payment";
import {
  canRetryPaymentSubmission,
  isRetryableTerminalStatus,
} from "@/utils/payment/retry";

export const selectPaymentSlice = (state: RootState) => state.payment;

export const selectPaymentStatus = (state: RootState) =>
  state.payment.paymentStatus;

export const selectIsGatewayRequestPending = (state: RootState) =>
  state.payment.isGatewayRequestPending;

export const selectIsProcessing = (state: RootState) =>
  state.payment.paymentStatus === PAYMENT_STATUS.PROCESSING ||
  state.payment.isGatewayRequestPending;

export const selectCurrentTransaction = (state: RootState) =>
  state.payment.currentTransaction;

export const selectTransactionHistory = (state: RootState) =>
  state.payment.transactionHistory;

/** Newest activity first — derived without mutating Redux state. */
export const selectSortedTransactionHistory = createSelector(
  [selectTransactionHistory],
  (rows): Transaction[] =>
    [...rows].sort((a, b) => b.timestamp - a.timestamp),
);

export const selectSelectedTransactionId = (state: RootState) =>
  state.payment.selectedTransactionId;

export const selectSelectedTransactionRecord = createSelector(
  [selectSortedTransactionHistory, selectSelectedTransactionId],
  (rows, selectedId): Transaction | null => {
    if (!selectedId) {
      return null;
    }
    return rows.find((row) => row.id === selectedId) ?? null;
  },
);

export const selectSubmissionAttempt = (state: RootState) =>
  state.payment.submissionAttempt;

export const selectMaxRetries = (state: RootState) =>
  state.payment.maxRetries;

export const selectPaymentErrorMessage = (state: RootState) =>
  state.payment.errorMessage;

export const selectPaymentErrorType = (state: RootState) =>
  state.payment.paymentErrorType;

export const selectShowTerminalPaymentUi = (state: RootState) => {
  const status = state.payment.paymentStatus;
  return (
    status === PAYMENT_STATUS.SUCCESS ||
    status === PAYMENT_STATUS.FAILED ||
    status === PAYMENT_STATUS.TIMEOUT
  );
};

export const selectCanRetryPayment = (state: RootState): boolean => {
  const { paymentStatus, submissionAttempt, maxRetries } = state.payment;
  if (!isRetryableTerminalStatus(paymentStatus)) {
    return false;
  }
  return canRetryPaymentSubmission(submissionAttempt, maxRetries);
};

export const selectRetryExhausted = (state: RootState): boolean => {
  const { paymentStatus, submissionAttempt, maxRetries } = state.payment;
  if (!isRetryableTerminalStatus(paymentStatus)) {
    return false;
  }
  return submissionAttempt >= maxRetries;
};
