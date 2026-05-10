"use client";

import Badge from "@/components/ui/Badge";
import type { PaymentStatus } from "@/types/payment";

export type TransactionStatusBadgeProps = {
  status: PaymentStatus;
};

export default function TransactionStatusBadge({
  status,
}: TransactionStatusBadgeProps) {
  return <Badge paymentStatus={status} />;
}
