"use client";

import { type ReactNode, useTransition } from "react";

import { ToastFormPendingContext, useToast } from "./Toast";

type ToastFormProps = {
  action: (formData: FormData) => Promise<void>;
  successMessage: string;
  deleteAction?: (formData: FormData) => Promise<void>;
  deleteSuccessMessage?: string;
  className?: string;
  children: ReactNode;
  encType?: string;
  onSuccess?: () => void;
  resetOnSuccess?: boolean;
  deleteConfirmMessage?: string;
};

export function ToastForm({
  action,
  successMessage,
  deleteAction,
  deleteSuccessMessage,
  className,
  children,
  encType,
  onSuccess,
  resetOnSuccess,
  deleteConfirmMessage,
}: ToastFormProps) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const isDelete = submitter?.dataset?.toastAction === "delete";

    if (isDelete && deleteConfirmMessage) {
      if (!window.confirm(deleteConfirmMessage)) {
        return;
      }
    }

    const actionToCall = isDelete && deleteAction ? deleteAction : action;
    const message =
      isDelete && deleteSuccessMessage ? deleteSuccessMessage : successMessage;

    startTransition(async () => {
      try {
        await actionToCall(formData);
        showToast(message, "success");
        onSuccess?.();
        if (resetOnSuccess) {
          formElement.reset();
        }
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Greška pri izvršavanju akcije.",
          "error",
        );
      }
    });
  };

  return (
    <ToastFormPendingContext.Provider value={{ isPending }}>
      <form
        onSubmit={handleSubmit}
        className={className}
        {...(encType ? { encType } : {})}
      >
        {children}
      </form>
    </ToastFormPendingContext.Provider>
  );
}
