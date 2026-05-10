"use client";

import clsx from "clsx";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { toast } from "sonner";
import {
  TRANSACTION_DETAILS_COPIED_LABEL,
  TRANSACTION_DETAILS_COPY_ID_LABEL,
} from "@/constants/payment";
import {
  TOAST_TRANSACTION_ID_COPIED,
  TOAST_TRANSACTION_ID_COPY_FAILED,
} from "@/constants/toast";

export type CopyTransactionIdButtonProps = {
  value: string;
  /** Prevents row/card `click` handlers from firing (e.g. history list behind this control). */
  isolateActivation?: boolean;
  size?: "default" | "compact";
  className?: string;
};

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

export default function CopyTransactionIdButton({
  value,
  isolateActivation = false,
  size = "default",
  className,
}: CopyTransactionIdButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async (event: MouseEvent<HTMLButtonElement>) => {
    if (isolateActivation) {
      event.stopPropagation();
    }
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

  const compact = size === "compact";

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
        "inline-flex shrink-0 items-center justify-center rounded-md border transition-colors",
        compact ? "h-8 w-8" : "h-9 w-9",
        "border-zinc-300 text-zinc-700 hover:bg-zinc-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
        "dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800",
        "dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
        copied &&
          "border-emerald-600 text-emerald-700 dark:border-emerald-600 dark:text-emerald-400",
        className,
      )}
    >
      {copied ? (
        <IconCheck className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      ) : (
        <IconCopy className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      )}
    </button>
  );
}
