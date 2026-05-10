"use client";

import {
  useEffect,
  useId,
  useRef,
} from "react";
import clsx from "clsx";
import {
  PAYMENT_NEW_PAYMENT_LABEL,
  PAYMENT_RETRY_AVAILABLE_HINT,
  PAYMENT_RETRY_EXHAUSTED_HINT,
  PAYMENT_STATUS_SCREEN_COPY,
} from "@/constants/payment";
import {
  TERMINAL_PAYMENT_ALERT_TEXT_CLASS,
  TERMINAL_PAYMENT_ICON_PRESENTATION,
} from "@/constants/statusPresentation";
import {
  PAYMENT_STATUS_SURFACE_CLASS,
} from "@/constants/ui";
import { CARD_TYPE_LABELS } from "@/constants/card";
import type { TerminalPaymentStatus, Transaction } from "@/types/payment";
import { formatMoneyAmount } from "@/utils/formatters/currencyDisplay";
import AttemptCounter from "@/components/payment/AttemptCounter";
import RetryButton from "@/components/payment/RetryButton";
import { Button } from "@/components/ui/Button";
import SectionCard from "@/components/ui/SectionCard";

export type PaymentStatusScreenProps = {
  status: TerminalPaymentStatus;
  transaction: Transaction | null;
  errorMessage: string | null;
  submissionAttempt: number;
  maxRetries: number;
  canRetry: boolean;
  retryExhausted: boolean;
  isGatewayBusy: boolean;
  onNewPayment: () => void;
  onRetry: () => void | Promise<void>;
};

export default function PaymentStatusScreen({
  status,
  transaction,
  errorMessage,
  submissionAttempt,
  maxRetries,
  canRetry,
  retryExhausted,
  isGatewayBusy,
  onNewPayment,
  onRetry,
}: PaymentStatusScreenProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const retryRef = useRef<HTMLButtonElement>(null);
  const retryHintId = useId();
  const exhaustedHintId = useId();
  const copy = PAYMENT_STATUS_SCREEN_COPY[status];
  const accent = TERMINAL_PAYMENT_ICON_PRESENTATION[status];

  useEffect(() => {
    const shouldFocusRetry =
      status !== "success" &&
      canRetry &&
      !retryExhausted &&
      !isGatewayBusy;

    if (shouldFocusRetry) {
      const frame = requestAnimationFrame(() => {
        retryRef.current?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }

    headingRef.current?.focus({ preventScroll: true });
    return undefined;
  }, [status, errorMessage, submissionAttempt, canRetry, retryExhausted, isGatewayBusy]);

  const amountLabel =
    transaction !== null
      ? formatMoneyAmount(transaction.amount, transaction.currency)
      : null;

  const cardLabel =
    transaction !== null ? CARD_TYPE_LABELS[transaction.cardType] : null;

  const showAttemptSummary =
    (status === "failed" || status === "timeout") && submissionAttempt > 0;

  const retryDisabled = !canRetry || isGatewayBusy;
  const retryDescribedBy = retryExhausted ? exhaustedHintId : retryHintId;

  const terminalAlert =
    status !== "success" && errorMessage ? (
      <p
        className={clsx(
          "text-sm font-medium",
          TERMINAL_PAYMENT_ALERT_TEXT_CLASS[status],
        )}
        role="alert"
      >
        {errorMessage}
      </p>
    ) : null;

  return (
    <section
      className="w-full max-w-lg min-w-0 justify-self-center lg:justify-self-stretch"
      aria-labelledby="payment-status-heading"
      role="region"
    >
      <div className={PAYMENT_STATUS_SURFACE_CLASS}>
        <div className="flex gap-3 sm:gap-4">
          <div
            className={clsx(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-lg font-semibold sm:h-12 sm:w-12 sm:text-xl",
              accent.bubbleClass,
            )}
            aria-hidden
          >
            {accent.glyph}
          </div>
          <div
            className="min-w-0 flex-1 space-y-2"
            aria-live="polite"
            aria-atomic="true"
          >
            <h3
              ref={headingRef}
              id="payment-status-heading"
              tabIndex={-1}
              className="text-pretty text-lg font-semibold tracking-tight text-zinc-900 outline-none dark:text-zinc-50"
            >
              {copy.title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {copy.message}
            </p>
            {terminalAlert}
            {showAttemptSummary ? (
              <AttemptCounter attempt={submissionAttempt} maxAttempts={maxRetries} />
            ) : null}
          </div>
        </div>

        {transaction ? (
          <SectionCard className="p-4 text-sm sm:p-5">
            <dl className="grid gap-3">
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-zinc-500 dark:text-zinc-400">Amount</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                  {amountLabel}
                </dd>
              </div>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-zinc-500 dark:text-zinc-400">Card</dt>
                <dd className="font-medium text-zinc-900 dark:text-zinc-50">
                  {cardLabel}
                </dd>
              </div>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                <dt className="text-zinc-500 dark:text-zinc-400">Reference</dt>
                <dd className="break-all font-mono text-xs text-zinc-800 dark:text-zinc-200">
                  {transaction.id}
                </dd>
              </div>
            </dl>
          </SectionCard>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="primary"
            className="!mt-0 min-h-11 w-full sm:w-auto sm:min-w-[140px]"
            onClick={onNewPayment}
          >
            {PAYMENT_NEW_PAYMENT_LABEL}
          </Button>
          {status !== "success" ? (
            <RetryButton
              ref={retryRef}
              disabled={retryDisabled}
              exhausted={retryExhausted}
              describedById={retryDescribedBy}
              onRetry={onRetry}
            />
          ) : null}
        </div>
        {status !== "success" ? (
          retryExhausted ? (
            <p id={exhaustedHintId} className="text-xs text-zinc-500 dark:text-zinc-400">
              {PAYMENT_RETRY_EXHAUSTED_HINT}
            </p>
          ) : (
            <p id={retryHintId} className="text-xs text-zinc-500 dark:text-zinc-400">
              {PAYMENT_RETRY_AVAILABLE_HINT}
            </p>
          )
        ) : null}
      </div>
    </section>
  );
}
