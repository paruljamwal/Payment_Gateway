import type { CardBrand } from "@/types/payment";

/** PAN length bounds and caps used by formatters + validators. */
export const CARD_DIGITS_MIN_VISA = 13;
export const CARD_DIGITS_MAX_VISA = 19;
export const CARD_DIGITS_MASTERCARD = 16;
export const CARD_DIGITS_AMEX = 15;
export const CARD_DIGITS_MAX_UNKNOWN = 19;

export const CVV_LENGTH_STANDARD = 3;
export const CVV_LENGTH_AMEX = 4;
export const CVV_LENGTH_UNKNOWN_CAP = 4;

export const EXPIRY_INPUT_MAX_DIGITS = 4;

export const CARDHOLDER_NAME_MIN_LENGTH = 2;

export function getMaxCvvDigitsForBrand(brand: CardBrand): number {
  switch (brand) {
    case "amex":
      return CVV_LENGTH_AMEX;
    case "unknown":
      return CVV_LENGTH_UNKNOWN_CAP;
    default:
      return CVV_LENGTH_STANDARD;
  }
}
