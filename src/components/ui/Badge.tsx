"use client";

import clsx from "clsx";
import { TRANSACTION_STATUS_LABELS } from "@/constants/payment";
import { TRANSACTION_STATUS_BADGE_CLASSES } from "@/constants/ui";
import type { PaymentStatus } from "@/types/payment";

export type BadgeProps = {
  paymentStatus: PaymentStatus;
  className?: string;
};

export default function Badge({ paymentStatus, className }: BadgeProps) {
  const label = TRANSACTION_STATUS_LABELS[paymentStatus];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        TRANSACTION_STATUS_BADGE_CLASSES[paymentStatus],
        className,
      )}
    >
      {label}
    </span>
  );
}
