import { MASTERCARD_PREVIEW_MARK_CLASS } from "@/constants/colors";
import { CARD_TYPE_LABELS } from "@/constants/card";
import type { CardBrand } from "@/types/payment";

export type CardBrandBadgeProps = {
  brand: CardBrand;
};

function previewBadgeLabel(brand: CardBrand): string {
  if (brand === "unknown") {
    return CARD_TYPE_LABELS.unknown;
  }
  return CARD_TYPE_LABELS[brand];
}

export default function CardBrandBadge({ brand }: CardBrandBadgeProps) {
  const label = previewBadgeLabel(brand);

  if (brand === "visa") {
    return (
      <span
        className="rounded-lg bg-white/15 px-3 py-1 text-xs font-bold tracking-[0.2em] text-white shadow-sm"
        aria-hidden
      >
        VISA
      </span>
    );
  }

  if (brand === "mastercard") {
    return (
      <span className="flex items-center gap-1" aria-hidden>
        <span className={MASTERCARD_PREVIEW_MARK_CLASS.left} />
        <span className={MASTERCARD_PREVIEW_MARK_CLASS.right} />
        <span className="sr-only">{label}</span>
      </span>
    );
  }

  if (brand === "amex") {
    return (
      <span
        className="rounded-md border border-white/40 bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm"
        aria-hidden
      >
        AMEX
      </span>
    );
  }

  return (
    <span
      className="rounded-lg bg-white/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/90 ring-1 ring-white/25 backdrop-blur-sm"
      aria-hidden
    >
      {label}
    </span>
  );
}
