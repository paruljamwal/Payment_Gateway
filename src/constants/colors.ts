/**
 * Central palette references for payment UI (Tailwind-compatible classes).
 * Keeps brand hex values in one place for previews and inline badges.
 */

export const CARD_PREVIEW_GRADIENT_CLASS = {
  visa: "bg-gradient-to-br from-[#1A237E] via-[#3949AB] to-[#0D1642]",
  mastercard:
    "bg-gradient-to-br from-[#2d2d2d] via-[#1f1f1f] to-[#0a0a0a]",
  amex: "bg-gradient-to-br from-[#006FCF] via-[#2F90DA] to-[#004F94]",
  unknown:
    "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950",
} as const;

/** Inline field badge (compact) backgrounds — tokens referenced by CardTypeBadge. */
export const CARD_INLINE_BADGE_CLASS = {
  visa: "rounded-md bg-[#1A1F71] px-2 py-1 text-[10px] font-bold tracking-wide text-white",
  mastercard:
    "flex items-center gap-0.5 rounded-md bg-zinc-900 px-2 py-1 dark:bg-zinc-100",
  amex: "rounded-md bg-[#006FCF] px-2 py-1 text-[10px] font-semibold tracking-wide text-white",
} as const;

export const MASTERCARD_MARK_CLASS = {
  left: "h-2.5 w-2.5 rounded-full bg-[#EB001B]",
  right: "h-2.5 w-2.5 rounded-full bg-[#F79E1B]",
} as const;

/** Larger Mastercard circles for card preview badge. */
export const MASTERCARD_PREVIEW_MARK_CLASS = {
  left: "h-8 w-8 rounded-full bg-[#EB001B] opacity-95 shadow-sm",
  right: "-ml-4 h-8 w-8 rounded-full bg-[#F79E1B] opacity-95 shadow-sm",
} as const;

/** Preview chip metallic accent (Tailwind arbitrary gradient). */
export const CARD_CHIP_FACE_CLASS =
  "bg-gradient-to-br from-[#FFD778] via-[#E7B145] to-[#C8952E]";
