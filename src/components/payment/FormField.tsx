import clsx from "clsx";
import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  FORM_ERROR_TEXT_CLASS,
  FORM_FIELD_STACK_CLASS,
  FORM_LABEL_CLASS,
  formControlClasses,
} from "@/constants/ui";

type ControlProps = {
  id?: string;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string | undefined;
};

export type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  /** Extra ids for `aria-describedby` (e.g. live region describing detected card). */
  accessoryDescribedById?: string;
  trailing?: ReactNode;
  children: ReactElement<ControlProps>;
};

export function formControlClassName(options?: {
  invalid?: boolean;
  embedded?: boolean;
}): string {
  return formControlClasses(options);
}

function mergeDescribedBy(
  accessoryId: string | undefined,
  errorId: string | undefined,
  error: string | undefined,
): string | undefined {
  const ids: string[] = [];
  if (accessoryId) {
    ids.push(accessoryId);
  }
  if (error) {
    ids.push(errorId ?? "");
  }
  const merged = ids.filter(Boolean).join(" ");
  return merged.length > 0 ? merged : undefined;
}

export default function FormField({
  id,
  label,
  error,
  accessoryDescribedById,
  trailing,
  children,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const describedBy = mergeDescribedBy(accessoryDescribedById, errorId, error);

  if (!isValidElement<ControlProps>(children)) {
    return null;
  }

  const hasTrailing = Boolean(trailing);

  const control = cloneElement(children, {
    id,
    className: clsx(
      formControlClasses({
        invalid: Boolean(error),
        embedded: hasTrailing,
      }),
      children.props.className,
    ),
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
  });

  const inputGroupShellClass = clsx(
    "flex min-h-[42px] items-stretch overflow-hidden rounded-lg border shadow-sm transition",
    "bg-white dark:bg-zinc-950",
    error
      ? "border-red-600 focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 dark:border-red-500 dark:focus-within:ring-red-500 dark:focus-within:ring-offset-zinc-950"
      : "border-zinc-300 focus-within:ring-2 focus-within:ring-zinc-900 focus-within:ring-offset-2 dark:border-zinc-700 dark:focus-within:ring-zinc-100 dark:focus-within:ring-offset-zinc-950",
  );

  return (
    <div className={FORM_FIELD_STACK_CLASS}>
      <label htmlFor={id} className={FORM_LABEL_CLASS}>
        {label}
      </label>
      {hasTrailing ? (
        <div className={inputGroupShellClass}>
          <div className="min-w-0 flex-1">{control}</div>
          <div className="flex shrink-0 items-stretch border-l border-zinc-200 bg-zinc-50/90 dark:border-zinc-700 dark:bg-zinc-900/80">
            <div className="flex items-center">{trailing}</div>
          </div>
        </div>
      ) : (
        control
      )}
      {error ? (
        <p id={errorId} role="alert" className={FORM_ERROR_TEXT_CLASS}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
