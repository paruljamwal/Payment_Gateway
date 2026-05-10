import type { TerminalPaymentStatus } from "@/types/payment";

/** Large icon tile beside terminal payment headings (success / failed / timeout). */
export const TERMINAL_PAYMENT_ICON_PRESENTATION: Record<
  TerminalPaymentStatus,
  { bubbleClass: string; glyph: string }
> = {
  success: {
    bubbleClass:
      "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
    glyph: "✓",
  },
  failed: {
    bubbleClass:
      "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
    glyph: "!",
  },
  timeout: {
    bubbleClass:
      "border-amber-200 bg-amber-100 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-50",
    glyph: "⏱",
  },
};

export const TERMINAL_PAYMENT_ALERT_TEXT_CLASS: Record<
  Exclude<TerminalPaymentStatus, "success">,
  string
> = {
  failed: "text-red-700 dark:text-red-300",
  timeout: "text-amber-800 dark:text-amber-200",
};
