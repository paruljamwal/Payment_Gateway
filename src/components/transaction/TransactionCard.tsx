"use client";

import { memo, useMemo } from "react";
import { CARD_TYPE_LABELS } from "@/constants/card";
import { TRANSACTION_HISTORY_CARD_CLASS } from "@/constants/ui";
import type { Transaction } from "@/types/payment";
import { formatMoneyAmount } from "@/utils/formatters/currencyDisplay";
import {
  formatTransactionCardAriaLabel,
  formatTransactionTimestamp,
} from "@/utils/transaction/formatting";
import TransactionStatusBadge from "@/components/transaction/TransactionStatusBadge";

export type TransactionCardProps = {
  transaction: Transaction;
  isSelected: boolean;
  onSelect: (transaction: Transaction) => void;
};

function TransactionCardImpl({
  transaction,
  isSelected,
  onSelect,
}: TransactionCardProps) {
  const amountLabel = useMemo(
    () => formatMoneyAmount(transaction.amount, transaction.currency),
    [transaction.amount, transaction.currency],
  );

  const stamp = useMemo(
    () => formatTransactionTimestamp(transaction.timestamp),
    [transaction.timestamp],
  );

  const cardLabel = CARD_TYPE_LABELS[transaction.cardType];

  const summaryLine = useMemo(() => {
    const retrySegment =
      transaction.retryCount > 0
        ? `, ${transaction.retryCount} retry attempts`
        : "";
    return `${amountLabel}, ${transaction.currency}${retrySegment}`;
  }, [amountLabel, transaction.currency, transaction.retryCount]);

  const ariaLabel = useMemo(
    () => formatTransactionCardAriaLabel(transaction),
    [transaction],
  );

  return (
    <button
      type="button"
      className={TRANSACTION_HISTORY_CARD_CLASS}
      aria-current={isSelected ? "true" : undefined}
      aria-label={ariaLabel}
      onClick={() => {
        onSelect(transaction);
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">
            {transaction.id}
          </p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {summaryLine}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {stamp} · {cardLabel}
          </p>
        </div>
        <TransactionStatusBadge status={transaction.status} />
      </div>
    </button>
  );
}

export default memo(TransactionCardImpl);
