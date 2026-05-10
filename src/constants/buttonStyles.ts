import clsx from "clsx";
import {
  TRANSITION_COLORS,
} from "@/constants/styles";

/** Primary filled action — matches legacy payment CTAs. */
export function primaryActionButtonClass(disabled: boolean): string {
  return clsx(
    "flex min-h-11 items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold",
    TRANSITION_COLORS,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
    "dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
    disabled
      ? "cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
      : "cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
  );
}

/** Bordered neutral action — dialogs, secondary dismiss (reads softer than primary on dark UI). */
export function outlineActionButtonClass(disabled: boolean): string {
  return clsx(
    "flex min-h-11 items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-semibold",
    TRANSITION_COLORS,
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
    "dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
    disabled
      ? "cursor-not-allowed border-zinc-200 text-zinc-400 dark:border-zinc-700 dark:text-zinc-600"
      : "cursor-pointer border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800",
  );
}

/** Text-style control for secondary navigation (e.g. “Show more”). */
export function ghostLinkButtonClass(): string {
  return clsx(
    "inline-flex cursor-pointer items-center justify-center rounded-md px-1 py-1 text-sm font-semibold text-zinc-900 underline-offset-4",
    TRANSITION_COLORS,
    "hover:underline",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
    "dark:text-zinc-50 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
  );
}
