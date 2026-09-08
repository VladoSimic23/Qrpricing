"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

type Props = {
  text: string;
};

export function InfoTooltip({ text }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  return (
    <span ref={containerRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Više informacija"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition hover:text-slate-600"
      >
        <Info size={14} />
      </button>
      {isOpen && (
        <span className="absolute left-1/2 top-full z-20 mt-2 w-[min(16rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-xs font-normal leading-relaxed text-slate-600 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}
