import clsx from "clsx";
import { TRANSITION_OPACITY, TRANSITION_SHADOW } from "@/constants/styles";
import type { PaymentStatus } from "@/types/payment";

/** Page shell wrapping the payment flow. */
export const PAYMENT_PAGE_SHELL_CLASS =
  "flex flex-1 items-center justify-center overflow-x-hidden bg-zinc-50 px-4 py-10 font-sans sm:px-6 sm:py-12 lg:px-8 dark:bg-black";

/** Primary payment card panel (surface). */
export const PAYMENT_SURFACE_CLASS = clsx(
  "w-full max-w-6xl min-w-0 overflow-x-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-950",
);

export const PAYMENT_BODY_CONTENT_CLASS = "mt-2 min-w-0 md:mt-6";

/** Stacks payment flow above transaction history (Phase 8). */
export const PAYMENT_PAGE_STACK_CLASS =
  "flex min-w-0 flex-col gap-10 lg:gap-12";

export const TRANSACTION_HISTORY_SECTION_TITLE_CLASS =
  "text-lg font-semibold text-zinc-900 dark:text-zinc-50";

export const TRANSACTION_HISTORY_CARD_CLASS =
  "w-full rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:border-zinc-600 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950";

export const TRANSACTION_HISTORY_LIST_CLASS = "flex flex-col gap-3";

export const TRANSACTION_DETAIL_DIALOG_CLASS =
  "fixed left-1/2 top-1/2 z-[100] m-0 box-border min-w-0 w-[min(28rem,calc(100vw-2rem))] max-h-[min(90dvh,32rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-900 shadow-xl backdrop:bg-black/50 sm:p-6 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export const TRANSACTION_EMPTY_STATE_CLASS =
  "rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/80 px-6 py-12 text-center dark:border-zinc-600 dark:bg-zinc-900/40";

/** Badge surfaces keyed by `PaymentStatus` for history rows. */
export const TRANSACTION_STATUS_BADGE_CLASSES: Record<PaymentStatus, string> = {
  idle:
    "border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100",
  processing:
    "border-sky-200 bg-sky-100 text-sky-900 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100",
  success:
    "border-emerald-200 bg-emerald-100 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
  failed:
    "border-red-200 bg-red-100 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
  timeout:
    "border-amber-200 bg-amber-100 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-50",
};

export const PAYMENT_LAYOUT_GRID_CLASS =
  "grid min-w-0 grid-cols-1 gap-6 sm:gap-8 md:gap-10 lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-14";

/** Mobile: preview first; desktop: form left, preview right. */
export const PAYMENT_LAYOUT_FORM_COLUMN_CLASS = "order-2 lg:order-1 min-w-0";

export const PAYMENT_LAYOUT_PREVIEW_COLUMN_CLASS =
  "order-1 lg:order-2 flex justify-center lg:justify-end";

export const PAYMENT_TITLE_CLASS =
  "text-balance text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl dark:text-zinc-50";

export const PAYMENT_SUBTITLE_CLASS =
  "text-sm text-zinc-600 md:text-base dark:text-zinc-400";

export const PAYMENT_SECTION_STACK_CLASS = "mb-6 space-y-2 md:mb-8 md:space-y-3";

export const PAYMENT_FORM_STACK_CLASS = "flex min-w-0 flex-col gap-5 md:gap-6";

export const PAYMENT_PRIMARY_ACTION_LABEL = "Pay securely";

export const PAYMENT_PAGE_DEFAULT_TITLE = "Payment Gateway UI";

export const PAYMENT_PAGE_DEFAULT_DESCRIPTION =
  "Enter your card details to continue. All fields are validated as you type.";

/** Visible only to assistive tech — sits under the page `<h1>`. */
export const PAYMENT_DETAILS_SECTION_HEADING = "Payment details";

/** Shared label style for form fields (matches FormField). */
export const FORM_LABEL_CLASS =
  "text-sm font-medium text-zinc-800 dark:text-zinc-100";

/** Vertical rhythm inside a single field. */
export const FORM_FIELD_STACK_CLASS = "flex min-w-0 flex-col gap-1.5";

/** Default text-like control surface. */
export function formControlClasses(options?: { invalid?: boolean }): string {
  return clsx(
    "w-full min-w-0 max-w-full rounded-lg border bg-white px-3 py-2.5 text-base text-zinc-900 shadow-sm transition sm:text-sm",
    "border-zinc-300 placeholder:text-zinc-400",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
    "dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500",
    "dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
    "dark:disabled:bg-zinc-900",
    options?.invalid &&
      "!border-red-600 focus-visible:!ring-red-600 dark:!border-red-500 dark:focus-visible:!ring-red-500",
  );
}

export const FORM_ERROR_TEXT_CLASS =
  "text-sm text-red-600 dark:text-red-400";

export const FORM_GRID_TWO_COL_CLASS =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5";

/** Wrapper around compact brand badge beside PAN input. */
export const CARD_INLINE_BADGE_CONTAINER_CLASS =
  "flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 px-2 dark:border-zinc-700 dark:bg-zinc-900";

export const PAYMENT_OVERLAY_BACKDROP_CLASS = clsx(
  "absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-white/80 px-6 text-center backdrop-blur-sm dark:bg-zinc-950/80",
  TRANSITION_OPACITY,
);

export const PAYMENT_STATUS_SURFACE_CLASS = clsx(
  "flex w-full max-w-lg min-w-0 flex-col gap-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm sm:gap-6 sm:p-6 dark:border-zinc-700 dark:bg-zinc-900/40",
  TRANSITION_SHADOW,
);

export const PAYMENT_FIELDSET_RESET_CLASS =
  "min-w-0 border-0 p-0 [&:disabled]:opacity-[0.72]";

export const PAYMENT_FORM_STAGE_CLASS = "relative";
