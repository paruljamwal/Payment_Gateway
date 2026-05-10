"use client";

import { useCallback, useMemo, useState } from "react";
import { HISTORY_PAGE_SIZE } from "@/constants/storage";
import { useAppSelector } from "@/store/hooks";
import {
  selectSortedTransactionHistory,
} from "@/store/selectors/paymentSelectors";
import type { Transaction } from "@/types/payment";

export type UseTransactionHistoryResult = {
  visibleTransactions: Transaction[];
  hasMore: boolean;
  loadMore: () => void;
};

export function useTransactionHistory(): UseTransactionHistoryResult {
  const sortedTransactions = useAppSelector(selectSortedTransactionHistory);
  const [visibleCount, setVisibleCount] = useState(HISTORY_PAGE_SIZE);

  const sliceEnd = Math.min(visibleCount, sortedTransactions.length);

  const visibleTransactions = useMemo(
    () => sortedTransactions.slice(0, sliceEnd),
    [sortedTransactions, sliceEnd],
  );

  const hasMore = sortedTransactions.length > sliceEnd;

  const loadMore = useCallback(() => {
    setVisibleCount((previous) => previous + HISTORY_PAGE_SIZE);
  }, []);

  return {
    visibleTransactions,
    hasMore,
    loadMore,
  };
}
