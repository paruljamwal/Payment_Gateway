"use client";

import {
  TRANSACTION_HISTORY_EMPTY_BODY,
  TRANSACTION_HISTORY_EMPTY_TITLE,
} from "@/constants/payment";
import { TRANSACTION_EMPTY_STATE_CLASS } from "@/constants/ui";
import EmptyState from "@/components/ui/EmptyState";

export default function EmptyHistoryState() {
  return (
    <EmptyState
      title={TRANSACTION_HISTORY_EMPTY_TITLE}
      description={TRANSACTION_HISTORY_EMPTY_BODY}
      className={TRANSACTION_EMPTY_STATE_CLASS}
    />
  );
}
