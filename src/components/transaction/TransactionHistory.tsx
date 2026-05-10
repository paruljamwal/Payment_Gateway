"use client";

import {
  useCallback,
  useEffect,
} from "react";
import {
  TRANSACTION_HISTORY_SECTION_TITLE,
  TRANSACTION_HISTORY_SHOW_MORE_LABEL,
} from "@/constants/payment";
import {
  TRANSACTION_HISTORY_LIST_CLASS,
  TRANSACTION_HISTORY_SECTION_TITLE_CLASS,
} from "@/constants/ui";
import { useTransactionHistory } from "@/hooks/transaction/useTransactionHistory";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectSelectedTransactionId,
  selectSelectedTransactionRecord,
} from "@/store/selectors/paymentSelectors";
import { setSelectedTransaction } from "@/store/slices/paymentSlice";
import type { Transaction } from "@/types/payment";
import EmptyHistoryState from "@/components/transaction/EmptyHistoryState";
import TransactionCard from "@/components/transaction/TransactionCard";
import TransactionDetails from "@/components/transaction/TransactionDetails";
import { Button } from "@/components/ui/Button";

export default function TransactionHistory() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(selectSelectedTransactionId);
  const selectedRecord = useAppSelector(selectSelectedTransactionRecord);
  const { visibleTransactions, hasMore, loadMore } = useTransactionHistory();

  const handleSelect = useCallback(
    (tx: Transaction) => {
      dispatch(setSelectedTransaction(tx.id));
    },
    [dispatch],
  );

  useEffect(() => {
    if (selectedId !== null && selectedRecord === null) {
      dispatch(setSelectedTransaction(null));
    }
  }, [dispatch, selectedId, selectedRecord]);

  return (
    <section
      className="min-w-0 border-t border-zinc-200 pt-10 dark:border-zinc-800"
      aria-labelledby="transaction-history-heading"
    >
      <h2
        id="transaction-history-heading"
        className={TRANSACTION_HISTORY_SECTION_TITLE_CLASS}
      >
        {TRANSACTION_HISTORY_SECTION_TITLE}
      </h2>
      <div className="mt-6">
        {visibleTransactions.length === 0 ? (
          <EmptyHistoryState />
        ) : (
          <>
            <ul className={TRANSACTION_HISTORY_LIST_CLASS}>
              {visibleTransactions.map((transaction) => (
                <li key={transaction.id}>
                  <TransactionCard
                    transaction={transaction}
                    isSelected={transaction.id === selectedId}
                    onSelect={handleSelect}
                  />
                </li>
              ))}
            </ul>
            {hasMore ? (
              <Button type="button" variant="ghost" className="mt-4" onClick={loadMore}>
                {TRANSACTION_HISTORY_SHOW_MORE_LABEL}
              </Button>
            ) : null}
          </>
        )}
      </div>
      <TransactionDetails
        transaction={selectedRecord}
        onClose={() => {
          dispatch(setSelectedTransaction(null));
        }}
      />
    </section>
  );
}
