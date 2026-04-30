"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastType = "success" | "error";
type ToastItem = { id: number; message: string; type: ToastType };

const ToastContext = createContext<{
  showToast: (message: string, type?: ToastType) => void;
}>({ showToast: () => {} });

export const ToastFormPendingContext = createContext<{ isPending: boolean }>({
  isPending: false,
});

export function useToast() {
  return useContext(ToastContext);
}

export function useToastFormPending() {
  return useContext(ToastFormPendingContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++counterRef.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(
        () => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        },
        type === "error" ? 5000 : 3000,
      );
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl px-5 py-3 text-sm font-medium text-white shadow-xl transition-all ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? "✓ " : "✕ "}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
