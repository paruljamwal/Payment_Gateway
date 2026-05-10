import clsx from "clsx";
import CardBrandBadge from "@/components/card/CardBrandBadge";
import CardChip from "@/components/card/CardChip";
import { CARD_PREVIEW_GRADIENT_CLASS } from "@/constants/colors";
import { CARD_PREVIEW_REGION_LABEL } from "@/constants/card";
import type { CardPreviewProps } from "@/types/payment";
import {
  getPreviewCardNumberDisplay,
  getPreviewCardholderDisplay,
  getPreviewExpiryDisplay,
} from "@/utils/cardPreview";

function gradientForBrand(brand: CardPreviewProps["brand"]): string {
  return CARD_PREVIEW_GRADIENT_CLASS[brand];
}

export default function CardPreview({
  brand,
  cardholderName,
  cardNumberDigits,
  expiryDisplay,
}: CardPreviewProps) {
  const numberLine = getPreviewCardNumberDisplay(cardNumberDigits, brand);
  const nameLine = getPreviewCardholderDisplay(cardholderName);
  const expiryLine = getPreviewExpiryDisplay(expiryDisplay);
  const mutedNumber = !cardNumberDigits.trim();
  const mutedName = !cardholderName.trim();
  const mutedExpiry = !expiryDisplay.trim();

  return (
    <aside
      aria-label={CARD_PREVIEW_REGION_LABEL}
      className="w-full max-w-[420px] lg:max-w-none lg:w-full xl:max-w-[440px]"
    >
      <div
        className={clsx(
          "relative isolate overflow-hidden rounded-2xl p-6 text-white shadow-xl ring-1 ring-black/10 sm:p-7 md:p-8",
          "aspect-[85.6/53.98] w-full",
          gradientForBrand(brand),
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />

        <div className="relative flex h-full flex-col justify-between gap-6">
          <div className="flex items-start justify-between gap-3">
            <CardChip />
            <CardBrandBadge brand={brand} />
          </div>

          <p
            className={clsx(
              "font-mono text-lg tracking-[0.08em] sm:text-xl md:text-2xl",
              mutedNumber ? "text-white/55" : "text-white",
            )}
          >
            {numberLine}
          </p>

          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                Cardholder
              </p>
              <p
                className={clsx(
                  "truncate text-sm font-medium uppercase tracking-wide sm:text-base",
                  mutedName ? "text-white/55" : "text-white",
                )}
              >
                {nameLine}
              </p>
            </div>
            <div className="shrink-0 space-y-1 text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/70">
                Expires
              </p>
              <p
                className={clsx(
                  "font-mono text-sm font-medium sm:text-base",
                  mutedExpiry ? "text-white/55" : "text-white",
                )}
              >
                {expiryLine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
