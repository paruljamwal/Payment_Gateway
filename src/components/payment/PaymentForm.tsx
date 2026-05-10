"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { PaymentFormData, PaymentFormField } from "@/types/payment";
import { CARD_NUMBER_BRAND_HINT_ID, CVV_FIELD_PLACEHOLDER } from "@/constants/card";
import {
  FORM_GRID_TWO_COL_CLASS,
  PAYMENT_DETAILS_SECTION_HEADING,
  PAYMENT_FIELDSET_RESET_CLASS,
  PAYMENT_FORM_STAGE_CLASS,
  PAYMENT_FORM_STACK_CLASS,
} from "@/constants/ui";
import { getMaxCvvDigitsForBrand } from "@/constants/validation";
import CardPreview from "@/components/card/CardPreview";
import CardTypeBadge from "@/components/card/CardTypeBadge";
import CurrencySelect from "@/components/payment/CurrencySelect";
import FormField from "@/components/payment/FormField";
import PaymentLayout from "@/components/payment/PaymentLayout";
import PaymentStatusScreen from "@/components/payment/PaymentStatusScreen";
import ProcessingOverlay from "@/components/payment/ProcessingOverlay";
import SubmitButton from "@/components/payment/SubmitButton";
import { usePayment } from "@/hooks/payment/usePayment";
import { useRetry } from "@/hooks/payment/useRetry";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  resetPayment,
} from "@/store/slices/paymentSlice";
import {
  selectCanRetryPayment,
  selectCurrentTransaction,
  selectIsProcessing,
  selectMaxRetries,
  selectPaymentErrorMessage,
  selectPaymentStatus,
  selectRetryExhausted,
  selectShowTerminalPaymentUi,
  selectSubmissionAttempt,
} from "@/store/selectors/paymentSelectors";
import { getCardType } from "@/utils/card/cardType";
import { isTerminalPaymentStatus } from "@/utils/payment/statusGuards";
import {
  cardNumberCaretDigitIndexAfterEdit,
  countDigitsBeforeFormattedIndex,
  formatCardNumber,
  formattedCaretIndexAfterDigits,
  sanitizeCardNumber,
  sanitizeCvvInput,
  sanitizeExpiryInput,
} from "@/utils/formatters/cardFormatters";
import {
  isPaymentFormValid,
  validatePaymentForm,
} from "@/utils/validation/paymentValidation";

const INITIAL_FORM: PaymentFormData = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  amount: "",
  currency: "INR",
};

function createTouchedState(): Record<PaymentFormField, boolean> {
  return {
    cardholderName: false,
    cardNumber: false,
    expiry: false,
    cvv: false,
    amount: false,
    currency: false,
  };
}

