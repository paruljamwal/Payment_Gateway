import type { CardBrand } from "@/types/payment";

export function getCardType(digits: string): CardBrand {
  if (!digits) {
    return "unknown";
  }

  if (digits[0] === "4") {
    return "visa";
  }

  if (/^5[1-5]/.test(digits)) {
    return "mastercard";
  }

  if (/^3[47]/.test(digits)) {
    return "amex";
  }

  return "unknown";
}
