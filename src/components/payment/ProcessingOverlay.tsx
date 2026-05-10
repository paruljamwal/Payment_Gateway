"use client";

import {
  PAYMENT_PROCESSING_ANNOUNCEMENT,
  PAYMENT_PROCESSING_VISIBLE_TITLE,
} from "@/constants/payment";
import { PAYMENT_OVERLAY_BACKDROP_CLASS } from "@/constants/ui";
import Spinner from "@/components/ui/Spinner";

export type ProcessingOverlayProps = {
  open: boolean;
  /** Optional line shown under the title (e.g. retry attempt summary). */
  detail?: string;
};

export default function ProcessingOverlay({
  open,
  detail,
}: ProcessingOverlayProps) {
  if (!open) {
    return null;
  }

  const liveMessage =
    detail === undefined || detail === ""
      ? PAYMENT_PROCESSING_ANNOUNCEMENT
      : `${PAYMENT_PROCESSING_ANNOUNCEMENT} ${detail}`;

  return (
    <div className={PAYMENT_OVERLAY_BACKDROP_CLASS} aria-busy="true">
      <span className="sr-only" role="status" aria-live="polite" aria-atomic>
        {liveMessage}
      </span>
      <Spinner />
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
        {PAYMENT_PROCESSING_VISIBLE_TITLE}
      </p>
      {detail ? (
        <p className="max-w-xs text-xs leading-snug text-zinc-600 dark:text-zinc-400">
          {detail}
        </p>
      ) : null}
    </div>
  );
}
