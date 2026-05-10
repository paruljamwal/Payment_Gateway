"use client";

import clsx from "clsx";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CurrencyType } from "@/types/payment";
import { currencies } from "@/types/payment";
import {
  FORM_ERROR_TEXT_CLASS,
  FORM_FIELD_STACK_CLASS,
  FORM_LABEL_CLASS,
  formControlClasses,
} from "@/constants/ui";

export type CurrencySelectProps = {
  id: string;
  label: string;
  value: CurrencyType;
  onChange: (value: CurrencyType) => void;
  onBlur: () => void;
  error?: string;
};

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      fill="currentColor"
      className={clsx("h-5 w-5 transition-transform", expanded && "rotate-180")}
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function CurrencySelect({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
}: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const errorId = `${id}-error`;

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onDocPointerDown = (event: PointerEvent) => {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }
      close();
      onBlur();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        onBlur();
      }
    };

    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, onBlur]);

  const selectOption = (code: CurrencyType) => {
    onChange(code);
    close();
    onBlur();
  };

  return (
    <div className={FORM_FIELD_STACK_CLASS}>
      <label htmlFor={id} className={FORM_LABEL_CLASS}>
        {label}
      </label>
      <div ref={containerRef} className="relative min-w-0">
        <button
          type="button"
          id={id}
          className={clsx(
            formControlClasses({ invalid: Boolean(error) }),
            "flex items-center justify-between gap-2 text-left",
          )}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-describedby={error ? errorId : undefined}
          onClick={() => setOpen((previous) => !previous)}
        >
          <span className="min-w-0 truncate">{value}</span>
          <span className="pointer-events-none shrink-0 text-zinc-500 dark:text-zinc-400">
            <ChevronIcon expanded={open} />
          </span>
        </button>
        {open ? (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 min-w-0 overflow-auto rounded-lg border border-zinc-300 bg-white py-1 text-zinc-900 shadow-lg ring-1 ring-black/5 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-white/10"
          >
            {currencies.map((code) => (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === code}
                  className={clsx(
                    "flex w-full min-w-0 px-3 py-2.5 text-left text-base sm:text-sm",
                    value === code
                      ? "bg-zinc-100 font-medium dark:bg-zinc-800"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                  )}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() => selectOption(code)}
                >
                  {code}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} role="alert" className={FORM_ERROR_TEXT_CLASS}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
