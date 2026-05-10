"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { useTransactionPersistence } from "@/hooks/transaction/useTransactionPersistence";
import { store } from "@/store/store";

type ProvidersProps = {
  children: ReactNode;
};

function PaymentPersistenceLayer({ children }: { children: ReactNode }) {
  useTransactionPersistence();
  return children;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PaymentPersistenceLayer>{children}</PaymentPersistenceLayer>
    </Provider>
  );
}

