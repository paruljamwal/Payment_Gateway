import { CARD_TYPE_LABELS } from "@/constants/card";
import { TRANSACTION_STATUS_LABELS } from "@/constants/payment";
import type { Transaction } from "@/types/payment";
import { formatMoneyAmount } from "@/utils/formatters/currencyDisplay";

export function formatTransactionTimestamp(timestampMs: number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestampMs));
}

/** Accessible summary for selectable transaction rows (keyboard / SR friendly). */
export function formatTransactionCardAriaLabel(transaction: Transaction): string {
  const amountLabel = formatMoneyAmount(transaction.amount, transaction.currency);
  const stamp = formatTransactionTimestamp(transaction.timestamp);
  const cardLabel = CARD_TYPE_LABELS[transaction.cardType];
  const statusLabel = TRANSACTION_STATUS_LABELS[transaction.status];
  const retryPhrase =
    transaction.retryCount > 0
      ? ` Retry attempts: ${transaction.retryCount}.`
      : "";
  return `Transaction ${transaction.id}. Amount ${amountLabel} ${transaction.currency}. Status ${statusLabel}. Recorded ${stamp}.${retryPhrase} Card ${cardLabel}.`;
}
