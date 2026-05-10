import type { CardBrand } from "@/types/payment";

export const CARD_TYPE_LABELS: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  unknown: "Card",
};

export const CARD_PREVIEW_COPY = {
  placeholderName: "YOUR NAME",
  placeholderExpiry: "MM/YY",
  placeholderNumberPan: "#### #### #### ####",
  placeholderNumberAmex: "#### ###### #####",
} as const;

/** Stable id fragment: combine with field id for `aria-describedby`. */
export const CARD_NUMBER_BRAND_HINT_ID = "cardNumber-detected-brand";

export const CARD_PREVIEW_REGION_LABEL = "Live card preview";

export const CVV_FIELD_PLACEHOLDER = {
  amex: "4 digits",
  standard: "3 digits",
  unknown: "3 or 4 digits",
} as const;
