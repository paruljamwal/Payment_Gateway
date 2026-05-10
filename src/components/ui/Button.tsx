"use client";

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import clsx from "clsx";
import {
  ghostLinkButtonClass,
  outlineActionButtonClass,
  primaryActionButtonClass,
} from "@/constants/buttonStyles";

export type ButtonVariant = "primary" | "ghost" | "outline";

export type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      className,
      disabled,
      type = "button",
      children,
      ...rest
    },
    ref,
  ) {
    const variantClass =
      variant === "ghost"
        ? ghostLinkButtonClass()
        : variant === "outline"
          ? outlineActionButtonClass(Boolean(disabled))
          : primaryActionButtonClass(Boolean(disabled));

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(variantClass, className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
