import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_PAYMENT_STATE, PAYMENT_STATUS } from "@/constants/payment";
import type {
  PaymentErrorType,
  PaymentStatus,
  Transaction,
  TransactionState,
} from "@/types/payment";

const initialState: TransactionState = {
  ...DEFAULT_PAYMENT_STATE,
  transactionHistory: [...DEFAULT_PAYMENT_STATE.transactionHistory],
};

function sortHistoryDescending(entries: Transaction[]): void {
  entries.sort((a, b) => b.timestamp - a.timestamp);
}

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentStatus(state, action: PayloadAction<PaymentStatus>) {
      state.paymentStatus = action.payload;
    },

    setProcessing(state) {
      state.paymentStatus = PAYMENT_STATUS.PROCESSING;
    },

    setError(
      state,
      action: PayloadAction<{ message: string; errorType?: PaymentErrorType | null }>,
    ) {
      state.errorMessage = action.payload.message;
      state.paymentErrorType = action.payload.errorType ?? null;
    },

    clearPaymentError(state) {
      state.errorMessage = null;
      state.paymentErrorType = null;
    },

    resetPayment(state) {
      state.paymentStatus = PAYMENT_STATUS.IDLE;
      state.currentTransaction = null;
      state.submissionAttempt = 0;
      state.isGatewayRequestPending = false;
      state.errorMessage = null;
      state.paymentErrorType = null;
      state.selectedTransactionId = null;
    },

    beginGatewayRequest(state) {
      state.isGatewayRequestPending = true;
    },

    endGatewayRequest(state) {
      state.isGatewayRequestPending = false;
    },

    setCurrentTransaction(state, action: PayloadAction<Transaction | null>) {
      state.currentTransaction = action.payload;
    },

    upsertTransaction(state, action: PayloadAction<Transaction>) {
      const incoming = action.payload;
      const idx = state.transactionHistory.findIndex((row) => row.id === incoming.id);
      if (idx === -1) {
        state.transactionHistory.unshift(incoming);
      } else {
        const existing = state.transactionHistory[idx];
        if (existing) {
          state.transactionHistory[idx] = { ...existing, ...incoming };
        }
      }
      sortHistoryDescending(state.transactionHistory);
    },

    incrementSubmissionAttempt(state) {
      state.submissionAttempt += 1;
    },

    setSelectedTransaction(state, action: PayloadAction<string | null>) {
      state.selectedTransactionId = action.payload;
    },

    hydrateTransactions(
      state,
      action: PayloadAction<{
        transactions: Transaction[];
        selectedTransactionId?: string | null;
      }>,
    ) {
      state.transactionHistory = [...action.payload.transactions];
      sortHistoryDescending(state.transactionHistory);
      if (action.payload.selectedTransactionId !== undefined) {
        state.selectedTransactionId = action.payload.selectedTransactionId;
      }
    },

    clearTransactions(state) {
      state.transactionHistory = [];
      state.selectedTransactionId = null;
    },
  },
});

export const {
  setPaymentStatus,
  setProcessing,
  setError,
  clearPaymentError,
  resetPayment,
  beginGatewayRequest,
  endGatewayRequest,
  setCurrentTransaction,
  upsertTransaction,
  incrementSubmissionAttempt,
  setSelectedTransaction,
  hydrateTransactions,
  clearTransactions,
} = paymentSlice.actions;

export const paymentReducer = paymentSlice.reducer;
