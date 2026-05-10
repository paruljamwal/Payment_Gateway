"use client";

import { useCallback, useRef } from "react";
import { useStore } from "react-redux";
import { PAYMENT_FLOW_ERROR_MESSAGES } from "@/constants/errors";
import { PAYMENT_STATUS } from "@/constants/payment";
import { useAppDispatch } from "@/store/hooks";
import type { AppDispatch, RootState } from "@/store/store";
import {
  selectCurrentTransaction,
  selectMaxRetries,
  selectSubmissionAttempt,
} from "@/store/selectors/paymentSelectors";
import {
  beginGatewayRequest,
  clearPaymentError,
  endGatewayRequest,
  incrementSubmissionAttempt,
  setCurrentTransaction,
  setError,
  setPaymentStatus,
  setProcessing,
  upsertTransaction,
} from "@/store/slices/paymentSlice";
import { executeGatewayPayment } from "@/services/payment/paymentService";
import type { PaymentGatewayFlowResult } from "@/services/payment/paymentService";
import type { PaymentFormData, Transaction } from "@/types/payment";
import {
  createPaymentTransactionDraft,
  createRetryProcessingTransaction,
} from "@/utils/payment/transaction";

function applyGatewayFlowResult(
  dispatch: AppDispatch,
  result: PaymentGatewayFlowResult,
  draft: Transaction,
  attempt: number,
  maxRetries: number,
): void {
  const exhausted = attempt >= maxRetries;

  const finalizeFailureMessage = (
    primaryWhenRetryAvailable: string,
  ): string => {
    return exhausted
      ? PAYMENT_FLOW_ERROR_MESSAGES.FINAL_ATTEMPTS_USED
      : primaryWhenRetryAvailable;
  };

  switch (result.outcome) {
    case "success": {
      const terminal: Transaction = {
        ...draft,
        status: PAYMENT_STATUS.SUCCESS,
        retryCount: Math.max(0, attempt - 1),
        timestamp: Date.now(),
        failureReason: null,
      };
      dispatch(setCurrentTransaction(terminal));
      dispatch(upsertTransaction(terminal));
      dispatch(setPaymentStatus(PAYMENT_STATUS.SUCCESS));
      dispatch(clearPaymentError());
      return;
    }

    case "gateway_failed": {
      const reason = finalizeFailureMessage(result.payload.reason);
      const terminal: Transaction = {
        ...draft,
        status: PAYMENT_STATUS.FAILED,
        retryCount: Math.max(0, attempt - 1),
        timestamp: Date.now(),
        failureReason: reason,
      };
      dispatch(setCurrentTransaction(terminal));
      dispatch(upsertTransaction(terminal));
      dispatch(setPaymentStatus(PAYMENT_STATUS.FAILED));
      dispatch(
        setError({
          message: reason,
          errorType: "gateway",
        }),
      );
      return;
    }

    case "gateway_timeout": {
      const reason = finalizeFailureMessage(result.payload.reason);
      const terminal: Transaction = {
        ...draft,
        status: PAYMENT_STATUS.TIMEOUT,
        retryCount: Math.max(0, attempt - 1),
        timestamp: Date.now(),
        failureReason: reason,
      };
      dispatch(setCurrentTransaction(terminal));
      dispatch(upsertTransaction(terminal));
      dispatch(setPaymentStatus(PAYMENT_STATUS.TIMEOUT));
      dispatch(
        setError({
          message: reason,
          errorType: "network",
        }),
      );
      return;
    }

    case "client_timeout": {
      const reason = finalizeFailureMessage(result.message);
      const terminal: Transaction = {
        ...draft,
        status: PAYMENT_STATUS.TIMEOUT,
        retryCount: Math.max(0, attempt - 1),
        timestamp: Date.now(),
        failureReason: reason,
      };
      dispatch(setCurrentTransaction(terminal));
      dispatch(upsertTransaction(terminal));
      dispatch(setPaymentStatus(PAYMENT_STATUS.TIMEOUT));
      dispatch(
        setError({
          message: reason,
          errorType: "network",
        }),
      );
      return;
    }

    case "http_error": {
      const reason = finalizeFailureMessage(result.body.error);
      const terminal: Transaction = {
        ...draft,
        status: PAYMENT_STATUS.FAILED,
        retryCount: Math.max(0, attempt - 1),
        timestamp: Date.now(),
        failureReason: reason,
      };
      dispatch(setCurrentTransaction(terminal));
      dispatch(upsertTransaction(terminal));
      dispatch(setPaymentStatus(PAYMENT_STATUS.FAILED));
      dispatch(
        setError({
          message: reason,
          errorType: "gateway",
        }),
      );
      return;
    }

    case "network": {
      const reason = finalizeFailureMessage(result.message);
      const terminal: Transaction = {
        ...draft,
        status: PAYMENT_STATUS.FAILED,
        retryCount: Math.max(0, attempt - 1),
        timestamp: Date.now(),
        failureReason: reason,
      };
      dispatch(setCurrentTransaction(terminal));
      dispatch(upsertTransaction(terminal));
      dispatch(setPaymentStatus(PAYMENT_STATUS.FAILED));
      dispatch(
        setError({
          message: reason,
          errorType: "network",
        }),
      );
      return;
    }

    case "unexpected": {
      const reason = finalizeFailureMessage(result.message);
      const terminal: Transaction = {
        ...draft,
        status: PAYMENT_STATUS.FAILED,
        retryCount: Math.max(0, attempt - 1),
        timestamp: Date.now(),
        failureReason: reason,
      };
      dispatch(setCurrentTransaction(terminal));
      dispatch(upsertTransaction(terminal));
      dispatch(setPaymentStatus(PAYMENT_STATUS.FAILED));
      dispatch(
        setError({
          message: reason,
          errorType: "gateway",
        }),
      );
      return;
    }
  }
}

