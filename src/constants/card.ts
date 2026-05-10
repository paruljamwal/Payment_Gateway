import type { CardBrand } from "@/types/payment";

/**
 * User-facing guide per brand — aligned with `getCardType()` detection rules.
 * Use `label` for compact UI; use hints/tooltips where users need clarity.
 */
export type CardBrandGuide = {
  /** Short name for lists, receipts, and badges */
  label: string;
  /** One line under the card number field */
  inputHint: string;
  /** Hover tooltip on the PAN brand badge */
  badgeTooltip: string;
  /** Screen reader copy when a brand is detected (badge `aria-describedby`) */
  badgeAriaDescription: string;
};

export const CARD_BRAND_GUIDE: Record<CardBrand, CardBrandGuide> = {
  visa: {
    label: "Visa",
    inputHint:
      "Detected as Visa (numbers starting with 4). CVV is usually 3 digits on the back.",
    badgeTooltip:
      "Visa — typically 16 digits; security code is 3 digits on the back.",
    badgeAriaDescription:
      "Card detected as Visa. Visa numbers begin with 4. Enter the three-digit security code on the back.",
  },
  mastercard: {
    label: "Mastercard",
    inputHint:
      "Detected as Mastercard (numbers starting with 51–55). CVV is 3 digits on the back.",
    badgeTooltip:
      "Mastercard — 16 digits; security code is 3 digits on the back.",
    badgeAriaDescription:
      "Card detected as Mastercard. Mastercard numbers here start with 51 through 55. Enter the three-digit security code on the back.",
  },
  amex: {
    label: "American Express",
    inputHint:
      "Detected as American Express (starts with 34 or 37). CVV is 4 digits on the front.",
    badgeTooltip:
      "American Express — 15 digits; security code is 4 digits on the front.",
    badgeAriaDescription:
      "Card detected as American Express. Amex numbers start with 34 or 37. Enter the four-digit security code on the front of the card.",
  },
  unknown: {
    label: "Card",
    inputHint:
      "Tip: Visa starts with 4; Mastercard with 51–55; American Express with 34 or 37. CVV is 3 or 4 digits depending on the card.",
    badgeTooltip: "",
    badgeAriaDescription: "",
  },
};

/** Compact labels — derived from `CARD_BRAND_GUIDE` for consistent wording. */
export const CARD_TYPE_LABELS: Record<CardBrand, string> = {
  visa: CARD_BRAND_GUIDE.visa.label,
  mastercard: CARD_BRAND_GUIDE.mastercard.label,
  amex: CARD_BRAND_GUIDE.amex.label,
  unknown: CARD_BRAND_GUIDE.unknown.label,
};

export const CARD_PREVIEW_COPY = {
  placeholderName: "YOUR NAME",
  placeholderExpiry: "MM/YY",
  placeholderNumberPan: "#### #### #### ####",
  placeholderNumberAmex: "#### ###### #####",
} as const;

/** When brand is unknown — `aria-describedby` on PAN input (format tip lives in DOM). */
export const CARD_NUMBER_FORMAT_HINT_ID = "cardNumber-format-hint";

/** When brand is known — lives inside PAN badge (`CardTypeBadge`). */
export const CARD_NUMBER_BRAND_HINT_ID = "cardNumber-detected-brand";

export const CARD_PREVIEW_REGION_LABEL = "Live card preview";

export const CVV_FIELD_PLACEHOLDER = {
  amex: "4 digits",
  standard: "3 digits",
  unknown: "3 or 4 digits",
} as const;
