import {
  LOCAL_STORAGE_KEYS,
  PAYMENT_SNAPSHOT_VERSION,
} from "@/constants/storage";
import type { Currency, PaymentStatus, Transaction } from "@/types/payment";
import {
  cardBrands,
  currencies,
  paymentStatuses,
} from "@/types/payment";
import { readLocalStorageItem, writeLocalStorageItem } from "@/utils/storage/localStorage";
import { parseJsonSafe } from "@/utils/storage/storageParser";

export type PersistedPaymentSnapshot = {
  readonly version: typeof PAYMENT_SNAPSHOT_VERSION;
  readonly transactions: Transaction[];
  readonly selectedTransactionId: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPaymentStatus(value: unknown): value is PaymentStatus {
  return typeof value === "string" && paymentStatuses.includes(value as PaymentStatus);
}

function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && currencies.includes(value as Currency);
}

function isCardType(value: unknown): value is (typeof cardBrands)[number] {
  return typeof value === "string" && cardBrands.includes(value as (typeof cardBrands)[number]);
}

function coerceTransaction(row: unknown): Transaction | null {
  if (!isRecord(row)) {
    return null;
  }
  const id = row.id;
  const amount = row.amount;
  const currency = row.currency;
  const status = row.status;
  const cardType = row.cardType;
  const timestamp = row.timestamp;
  const retryCount = row.retryCount;

  if (typeof id !== "string" || id.trim() === "") {
    return null;
  }
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return null;
  }
  if (!isCurrency(currency)) {
    return null;
  }
  if (!isPaymentStatus(status)) {
    return null;
  }
  if (!isCardType(cardType)) {
    return null;
  }
  if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) {
    return null;
  }
  if (typeof retryCount !== "number" || !Number.isFinite(retryCount) || retryCount < 0) {
    return null;
  }

  let failureReason: string | null | undefined;
  if ("failureReason" in row) {
    const fr = row.failureReason;
    if (fr === null || fr === undefined) {
      failureReason = null;
    } else if (typeof fr === "string") {
      failureReason = fr;
    } else {
      failureReason = null;
    }
  }

  const tx: Transaction = {
    id,
    amount,
    currency,
    status,
    cardType,
    timestamp,
    retryCount,
  };
  if (failureReason !== undefined) {
    return { ...tx, failureReason };
  }
  return tx;
}

/** Dedupe by `id`, keeping the row with the highest `timestamp`. */
export function dedupeTransactionsById(rows: Transaction[]): Transaction[] {
  const map = new Map<string, Transaction>();
  for (const row of rows) {
    const prev = map.get(row.id);
    if (!prev || row.timestamp >= prev.timestamp) {
      map.set(row.id, row);
    }
  }
  return [...map.values()].sort((a, b) => b.timestamp - a.timestamp);
}

export function normalizeHydratedSelection(
  transactions: Transaction[],
  selectedId: string | null,
): string | null {
  if (!selectedId) {
    return null;
  }
  return transactions.some((t) => t.id === selectedId) ? selectedId : null;
}

function coerceSnapshot(raw: unknown): PersistedPaymentSnapshot | null {
  if (!isRecord(raw)) {
    return null;
  }
  if (raw.version !== PAYMENT_SNAPSHOT_VERSION) {
    return null;
  }
  if (!Array.isArray(raw.transactions)) {
    return null;
  }

  const transactions = raw.transactions
    .map(coerceTransaction)
    .filter((t): t is Transaction => t !== null);

  let selectedTransactionId: string | null = null;
  if ("selectedTransactionId" in raw) {
    const sel = raw.selectedTransactionId;
    if (sel === null || sel === undefined) {
      selectedTransactionId = null;
    } else if (typeof sel === "string") {
      selectedTransactionId = sel;
    }
  }

  const normalized = dedupeTransactionsById(transactions);
  selectedTransactionId = normalizeHydratedSelection(
    normalized,
    selectedTransactionId,
  );

  return {
    version: PAYMENT_SNAPSHOT_VERSION,
    transactions: normalized,
    selectedTransactionId,
  };
}

export function loadPersistedPaymentSnapshot(): PersistedPaymentSnapshot | null {
  const raw = readLocalStorageItem(LOCAL_STORAGE_KEYS.PAYMENT_TRANSACTION_SNAPSHOT);
  if (raw === null) {
    return null;
  }
  const parsed = parseJsonSafe(raw);
  if (!parsed.ok) {
    return null;
  }
  return coerceSnapshot(parsed.value);
}

export function savePersistedPaymentSnapshot(snapshot: PersistedPaymentSnapshot): boolean {
  try {
    const serialized = JSON.stringify(snapshot);
    return writeLocalStorageItem(
      LOCAL_STORAGE_KEYS.PAYMENT_TRANSACTION_SNAPSHOT,
      serialized,
    );
  } catch {
    return false;
  }
}

export function buildPersistedSnapshotFromState(input: {
  transactions: Transaction[];
  selectedTransactionId: string | null;
}): PersistedPaymentSnapshot {
  const transactions = dedupeTransactionsById(input.transactions);
  return {
    version: PAYMENT_SNAPSHOT_VERSION,
    transactions,
    selectedTransactionId: normalizeHydratedSelection(
      transactions,
      input.selectedTransactionId,
    ),
  };
}
