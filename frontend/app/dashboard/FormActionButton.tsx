"use client";

import { useFormStatus } from "react-dom";

import { useToastFormPending } from "./Toast";

type FormActionButtonProps = {
  idleLabel: string;
  loadingLabel?: string;
  className?: string;
  disabled?: boolean;
  formAction?: (formData: FormData) => void | Promise<void>;
  "data-toast-action"?: string;
};

export function FormActionButton({
  idleLabel,
  loadingLabel,
  className,
  disabled,
  formAction,
  "data-toast-action": dataToastAction,
}: FormActionButtonProps) {
  const { pending: formStatusPending } = useFormStatus();
  const { isPending: toastFormPending } = useToastFormPending();
  const pending = formStatusPending || toastFormPending;

  return (
    <button
      type="submit"
      formAction={formAction}
      data-toast-action={dataToastAction}
      disabled={disabled || pending}
      className={className}
    >
      {pending ? loadingLabel || "Spremam..." : idleLabel}
    </button>
  );
}
