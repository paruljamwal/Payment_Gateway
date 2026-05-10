"use client";

import Badge from "@/components/ui/Badge";
import type { PaymentStatus } from "@/types/payment";

export type TransactionStatusBadgeProps = {
  status: PaymentStatus;
  className?: string;
};

export default function TransactionStatusBadge({
  status,
  className,
}: TransactionStatusBadgeProps) {
  return <Badge paymentStatus={status} className={className} />;
}
