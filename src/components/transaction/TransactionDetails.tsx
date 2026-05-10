"use client";

import clsx from "clsx";
import { useEffect, useId, useRef, type MouseEvent } from "react";
import { CARD_TYPE_LABELS } from "@/constants/card";
import {
  TRANSACTION_DETAILS_CLOSE_LABEL,
  TRANSACTION_DETAILS_TITLE,
} from "@/constants/payment";
import { TRANSACTION_DETAIL_DIALOG_CLASS } from "@/constants/ui";
import type { Transaction } from "@/types/payment";
import { formatMoneyAmount } from "@/utils/formatters/currencyDisplay";
import { formatTransactionTimestamp } from "@/utils/transaction/formatting";
import TransactionStatusBadge from "@/components/transaction/TransactionStatusBadge";
import { Button } from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";
import CopyTransactionIdButton from "@/components/transaction/CopyTransactionIdButton";
import IconClose from "@/components/ui/IconClose";

export type TransactionDetailsProps = {
  transaction: Transaction | null;
  onClose: () => void;
};

const DETAIL_LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300";

function TransactionDetailRows({
  transaction,
  labelledById,
}: {
  transaction: Transaction;
  labelledById: string;
}) {
  const amountDisplay = formatMoneyAmount(transaction.amount, transaction.currency);
  const stamp = formatTransactionTimestamp(transaction.timestamp);
  const cardLabel = CARD_TYPE_LABELS[transaction.cardType];
  const failureReason =
    transaction.failureReason !== undefined &&
    transaction.failureReason !== null &&
    transaction.failureReason.trim() !== ""
      ? transaction.failureReason
      : null;

  const rows: { term: string; description: string }[] = [
    { term: "Amount", description: amountDisplay },
    {
      term: "Retry attempts",
      description: String(transaction.retryCount),
    },
    { term: "Timestamp", description: stamp },
    { term: "Card type", description: cardLabel },
  ];

  return (
    <SectionCard className="p-4 sm:p-5">
      <dl
        className="grid gap-3 text-sm leading-snug sm:gap-3.5 sm:leading-relaxed"
        aria-labelledby={labelledById}
      >
        <div className="grid gap-1.5">
          <dt
            className={clsx(
              DETAIL_LABEL_CLASS,
              "flex items-center justify-between gap-2",
            )}
          >
            <span className="min-w-0">Transaction ID</span>
            <CopyTransactionIdButton value={transaction.id} />
          </dt>
          <dd className="min-w-0 break-all font-mono text-[13px] leading-snug text-zinc-900 dark:text-zinc-50">
            {transaction.id}
          </dd>
        </div>

        {rows.map((row) => (
          <div key={row.term} className="grid gap-1.5">
            <dt className={DETAIL_LABEL_CLASS}>{row.term}</dt>
            <dd className="break-words text-base text-zinc-900 dark:text-zinc-50">
              {row.description}
            </dd>
          </div>
        ))}

        {failureReason ? (
          <div className="grid gap-1.5 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/40">
            <dt className="text-xs font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-100">
              Failure reason
            </dt>
            <dd className="text-sm text-amber-950 dark:text-amber-50" role="note">
              {failureReason}
            </dd>
          </div>
        ) : null}
      </dl>
    </SectionCard>
  );
}

export default function TransactionDetails({
  transaction,
  onClose,
}: TransactionDetailsProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const headingId = useId();
  const transactionId = transaction?.id ?? null;

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) {
      return;
    }

    if (!transactionId) {
      node.close();
      return;
    }

    returnFocusRef.current = document.activeElement as HTMLElement | null;

    if (!node.open) {
      node.showModal();
    }

    queueMicrotask(() => {
      node.querySelector<HTMLButtonElement>("[data-tx-details-close]")?.focus();
    });

    return () => {
      node.close();
      returnFocusRef.current?.focus({ preventScroll: true });
      returnFocusRef.current = null;
    };
  }, [transactionId]);

  const handleBackdropPointer = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={TRANSACTION_DETAIL_DIALOG_CLASS}
      aria-labelledby={headingId}
      aria-modal="true"
      onMouseDown={handleBackdropPointer}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {transaction ? (
        <div
          className="flex flex-col gap-4"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-2">
              <h2
                id={headingId}
                tabIndex={-1}
                className="text-pretty text-lg font-semibold tracking-tight text-zinc-900 outline-none dark:text-zinc-50"
              >
                {TRANSACTION_DETAILS_TITLE}
              </h2>
              <TransactionStatusBadge status={transaction.status} />
            </div>
            <Button
              type="button"
              variant="outline"
              data-tx-details-close
              className="!mt-0 flex size-11 shrink-0 items-center justify-center !min-h-0 p-0 !px-0 !py-0 leading-none font-normal"
              onClick={onClose}
              aria-label={TRANSACTION_DETAILS_CLOSE_LABEL}
            >
              <IconClose className="pointer-events-none block size-6 shrink-0" />
            </Button>
          </div>
          <TransactionDetailRows
            transaction={transaction}
            labelledById={headingId}
          />
        </div>
      ) : null}
    </dialog>
  );
}
