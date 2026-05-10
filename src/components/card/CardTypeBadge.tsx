import {
  CARD_INLINE_BADGE_CLASS,
  MASTERCARD_MARK_CLASS,
} from "@/constants/colors";
import { CARD_TYPE_LABELS } from "@/constants/card";
import { CARD_INLINE_BADGE_CONTAINER_CLASS } from "@/constants/ui";
import type { CardBrand } from "@/types/payment";

export type CardTypeBadgeProps = {
  brand: CardBrand;
  /** Referenced by the card input's `aria-describedby` for screen readers. */
  descriptionId: string;
};

export default function CardTypeBadge({
  brand,
  descriptionId,
}: CardTypeBadgeProps) {
  if (brand === "unknown") {
    return null;
  }

  const title = CARD_TYPE_LABELS[brand];

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

  return (
    <div className={CARD_INLINE_BADGE_CONTAINER_CLASS}>
      <span id={descriptionId} className="sr-only">
        {`Detected card: ${title}`}
      </span>
      <span aria-hidden>{badgeVisual}</span>
    </div>
  );
}
