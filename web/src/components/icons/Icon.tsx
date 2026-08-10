import type { SVGProps } from "react";

export type IconName =
  | "download"
  | "arrow-right"
  | "menu"
  | "close"
  | "external-link"
  | "play"
  | "pause";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

/** Ícones do Figma (Icon=Download/Arrow Right/Menu/Close/External Link, 14x14). */
export function Icon({ name, size = 14, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.16667}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {name === "download" && (
        <>
          <path d="M12.25 8.75V11.0833C12.25 11.3928 12.1271 11.6895 11.9083 11.9083C11.6895 12.1271 11.3928 12.25 11.0833 12.25H2.91667C2.60725 12.25 2.3105 12.1271 2.09171 11.9083C1.87292 11.6895 1.75 11.3928 1.75 11.0833V8.75" />
          <path d="M4.08325 5.83301L6.99992 8.74967L9.91659 5.83301" />
          <path d="M7 8.75V1.75" />
        </>
      )}
      {name === "arrow-right" && (
        <g transform="translate(2.12, 2.42)">
          <path d="M0.583333 4.66634H8.75" />
          <path d="M4.66665 0.583333L8.74998 4.66667L4.66665 8.75" />
        </g>
      )}
      {name === "menu" && (
        <>
          <path d="M0.583333 0.583333H9.91667" transform="translate(1.75, 2.917)" />
          <path d="M0.583333 0.583333H9.91667" transform="translate(1.75, 6.417)" />
          <path d="M0.583333 0.583333H9.91667" transform="translate(1.75, 9.917)" />
        </>
      )}
      {name === "close" && (
        <g transform="translate(2.92, 2.92)">
          <path d="M7.58333 0.583333L0.583333 7.58333" />
          <path d="M0.583333 0.583333L7.58333 7.58333" />
        </g>
      )}
      {name === "play" && <path d="M4.5 3.5L10.5 7L4.5 10.5V3.5Z" fill="currentColor" stroke="none" />}
      {name === "pause" && (
        <>
          <rect x="4" y="3" width="2" height="8" rx="0.5" fill="currentColor" stroke="none" />
          <rect x="8" y="3" width="2" height="8" rx="0.5" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "external-link" && (
        <>
          <path d="M0.583333 0.583333H4.08333V4.08333" transform="translate(8.167, 1.167)" />
          <path d="M0.583333 7L7 0.583333" transform="translate(5.25, 1.167)" />
          <path
            d="M9.33333 4.66667V8.16667C9.33333 8.47609 9.21042 8.77283 8.99162 8.99162C8.77283 9.21042 8.47609 9.33333 8.16667 9.33333H1.75C1.44058 9.33333 1.14383 9.21042 0.925042 8.99162C0.70625 8.77283 0.583333 8.47609 0.583333 8.16667V1.75C0.583333 1.44058 0.70625 1.14383 0.925042 0.925042C1.14383 0.70625 1.44058 0.583333 1.75 0.583333H5.25"
            transform="translate(1.167, 2.917)"
          />
        </>
      )}
    </svg>
  );
}
