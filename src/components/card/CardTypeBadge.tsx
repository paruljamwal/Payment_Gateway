import {
  CARD_INLINE_BADGE_CLASS,
  MASTERCARD_MARK_CLASS,
} from "@/constants/colors";
import { CARD_BRAND_GUIDE } from "@/constants/card";
import {
  CARD_INLINE_BADGE_CONTAINER_CLASS,
  CARD_INLINE_BADGE_EMBEDDED_CLASS,
} from "@/constants/ui";
import type { CardBrand } from "@/types/payment";

export type CardTypeBadgeProps = {
  brand: CardBrand;
  /** Referenced by the card input's `aria-describedby` for screen readers. */
  descriptionId: string;
  /** Use inside FormField input group (no extra border). */
  variant?: "standalone" | "embedded";
};

export default function CardTypeBadge({
  brand,
  descriptionId,
  variant = "standalone",
}: CardTypeBadgeProps) {
  if (brand === "unknown") {
    return null;
  }

  const guide = CARD_BRAND_GUIDE[brand];

  const badgeVisual = (() => {
    switch (brand) {
      case "visa":
        return (
          <span className={CARD_INLINE_BADGE_CLASS.visa} aria-hidden>
            VISA
          </span>
        );
      case "mastercard":
        return (
          <span className={CARD_INLINE_BADGE_CLASS.mastercard} aria-hidden>
            <span className={MASTERCARD_MARK_CLASS.left} aria-hidden />
            <span className={MASTERCARD_MARK_CLASS.right} aria-hidden />
          </span>
        );
      case "amex":
        return (
          <span className={CARD_INLINE_BADGE_CLASS.amex} aria-hidden>
            AMEX
          </span>
        );
      default:
        return null;
    }
  })();

  const wrapClass =
    variant === "embedded"
      ? CARD_INLINE_BADGE_EMBEDDED_CLASS
      : CARD_INLINE_BADGE_CONTAINER_CLASS;

  return (
    <div className={wrapClass} title={guide.badgeTooltip || undefined}>
      <span id={descriptionId} className="sr-only">
        {guide.badgeAriaDescription}
      </span>
      <span aria-hidden>{badgeVisual}</span>
    </div>
  );
}
