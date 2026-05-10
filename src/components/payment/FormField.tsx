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

export function formControlClassName(options?: { invalid?: boolean }): string {
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

  const control = cloneElement(children, {
    id,
    className: clsx(
      formControlClasses({ invalid: Boolean(error) }),
      children.props.className,
    ),
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
  });

  return (
    <div className={FORM_FIELD_STACK_CLASS}>
      <label htmlFor={id} className={FORM_LABEL_CLASS}>
        {label}
      </label>
      <div
        className={clsx(
          "flex min-h-[42px] items-stretch",
          trailing ? "gap-2" : "gap-0",
        )}
      >
        <div className="min-w-0 flex-1">{control}</div>
        <div className="flex shrink-0 items-center">{trailing ?? null}</div>
      </div>
      {error ? (
        <p id={errorId} role="alert" className={FORM_ERROR_TEXT_CLASS}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
