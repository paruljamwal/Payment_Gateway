import { CARD_PREVIEW_COPY } from "@/constants/card";
import type { CardBrand } from "@/types/payment";
import { formatCardNumber } from "@/utils/formatters/cardFormatters";

export function getPreviewCardNumberDisplay(
  digits: string,
  brand: CardBrand,
): string {
  if (!digits) {
    return brand === "amex"
      ? CARD_PREVIEW_COPY.placeholderNumberAmex
      : CARD_PREVIEW_COPY.placeholderNumberPan;
  }
  return formatCardNumber(digits);
}

export function getPreviewCardholderDisplay(value: string): string {
  const trimmed = value.trim().toUpperCase();
  return trimmed.length > 0 ? trimmed : CARD_PREVIEW_COPY.placeholderName;
}

export function getPreviewExpiryDisplay(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : CARD_PREVIEW_COPY.placeholderExpiry;
}
