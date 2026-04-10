"use client";

import { useFormStatus } from "react-dom";

type FormActionButtonProps = {
  idleLabel: string;
  loadingLabel?: string;
  className?: string;
  disabled?: boolean;
  formAction?: (formData: FormData) => void | Promise<void>;
};

export function FormActionButton({
  idleLabel,
  loadingLabel,
  className,
  disabled,
  formAction,
}: FormActionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={disabled || pending}
      className={className}
    >
      {pending ? loadingLabel || "Spremam..." : idleLabel}
    </button>
  );
}
