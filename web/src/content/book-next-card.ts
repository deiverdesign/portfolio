// Gradient matrices and stops read from Figma 2626:81410, viewBox 476 × 274.
const gradients = [
  ["-18.564 1.644 -2.38 -8.768 499.8 175.36", [[0,"rgba(81,89,128,0.72157)"],[0.5,"rgba(52,150,153,0.4)"],[1,"rgba(81,89,128,0)"]]],
  ["13.804 2.74 -6.188 10.412 190.4 46.58", [[0,"#ff009c"],[0.2,"rgba(252,0,153,0.94118)"],[0.57,"rgba(230,0,150,0.65098)"],[0.8,"rgba(206,0,132,0.4)"],[1,"rgba(206,0,132,0)"]]],
  ["13.804 4.932 -9.996 9.316 161.84 104.12", [[0,"#de0063"],[0.25,"rgba(216,12,107,0.92941)"],[0.58,"rgba(186,18,108,0.65098)"],[1,"rgba(167,25,117,0)"]]],
  ["20.468 -2.192 4.284 13.426 47.6 180.84", [[0,"rgba(101,34,126,0.85882)"],[0.42,"rgba(78,27,112,0.76863)"],[1,"rgba(56,21,93,0)"]]],
] as const;

export const BOOK_NEXT_BACKGROUND = gradients.map(([matrix, stops]) => {
  const svg = `<svg viewBox="0 0 476 274" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><defs><radialGradient id="g" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="matrix(${matrix})">${stops.map(([offset, color]) => `<stop offset="${offset}" stop-color="${color}"/>`).join("")}</radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}).join(",") + ",linear-gradient(180deg,#10118e 2%,#171383 41.2%,#1d2b72 64.72%,#11134e 100%)";
