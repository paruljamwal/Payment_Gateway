import type { ReactNode } from "react";
import {
  PAYMENT_LAYOUT_FORM_COLUMN_CLASS,
  PAYMENT_LAYOUT_GRID_CLASS,
  PAYMENT_LAYOUT_PREVIEW_COLUMN_CLASS,
} from "@/constants/ui";

export type PaymentLayoutProps = {
  form: ReactNode;
  preview: ReactNode;
};

export default function PaymentLayout({ form, preview }: PaymentLayoutProps) {
  return (
    <div className={PAYMENT_LAYOUT_GRID_CLASS}>
      <div className={PAYMENT_LAYOUT_FORM_COLUMN_CLASS}>{form}</div>
      <div className={PAYMENT_LAYOUT_PREVIEW_COLUMN_CLASS}>{preview}</div>
    </div>
  );
}
