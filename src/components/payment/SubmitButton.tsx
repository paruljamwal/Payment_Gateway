"use client";

import {
  PAYMENT_PRIMARY_ACTION_LABEL,
} from "@/constants/ui";
import { Button } from "@/components/ui/Button";

export type SubmitButtonProps = {
  disabled: boolean;
  label?: string;
};

export default function SubmitButton({
  disabled,
  label = PAYMENT_PRIMARY_ACTION_LABEL,
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled} className="mt-2 w-full">
      {label}
    </Button>
  );
}
