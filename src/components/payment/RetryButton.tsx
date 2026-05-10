"use client";

import { forwardRef } from "react";
import {
  PAYMENT_RETRY_BUTTON_LABEL,
  PAYMENT_RETRY_EXHAUSTED_HINT,
} from "@/constants/payment";
import { Button } from "@/components/ui/Button";

export type RetryButtonProps = {
  disabled: boolean;
  exhausted: boolean;
  onRetry: () => void | Promise<void>;
  describedById?: string;
};

const RetryButton = forwardRef<HTMLButtonElement, RetryButtonProps>(
  function RetryButton(
    { disabled, exhausted, onRetry, describedById },
    ref,
  ) {
    const label = PAYMENT_RETRY_BUTTON_LABEL;

    return (
      <Button
        ref={ref}
        variant="primary"
        disabled={disabled}
        aria-label={
          exhausted ? `${label}. ${PAYMENT_RETRY_EXHAUSTED_HINT}` : label
        }
        aria-describedby={describedById}
        className="!mt-0 min-h-11 w-full sm:w-auto sm:min-w-[140px]"
        onClick={() => {
          void onRetry();
        }}
      >
        {label}
      </Button>
    );
  },
);

export default RetryButton;
