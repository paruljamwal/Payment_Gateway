import { CARD_CHIP_FACE_CLASS } from "@/constants/colors";

/** Decorative EMV chip for the card preview (purely visual). */
export default function CardChip() {
  return (
    <div
      className="relative h-10 w-12 shrink-0 rounded-md shadow-inner ring-1 ring-black/10 dark:ring-white/10"
      aria-hidden
    >
      <div
        className={`absolute inset-1 rounded-sm shadow-sm ${CARD_CHIP_FACE_CLASS}`}
      />
      <div className="absolute inset-x-2 top-2 h-px bg-black/15 dark:bg-white/20" />
    </div>
  );
}
