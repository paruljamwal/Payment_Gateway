"use client";

import { memo, type KeyboardEvent, useMemo } from "react";
import { CARD_TYPE_LABELS } from "@/constants/card";
import {
  TRANSACTION_HISTORY_CARD_CLASS,
  TRANSACTION_HISTORY_RETRY_META_CLASS,
} from "@/constants/ui";
import type { Transaction } from "@/types/payment";
import { formatMoneyAmount } from "@/utils/formatters/currencyDisplay";
import {
  formatTransactionCardAriaLabel,
  formatTransactionTimestamp,
} from "@/utils/transaction/formatting";
import TransactionStatusBadge from "@/components/transaction/TransactionStatusBadge";
import CopyTransactionIdButton from "@/components/transaction/CopyTransactionIdButton";

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

  const ariaLabel = useMemo(
    () => formatTransactionCardAriaLabel(transaction),
    [transaction],
  );

  const retryChip =
    transaction.retryCount > 0 ? (
      <span className={TRANSACTION_HISTORY_RETRY_META_CLASS}>
        {transaction.retryCount === 1
          ? "1 retry"
          : `${transaction.retryCount} retries`}
      </span>
    ) : null;

  const activate = () => {
    onSelect(transaction);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={TRANSACTION_HISTORY_CARD_CLASS}
      aria-current={isSelected ? "true" : undefined}
      aria-label={ariaLabel}
      onClick={activate}
      onKeyDown={handleKeyDown}
    >
      <div className="flex min-w-0 flex-row items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex min-w-0 items-center gap-2">
            <p
              className="min-w-0 flex-1 truncate font-mono text-[11px] leading-snug text-zinc-500 dark:text-zinc-400 sm:text-xs"
              title={transaction.id}
            >
              {transaction.id}
            </p>
            <CopyTransactionIdButton
              value={transaction.id}
              isolateActivation
              size="compact"
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {amountLabel}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {transaction.currency}
            </span>
            {retryChip}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {stamp} · {cardLabel}
          </p>
        </div>
        <TransactionStatusBadge
          status={transaction.status}
          className="shrink-0 self-center"
        />
      </div>
    </div>
  );
}

export default memo(TransactionCardImpl);
