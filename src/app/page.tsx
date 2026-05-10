import PaymentContainer from "@/components/payment/PaymentContainer";
import PaymentForm from "@/components/payment/PaymentForm";
import TransactionHistory from "@/components/transaction/TransactionHistory";
import {
  PAYMENT_PAGE_DEFAULT_DESCRIPTION,
  PAYMENT_PAGE_DEFAULT_TITLE,
  PAYMENT_PAGE_STACK_CLASS,
} from "@/constants/ui";

export default function Home() {
  return (
    <PaymentContainer
      title={PAYMENT_PAGE_DEFAULT_TITLE}
      description={PAYMENT_PAGE_DEFAULT_DESCRIPTION}
    >
      <div className={PAYMENT_PAGE_STACK_CLASS}>
        <PaymentForm />
        <TransactionHistory />
      </div>
    </PaymentContainer>
  );
}
