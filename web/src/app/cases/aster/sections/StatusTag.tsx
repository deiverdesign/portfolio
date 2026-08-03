import shared from "./shared.module.css";

export type AsterStatus = "explored" | "proposed" | "implemented" | "future";

export const STATUS_LABELS: Record<AsterStatus, string> = {
  explored: "Explored in the original project",
  proposed: "Proposed but not tested",
  implemented: "Implemented in the portfolio reconstruction",
  future: "Future direction",
};

export interface StatusTagProps {
  status: AsterStatus;
  onDark?: boolean;
}

/** Selo reaproveitado em cada capítulo, ligado à legenda logo após o Disclaimer. */
export function StatusTag({ status, onDark = false }: StatusTagProps) {
  return (
    <span className={`${shared.pill} ${shared.pillStandalone} ${onDark ? shared.pillOnDark : ""}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
