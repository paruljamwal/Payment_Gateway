import type { ReactNode } from "react";
import {
  PAYMENT_BODY_CONTENT_CLASS,
  PAYMENT_PAGE_SHELL_CLASS,
  PAYMENT_SECTION_STACK_CLASS,
  PAYMENT_SUBTITLE_CLASS,
  PAYMENT_SURFACE_CLASS,
  PAYMENT_TITLE_CLASS,
} from "@/constants/ui";

export type PaymentContainerProps = {
  titleId?: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function PaymentContainer({
  titleId = "payment-heading",
  title,
  description,
  children,
}: PaymentContainerProps) {
  return (
    <main className={PAYMENT_PAGE_SHELL_CLASS}>
      <section
        className={PAYMENT_SURFACE_CLASS}
        aria-labelledby={titleId}
      >
        <header className={PAYMENT_SECTION_STACK_CLASS}>
          <h1 id={titleId} className={PAYMENT_TITLE_CLASS}>
            {title}
          </h1>
          <p className={PAYMENT_SUBTITLE_CLASS}>{description}</p>
        </header>
        <div className={PAYMENT_BODY_CONTENT_CLASS}>{children}</div>
      </section>
    </main>
  );
}
