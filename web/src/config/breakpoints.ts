export const BREAKPOINTS = {
  mobileMax: 599,
  tabletMin: 600,
  tabletMax: 1023,
  desktopMin: 1024,
} as const;

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobileMax}px)`,
  tablet: `(min-width: ${BREAKPOINTS.tabletMin}px) and (max-width: ${BREAKPOINTS.tabletMax}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktopMin}px)`,
} as const;
