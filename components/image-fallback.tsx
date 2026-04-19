export const IMAGE_FALLBACK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#grad)"/>
  <g opacity="0.3">
    <rect x="200" y="100" width="400" height="250" fill="none" stroke="#9ca3af" stroke-width="3" rx="10"/>
    <circle cx="300" cy="170" r="25" fill="#d1d5db"/>
    <path d="M200 320 L400 200 L600 300 L800 150 L800 350 Q800 360 790 360 L10 360 Q0 360 0 350 L0 100" fill="none" stroke="#d1d5db" stroke-width="2"/>
  </g>
  <g transform="translate(400, 200)">
    <circle cx="0" cy="0" r="50" fill="none" stroke="#9ca3af" stroke-width="3" opacity="0.4"/>
    <circle cx="0" cy="0" r="40" fill="none" stroke="#9ca3af" stroke-width="2" opacity="0.3"/>
    <path d="M -15 -5 L 15 20 M 15 -5 L -15 20" stroke="#9ca3af" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
  </g>
  <text x="400" y="370" font-size="16" fill="#6b7280" text-anchor="middle" font-family="system-ui" font-weight="500">Image not available</text>
</svg>
`;

export function getImageFallbackUrl() {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(IMAGE_FALLBACK_SVG);
}
