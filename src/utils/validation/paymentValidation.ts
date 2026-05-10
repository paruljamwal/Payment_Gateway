import { CARDHOLDER_NAME_MIN_LENGTH } from "@/constants/validation";
import { currencies, type CurrencyType, type PaymentFormData, type ValidationErrors } from "@/types/payment";
import {
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  validationMessage,
} from "@/utils/validators/cardValidators";

function isCurrencyType(value: string): value is CurrencyType {
  return (currencies as readonly string[]).includes(value);
}

export function validateCardholderName(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Cardholder name is required.";
  }
  if (trimmed.length < CARDHOLDER_NAME_MIN_LENGTH) {
    return `Enter at least ${CARDHOLDER_NAME_MIN_LENGTH} characters.`;
  }
  return undefined;
}

export function validateAmount(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Amount is required.";
  }
  const num = Number(trimmed);
  if (Number.isNaN(num)) {
    return "Enter a valid number.";
  }
  if (num <= 0) {
    return "Amount must be greater than 0.";
  }
  return undefined;
}

export function validateCurrency(value: string): string | undefined {
  if (!isCurrencyType(value)) {
    return "Select a currency.";
  }
  return undefined;
}

export function validatePaymentForm(data: PaymentFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError = validateCardholderName(data.cardholderName);
  if (nameError) errors.cardholderName = nameError;

  const cardError = validationMessage(validateCardNumber(data.cardNumber));
  if (cardError) errors.cardNumber = cardError;

  const expiryError = validationMessage(validateExpiryDate(data.expiry));
  if (expiryError) errors.expiry = expiryError;

  const cvvError = validationMessage(validateCVV(data.cvv, data.cardNumber));
  if (cvvError) errors.cvv = cvvError;

  const amountError = validateAmount(data.amount);
  if (amountError) errors.amount = amountError;

  const currencyError = validateCurrency(data.currency);
  if (currencyError) errors.currency = currencyError;

  return errors;
}

export function isPaymentFormValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
