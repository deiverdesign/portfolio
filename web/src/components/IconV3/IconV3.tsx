export const ICON_V3_NAMES = [
  "arrow-down",
  "arrow-left",
  "arrow-right",
  "assignment",
  "brazil-flag",
  "briefcase-business-2",
  "caret-down",
  "caret-left",
  "caret-right",
  "caret-up",
  "chart-gantt",
  "check-2",
  "check-circle",
  "clinical-notes",
  "close",
  "download",
  "external-link",
  "flask-round",
  "handshake-2",
  "info-2",
  "languages-2",
  "layers",
  "lightbulb",
  "linkedin",
  "lock",
  "map-pin",
  "menu",
  "menu2",
  "octagon-alert-2",
  "pause",
  "person-card",
  "play",
  "search",
  "target-2",
  "triangle-dashed",
  "usa-flag",
] as const;

export type IconV3Name = (typeof ICON_V3_NAMES)[number];

export interface IconV3Props {
  name: IconV3Name;
  size?: number;
  className?: string;
}

/**
 * Figma: página de ícones, node 472:1538 — exportados manualmente pelo
 * Deiver em 27/09/2026 (SVGs em `public/images/v3/icons/`, nomes
 * normalizados para kebab-case). Todos conferidos via `getBBox()`: nenhum
 * tem a "moldura vazia" que os logos de marca tinham.
 *
 * Limitação conhecida: a cor vem cravada no SVG (`#303735`), não usa
 * `currentColor` — em contexto Inverse (fundo escuro) vai ficar invisível
 * até existir uma variante clara ou os SVGs serem reexportados com
 * `currentColor`.
 */
export function IconV3({ name, size = 14, className }: IconV3Props) {
  return (
    <img
      src={`/images/v3/icons/${name}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={className}
    />
  );
}
