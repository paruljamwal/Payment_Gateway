"use client";

import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import IconClose from "@/components/ui/IconClose";
import { useTransactionPersistence } from "@/hooks/transaction/useTransactionPersistence";
import { store } from "@/store/store";

function noopSubscribe(): () => void {
  return () => {};
}

/** Avoid SSR markup for Sonner (theme="system" hydration mismatch); no setState in effects. */
function useClientMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function ClientToaster() {
  const mounted = useClientMounted();

  if (!mounted) {
    return null;
  }

  return (
    <Toaster
      position="bottom-center"
      richColors
      closeButton
      theme="system"
      icons={{
        close: (
          <IconClose className="pointer-events-none block size-[18px] shrink-0" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "font-sans border bg-white text-zinc-900 shadow-lg dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50",
          description: "text-zinc-600 dark:text-zinc-400",
          closeButton:
            "inline-flex size-9 shrink-0 items-center justify-center rounded-md border p-0 leading-none border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 [&_svg]:m-0",
        },
      }}
    />
  );
}

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
        <ClientToaster />
      </PaymentPersistenceLayer>
    </Provider>
  );
}

