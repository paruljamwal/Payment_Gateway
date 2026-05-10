import type { CardBrand } from "@/types/payment";
import {
  CARD_DIGITS_AMEX,
  CARD_DIGITS_MAX_UNKNOWN,
  CARD_DIGITS_MAX_VISA,
  CARD_DIGITS_MASTERCARD,
  EXPIRY_INPUT_MAX_DIGITS,
  getMaxCvvDigitsForBrand,
} from "@/constants/validation";
import { getCardType } from "@/utils/card/cardType";

export function getMaxDigitsForBrand(brand: CardBrand): number {
  switch (brand) {
    case "amex":
      return CARD_DIGITS_AMEX;
    case "mastercard":
      return CARD_DIGITS_MASTERCARD;
    case "visa":
      return CARD_DIGITS_MAX_VISA;
    default:
      return CARD_DIGITS_MAX_UNKNOWN;
  }
}

export function sanitizeCardNumber(rawInput: string): string {
  const digitsOnly = rawInput.replace(/\D/g, "");
  const brand = getCardType(digitsOnly);
  const max = getMaxDigitsForBrand(brand);
  return digitsOnly.slice(0, max);
}

export function formatCardNumber(digits: string): string {
  const brand = getCardType(digits);
  if (brand === "amex") {
    const chunks: string[] = [];
    if (digits.length > 0) {
      chunks.push(digits.slice(0, Math.min(4, digits.length)));
    }
    if (digits.length > 4) {
      chunks.push(digits.slice(4, Math.min(10, digits.length)));
    }
    if (digits.length > 10) {
      chunks.push(digits.slice(10, Math.min(CARD_DIGITS_AMEX, digits.length)));
    }
    return chunks.join(" ");
  }

  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trimEnd();
}

export function countDigitsBeforeFormattedIndex(
  formatted: string,
  caretIndex: number,
): number {
  const end = Math.max(0, Math.min(caretIndex, formatted.length));
  let count = 0;
  for (let i = 0; i < end; i++) {
    const char = formatted[i];
    if (char && /\d/.test(char)) {
      count++;
    }
  }
  return count;
}

export function formattedCaretIndexAfterDigits(
  formatted: string,
  digitIndex: number,
): number {
  if (digitIndex <= 0) {
    return 0;
  }

  let seen = 0;
  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i];
    if (char && /\d/.test(char)) {
      seen++;
      if (seen === digitIndex) {
        return i + 1;
      }
    }
  }

  return formatted.length;
}

/**
 * Digit-index of the caret after an edit, for sanitised PAN storage + spaced display.
 * Handles browsers that report `selectionStart` inconsistently on controlled inputs.
 */
export function cardNumberCaretDigitIndexAfterEdit(options: {
  prevDigits: string;
  nextDigits: string;
  inputValue: string;
  selectionStart: number;
}): number {
  const { prevDigits, nextDigits, inputValue, selectionStart } = options;

  if (nextDigits.length === 0) {
    return 0;
  }

  const caret = Math.max(0, selectionStart);
  let digitsBeforeCaret = countDigitsBeforeFormattedIndex(inputValue, caret);

  const appendedSuffixOnly =
    prevDigits.length > 0 &&
    nextDigits.length > prevDigits.length &&
    nextDigits.startsWith(prevDigits);

  if (appendedSuffixOnly) {
    const prevFormatted = formatCardNumber(prevDigits);
    const wasCaretAtVisualEnd =
      caret >= prevFormatted.length ||
      digitsBeforeCaret >= prevDigits.length;

    if (wasCaretAtVisualEnd) {
      return nextDigits.length;
    }

    digitsBeforeCaret += nextDigits.length - prevDigits.length;
  }

  return Math.min(Math.max(digitsBeforeCaret, 0), nextDigits.length);
}

export function sanitizeExpiryDigits(rawDigits: string): string {
  let digits = rawDigits.replace(/\D/g, "").slice(0, EXPIRY_INPUT_MAX_DIGITS);

  if (digits.length >= 1 && digits[0] !== "0" && digits[0] !== "1") {
    digits = digits.slice(1);
    return sanitizeExpiryDigits(digits);
  }

  if (digits.length >= 2) {
    const month = Number(`${digits[0]}${digits[1]}`);
    if (month === 0 || month > 12) {
      digits = digits.slice(0, 1);
    }
  }

  return digits;
}

export function formatExpiryDisplay(digits: string): string {
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function sanitizeExpiryInput(rawValue: string): string {
  const digits = sanitizeExpiryDigits(rawValue.replace(/\D/g, ""));
  return formatExpiryDisplay(digits);
}

export function sanitizeCvvInput(raw: string, brand: CardBrand): string {
  const maxLength = getMaxCvvDigitsForBrand(brand);
  return raw.replace(/\D/g, "").slice(0, maxLength);
}
