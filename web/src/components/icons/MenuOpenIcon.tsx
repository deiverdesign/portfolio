import type { SVGProps } from "react";

export type MenuOpenIconProps = SVGProps<SVGSVGElement>;

/**
 * Vetor exato exportado do Figma como "Button - Open menu.svg".
 *
 * O frame é 50×50, enquanto o desenho tem bounds ópticos menores e
 * assimétricos. Preservar o viewBox completo é parte da composição; a cor é
 * deliberadamente `currentColor` para ser resolvida pelo token do contexto.
 */
export function MenuOpenIcon(props: MenuOpenIconProps) {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M36.8252 29.3274C37.3222 29.3276 37.7246 29.7307 37.7246 30.2278C37.7244 30.7246 37.322 31.127 36.8252 31.1272H22.4219C21.9248 31.1272 21.5217 30.7248 21.5215 30.2278C21.5215 29.7306 21.9247 29.3274 22.4219 29.3274H36.8252ZM36.8252 23.926C37.3222 23.9263 37.7246 24.3294 37.7246 24.8264C37.7244 25.3233 37.3221 25.7266 36.8252 25.7268H11.6191C11.1221 25.7268 10.7189 25.3234 10.7188 24.8264C10.7188 24.3292 11.122 23.926 11.6191 23.926H36.8252ZM36.8252 18.5247C37.3222 18.5249 37.7246 18.928 37.7246 19.425C37.7245 19.922 37.3221 20.3252 36.8252 20.3254H17.0205C16.5234 20.3254 16.1202 19.9221 16.1201 19.425C16.1201 18.9279 16.5233 18.5247 17.0205 18.5247H36.8252Z"
        fill="currentColor"
      />
    </svg>
  );
}