export default function PaymentForm() {
  const dispatch = useAppDispatch();
  const paymentStatus = useAppSelector(selectPaymentStatus);
  const isProcessing = useAppSelector(selectIsProcessing);
  const showTerminalUi = useAppSelector(selectShowTerminalPaymentUi);
  const currentTransaction = useAppSelector(selectCurrentTransaction);
  const paymentErrorMessage = useAppSelector(selectPaymentErrorMessage);
  const submissionAttempt = useAppSelector(selectSubmissionAttempt);
  const maxRetries = useAppSelector(selectMaxRetries);
  const canRetry = useAppSelector(selectCanRetryPayment);
  const retryExhausted = useAppSelector(selectRetryExhausted);

  const [values, setValues] = useState<PaymentFormData>(INITIAL_FORM);
  const [touched, setTouched] = useState<Record<PaymentFormField, boolean>>(
    createTouchedState,
  );

  const cardInputRef = useRef<HTMLInputElement>(null);
  const cardCaretDigitsRef = useRef<number | null>(null);
  const expiryInputRef = useRef<HTMLInputElement>(null);
  const expiryCaretDigitsRef = useRef<number | null>(null);

  const { submitNewPayment, retryPayment } = usePayment(values);
  const { handleRetry } = useRetry(canRetry, isProcessing, retryPayment);

  const errors = useMemo(() => validatePaymentForm(values), [values]);
  const formValid = isPaymentFormValid(errors);

  const detectedBrand = useMemo(
    () => getCardType(values.cardNumber),
    [values.cardNumber],
  );

  useLayoutEffect(() => {
    if (cardCaretDigitsRef.current === null) {
      return;
    }
    const element = cardInputRef.current;
    if (!element) {
      return;
    }
    const formatted = formatCardNumber(values.cardNumber);
    const position = formattedCaretIndexAfterDigits(
      formatted,
      cardCaretDigitsRef.current,
    );
    element.setSelectionRange(position, position);
    cardCaretDigitsRef.current = null;
  }, [values.cardNumber]);

  useLayoutEffect(() => {
    if (expiryCaretDigitsRef.current === null) {
      return;
    }
    const element = expiryInputRef.current;
    if (!element) {
      return;
    }
    const formatted = values.expiry;
    const position = formattedCaretIndexAfterDigits(
      formatted,
      expiryCaretDigitsRef.current,
    );
    element.setSelectionRange(position, position);
    expiryCaretDigitsRef.current = null;
  }, [values.expiry]);

  const markTouched = useCallback((field: PaymentFormField) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  }, []);

  const handleChange = useCallback(
    (field: PaymentFormField, next: string) => {
      setValues((previous) => ({ ...previous, [field]: next }));
    },
    [],
  );

  const handleCurrencyChange = useCallback((nextCurrency: PaymentFormData["currency"]) => {
    setValues((previous) => ({ ...previous, currency: nextCurrency }));
  }, []);

  const handleCardNumberChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      const sanitized = sanitizeCardNumber(input.value);
      const caret =
        input.selectionStart ?? input.selectionEnd ?? 0;

      cardCaretDigitsRef.current = cardNumberCaretDigitIndexAfterEdit({
        prevDigits: values.cardNumber,
        nextDigits: sanitized,
        inputValue: input.value,
        selectionStart: caret,
      });

      const brand = getCardType(sanitized);
      const maxCvvLength = getMaxCvvDigitsForBrand(brand);
      setValues((previous) => {
        const cvv =
          previous.cvv.length > maxCvvLength
            ? previous.cvv.slice(0, maxCvvLength)
            : previous.cvv;
        return { ...previous, cardNumber: sanitized, cvv };
      });
    },
    [values.cardNumber],
  );

  const handleExpiryChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      const caret = input.selectionStart ?? 0;
      const digitCaret = countDigitsBeforeFormattedIndex(values.expiry, caret);
      const next = sanitizeExpiryInput(input.value);
      const nextDigits = next.replace(/\D/g, "");
      expiryCaretDigitsRef.current = Math.min(digitCaret, nextDigits.length);
      handleChange("expiry", next);
    },
    [handleChange, values.expiry],
  );

  const handleCvvChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const brand = getCardType(values.cardNumber);
      const next = sanitizeCvvInput(event.target.value, brand);
      handleChange("cvv", next);
    },
    [handleChange, values.cardNumber],
  );

  const visibleError = useCallback(
    (field: PaymentFormField): string | undefined => {
      return touched[field] ? errors[field] : undefined;
    },
    [errors, touched],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!formValid || isProcessing) {
        return;
      }
      void submitNewPayment();
    },
    [formValid, isProcessing, submitNewPayment],
  );

  const handleNewPayment = useCallback(() => {
    dispatch(resetPayment());
  }, [dispatch]);

  const cvvPlaceholder =
    detectedBrand === "amex"
      ? CVV_FIELD_PLACEHOLDER.amex
      : detectedBrand === "visa" || detectedBrand === "mastercard"
        ? CVV_FIELD_PLACEHOLDER.standard
        : CVV_FIELD_PLACEHOLDER.unknown;

  const cardAccessoryId =
    detectedBrand === "unknown" ? undefined : CARD_NUMBER_BRAND_HINT_ID;

  const preview = (
    <CardPreview
      brand={detectedBrand}
      cardholderName={values.cardholderName}
      cardNumberDigits={values.cardNumber}
      expiryDisplay={values.expiry}
    />
  );

  const formDisabled = isProcessing && !showTerminalUi;

  const interactiveForm = (
    <div className={PAYMENT_FORM_STAGE_CLASS}>
      <ProcessingOverlay open={isProcessing && !showTerminalUi} />
      <fieldset disabled={formDisabled} className={PAYMENT_FIELDSET_RESET_CLASS}>
        <form
          onSubmit={handleSubmit}
          className={PAYMENT_FORM_STACK_CLASS}
          aria-labelledby="payment-details-heading"
          noValidate
        >
          <h2 id="payment-details-heading" className="sr-only">
            {PAYMENT_DETAILS_SECTION_HEADING}
          </h2>
          <FormField
            id="cardholderName"
            label="Cardholder name"
            error={visibleError("cardholderName")}
          >
            <input
              type="text"
              name="cardholderName"
              autoComplete="cc-name"
              value={values.cardholderName}
              onChange={(event) =>
                handleChange("cardholderName", event.target.value)}
              onBlur={() => markTouched("cardholderName")}
              placeholder="Name on card"
            />
          </FormField>

          <FormField
            id="cardNumber"
            label="Card number"
            error={visibleError("cardNumber")}
            accessoryDescribedById={cardAccessoryId}
            trailing={
              detectedBrand === "unknown" ? undefined : (
                <CardTypeBadge
                  brand={detectedBrand}
                  descriptionId={CARD_NUMBER_BRAND_HINT_ID}
                />
              )
            }
          >
            <input
              ref={cardInputRef}
              type="text"
              name="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              value={formatCardNumber(values.cardNumber)}
              onChange={handleCardNumberChange}
              onBlur={() => markTouched("cardNumber")}
              placeholder="4242 4242 4242 4242"
            />
          </FormField>

          <div className={FORM_GRID_TWO_COL_CLASS}>
            <FormField id="expiry" label="Expiry (MM/YY)" error={visibleError("expiry")}>
              <input
                ref={expiryInputRef}
                type="text"
                name="expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={values.expiry}
                onChange={handleExpiryChange}
                onBlur={() => markTouched("expiry")}
                placeholder="MM/YY"
              />
            </FormField>

            <FormField id="cvv" label="CVV" error={visibleError("cvv")}>
              <input
                type="password"
                name="cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={values.cvv}
                onChange={handleCvvChange}
                onBlur={() => markTouched("cvv")}
                placeholder={cvvPlaceholder}
              />
            </FormField>
          </div>

          <FormField id="amount" label="Amount" error={visibleError("amount")}>
            <input
              type="text"
              name="amount"
              inputMode="decimal"
              value={values.amount}
              onChange={(event) => handleChange("amount", event.target.value)}
              onBlur={() => markTouched("amount")}
              placeholder="0.00"
            />
          </FormField>

          <CurrencySelect
            id="currency"
            label="Currency"
            value={values.currency}
            onChange={handleCurrencyChange}
            onBlur={() => markTouched("currency")}
            error={visibleError("currency")}
          />

          <SubmitButton disabled={!formValid || isProcessing} />
        </form>
      </fieldset>
    </div>
  );

  const terminalOverlayDetail =
    showTerminalUi && submissionAttempt > 1
      ? `Attempt ${submissionAttempt} of ${maxRetries}`
      : undefined;

  const terminalPanel =
    showTerminalUi && isTerminalPaymentStatus(paymentStatus) ? (
      <div className={PAYMENT_FORM_STAGE_CLASS}>
        <ProcessingOverlay
          open={isProcessing && showTerminalUi}
          detail={terminalOverlayDetail}
        />
        <PaymentStatusScreen
          status={paymentStatus}
          transaction={currentTransaction}
          errorMessage={paymentErrorMessage}
          submissionAttempt={submissionAttempt}
          maxRetries={maxRetries}
          canRetry={canRetry}
          retryExhausted={retryExhausted}
          isGatewayBusy={isProcessing}
          onNewPayment={handleNewPayment}
          onRetry={handleRetry}
        />
      </div>
    ) : (
      interactiveForm
    );

  return <PaymentLayout preview={preview} form={terminalPanel} />;
}
