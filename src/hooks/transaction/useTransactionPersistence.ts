"use client";

import { useEffect, useRef } from "react";
import { hydrateTransactions } from "@/store/slices/paymentSlice";
import { store } from "@/store/store";
import {
  buildPersistedSnapshotFromState,
  loadPersistedPaymentSnapshot,
  savePersistedPaymentSnapshot,
} from "@/utils/storage/transactionPersistence";

export function useTransactionPersistence(): void {
  const lastSerialized = useRef<string>("");

  useEffect(() => {
    const snapshot = loadPersistedPaymentSnapshot();
    const transactions = snapshot?.transactions ?? [];
    const selectedTransactionId = snapshot?.selectedTransactionId ?? null;

    const canonical = buildPersistedSnapshotFromState({
      transactions,
      selectedTransactionId,
    });
    lastSerialized.current = JSON.stringify(canonical);

    const unsubscribe = store.subscribe(() => {
      const nextState = store.getState();
      const next = buildPersistedSnapshotFromState({
        transactions: nextState.payment.transactionHistory,
        selectedTransactionId: nextState.payment.selectedTransactionId,
      });
      const serialized = JSON.stringify(next);
      if (serialized === lastSerialized.current) {
        return;
      }
      lastSerialized.current = serialized;
      savePersistedPaymentSnapshot(next);
    });

    store.dispatch(
      hydrateTransactions({
        transactions,
        selectedTransactionId,
      }),
    );

    return unsubscribe;
  }, []);
}
