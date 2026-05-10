"use client";

import type { ReactNode } from "react";
import "sonner/dist/styles.css";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
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
      <PaymentPersistenceLayer>
        {children}
        <Toaster
          position="bottom-center"
          richColors
          closeButton
          theme="system"
          toastOptions={{
            classNames: {
              toast:
                "font-sans border bg-white text-zinc-900 shadow-lg dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50",
              description: "text-zinc-600 dark:text-zinc-400",
              closeButton:
                "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800",
            },
          }}
        />
      </PaymentPersistenceLayer>
    </Provider>
  );
}

