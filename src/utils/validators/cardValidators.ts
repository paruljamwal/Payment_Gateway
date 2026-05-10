import type { CardBrand, ValidationResult } from "@/types/payment";
import {
  CARD_DIGITS_AMEX,
  CARD_DIGITS_MAX_VISA,
  CARD_DIGITS_MIN_VISA,
  CARD_DIGITS_MASTERCARD,
  CVV_LENGTH_AMEX,
  CVV_LENGTH_STANDARD,
} from "@/constants/validation";
import { getCardType } from "@/utils/card/cardType";
import { sanitizeCardNumber } from "@/utils/formatters/cardFormatters";

function invalid(message: string): ValidationResult {
  return { valid: false, message };
}

function valid(): ValidationResult {
  return { valid: true };
}

export function validateCardNumber(cardDigits: string): ValidationResult {
  const digits = sanitizeCardNumber(cardDigits);

  if (!digits) {
    return invalid("Card number is required.");
  }

  const brand = getCardType(digits);

  if (brand === "visa") {
    if (
      digits.length < CARD_DIGITS_MIN_VISA ||
      digits.length > CARD_DIGITS_MAX_VISA
    ) {
      return invalid(
        `Visa numbers use ${CARD_DIGITS_MIN_VISA}–${CARD_DIGITS_MAX_VISA} digits.`,
      );
    }
    return valid();
  }

  if (brand === "mastercard") {
    if (digits.length !== CARD_DIGITS_MASTERCARD) {
      return invalid(
        `Mastercard numbers use ${CARD_DIGITS_MASTERCARD} digits.`,
      );
    }
    return valid();
  }

  if (brand === "amex") {
    if (digits.length !== CARD_DIGITS_AMEX) {
      return invalid(
        `American Express numbers use ${CARD_DIGITS_AMEX} digits.`,
      );
    }
    return valid();
  }

  if (digits.length >= CARD_DIGITS_MIN_VISA) {
    return invalid("Unsupported card type.");
  }

  return invalid("Keep typing — card number is incomplete.");
}

export function validateExpiryDate(
  expiryFormatted: string,
  referenceDate = new Date(),
): ValidationResult {
  const trimmed = expiryFormatted.trim();
  if (!trimmed) {
    return invalid("Expiry date is required.");
  }

  const match = /^(\d{2})\/(\d{2})$/.exec(trimmed);
  if (!match) {
    return invalid("Use MM/YY format.");
  }

  const month = Number(match[1]);
  const twoDigitYear = Number(match[2]);

  if (month < 1 || month > 12) {
    return invalid("Enter a month between 01 and 12.");
  }

  const expiryYear = 2000 + twoDigitYear;
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1;

  if (
    expiryYear < currentYear ||
    (expiryYear === currentYear && month < currentMonth)
  ) {
    return invalid("Card has expired.");
  }

  return valid();
}

export function validateCVV(cvv: string, cardDigits: string): ValidationResult {
  const trimmed = cvv.trim();
  if (!trimmed) {
    return invalid("CVV is required.");
  }

  if (!/^\d+$/.test(trimmed)) {
    return invalid("CVV must contain digits only.");
  }

  const cardResult = validateCardNumber(cardDigits);
  if (!cardResult.valid) {
    return invalid("Fix your card number before entering the CVV.");
  }

  const digits = sanitizeCardNumber(cardDigits);
  const brand: CardBrand = getCardType(digits);

  if (brand === "amex") {
    return trimmed.length === CVV_LENGTH_AMEX
      ? valid()
      : invalid("American Express requires a 4-digit CVV.");
  }

  return trimmed.length === CVV_LENGTH_STANDARD
    ? valid()
    : invalid("CVV must be 3 digits for this card.");
}

export function validationMessage(result: ValidationResult): string | undefined {
  return result.valid ? undefined : result.message;
}
