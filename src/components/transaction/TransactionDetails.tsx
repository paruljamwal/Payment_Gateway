"use client";

import clsx from "clsx";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { toast } from "sonner";
import { CARD_TYPE_LABELS } from "@/constants/card";
import {
  TRANSACTION_DETAILS_CLOSE_LABEL,
  TRANSACTION_DETAILS_COPIED_LABEL,
  TRANSACTION_DETAILS_COPY_ID_LABEL,
  TRANSACTION_DETAILS_TITLE,
} from "@/constants/payment";
import { TRANSACTION_DETAIL_DIALOG_CLASS } from "@/constants/ui";
import {
  TOAST_TRANSACTION_ID_COPIED,
  TOAST_TRANSACTION_ID_COPY_FAILED,
} from "@/constants/toast";
import type { Transaction } from "@/types/payment";
import { formatMoneyAmount } from "@/utils/formatters/currencyDisplay";
import { formatTransactionTimestamp } from "@/utils/transaction/formatting";
import TransactionStatusBadge from "@/components/transaction/TransactionStatusBadge";
import { Button } from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";

export type TransactionDetailsProps = {
  transaction: Transaction | null;
  onClose: () => void;
};

const DETAIL_LABEL_CLASS =
  "text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300";

function IconCopy({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CopyTransactionIdButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(TOAST_TRANSACTION_ID_COPIED);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
      toast.error(TOAST_TRANSACTION_ID_COPY_FAILED);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={
        copied
          ? TRANSACTION_DETAILS_COPIED_LABEL
          : `${TRANSACTION_DETAILS_COPY_ID_LABEL} transaction ID`
      }
      aria-label={
        copied
          ? `${TRANSACTION_DETAILS_COPIED_LABEL}, transaction ID`
          : `${TRANSACTION_DETAILS_COPY_ID_LABEL} transaction ID`
      }
      className={clsx(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors",
        "border-zinc-300 text-zinc-700 hover:bg-zinc-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
        "dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800",
        "dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
        copied &&
          "border-emerald-600 text-emerald-700 dark:border-emerald-600 dark:text-emerald-400",
      )}
    >
      {copied ? (
        <IconCheck className="h-4 w-4" />
      ) : (
        <IconCopy className="h-4 w-4" />
      )}
    </button>
  );
}

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
              className="!mt-0 min-h-11 min-w-[96px] shrink-0"
              onClick={onClose}
            >
              {TRANSACTION_DETAILS_CLOSE_LABEL}
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
