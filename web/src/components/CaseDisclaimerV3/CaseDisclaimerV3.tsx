"use client";

import { useEffect, useRef, useState } from "react";

import { IconV3 } from "@/components/IconV3/IconV3";
import styles from "./CaseDisclaimerV3.module.css";

export interface CaseDisclaimerV3Props {
  label: string;
  tooltip: string;
}

/** Aviso expansível do hero Aster. Figma: 2262:70707 e 2262:70848. */
export function CaseDisclaimerV3({ label, tooltip }: CaseDisclaimerV3Props) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className={styles.root}>
      <p>{label}</p>
      <button
        type="button"
        className={styles.trigger}
        aria-label="More information"
        aria-expanded={isOpen}
        aria-controls="aster-disclaimer-tooltip"
        onClick={() => setIsOpen((open) => !open)}
      >
        <IconV3 name="octagon-alert-2" size={20} />
      </button>
      {isOpen && (
        <div id="aster-disclaimer-tooltip" className={styles.tooltip} role="tooltip">
          <p>{tooltip}</p>
          <img src="/images/v3/icons/tooltip-pointer.svg" alt="" aria-hidden="true" className={styles.pointer} />
        </div>
      )}
    </div>
  );
}