export function usePayment(formValues: PaymentFormData) {
  const dispatch = useAppDispatch();
  const store = useStore<RootState>();
  const inFlightRef = useRef(false);

  const runSubmissionCore = useCallback(
    async (mode: "initial" | "retry") => {
      dispatch(incrementSubmissionAttempt());
      const snapshot = store.getState();
      const attempt = selectSubmissionAttempt(snapshot);
      const maxRetries = selectMaxRetries(snapshot);

      let draft: Transaction;

      if (mode === "initial") {
        const transactionId = crypto.randomUUID();
        dispatch(clearPaymentError());
        draft = createPaymentTransactionDraft(
          transactionId,
          formValues,
          attempt,
        );
        dispatch(setCurrentTransaction(draft));
        dispatch(upsertTransaction(draft));
        dispatch(setProcessing());

        const result = await executeGatewayPayment({
          transactionId,
          amount: draft.amount,
          currency: draft.currency,
        });

        applyGatewayFlowResult(dispatch, result, draft, attempt, maxRetries);
        return;
      }

      const previous = selectCurrentTransaction(snapshot);
      if (!previous) {
        return;
      }

      dispatch(beginGatewayRequest());
      dispatch(clearPaymentError());
      draft = createRetryProcessingTransaction(previous, attempt);
      dispatch(setCurrentTransaction(draft));
      dispatch(upsertTransaction(draft));

      const result = await executeGatewayPayment({
        transactionId: previous.id,
        amount: draft.amount,
        currency: draft.currency,
      });

      applyGatewayFlowResult(dispatch, result, draft, attempt, maxRetries);
    },
    [dispatch, formValues, store],
  );

  const submitNewPayment = useCallback(async () => {
    if (inFlightRef.current) {
      return;
    }
    inFlightRef.current = true;
    try {
      await runSubmissionCore("initial");
    } finally {
      dispatch(endGatewayRequest());
      inFlightRef.current = false;
    }
  }, [dispatch, runSubmissionCore]);

  const retryPayment = useCallback(async () => {
    if (inFlightRef.current) {
      return;
    }
    inFlightRef.current = true;
    try {
      await runSubmissionCore("retry");
    } finally {
      dispatch(endGatewayRequest());
      inFlightRef.current = false;
    }
  }, [dispatch, runSubmissionCore]);

  return { submitNewPayment, retryPayment };
}
