import { writeFileSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Prepare crisp large 384x384 logo from docs/logo.png
execSync('sips -z 384 384 docs/logo.png --out /tmp/logo-384.png');
const logoB64 = readFileSync('/tmp/logo-384.png').toString('base64');

// Ultra-clean, bold, high-impact 1200x630 OG image
// Only 3 elements: Huge Logo + Product Name + Punchy Slogan
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0e111a"/>
      <stop offset="50%" stop-color="#090a0f"/>
      <stop offset="100%" stop-color="#050608"/>
    </linearGradient>

    <!-- Center Radial Glow for Logo Pop -->
    <radialGradient id="centerGlow" cx="0.5" cy="0.4" r="0.6">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18"/>
      <stop offset="45%" stop-color="#2563eb" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Deep Ambient Drop Shadow for Logo -->
    <filter id="logoShadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#000000" flood-opacity="0.7"/>
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#3b82f6" flood-opacity="0.25"/>
    </filter>

    <!-- Text Shadow for Punchy Contrast -->
    <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <style>
    .font-sans { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI Variable", "Segoe UI", system-ui, sans-serif; }
  </style>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#centerGlow)"/>

  <!-- Subtle Inset Frame -->
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>

  <!-- ================= CENTERPIECE ================= -->

  <!-- 1. Large High-Res App Icon (180x180) -->
  <g transform="translate(510, 88)" filter="url(#logoShadow)">
    <rect width="180" height="180" rx="44" fill="#131520" stroke="#ffffff" stroke-opacity="0.16" stroke-width="2"/>
    <image href="data:image/png;base64,${logoB64}" x="14" y="14" width="152" height="152" preserveAspectRatio="xMidYMid meet"/>
  </g>

  <!-- 2. Brand Name: Side Stash (Big & Crisp) -->
  <text x="600" y="348" text-anchor="middle" class="font-sans" font-size="44" font-weight="700" fill="#ffffff" letter-spacing="-0.03em" filter="url(#textGlow)">
    Side Stash
  </text>

  <!-- 3. Giant Slogan: Stash it. Find it. -->
  <text x="600" y="468" text-anchor="middle" class="font-sans" font-size="88" font-weight="850" letter-spacing="-0.05em" filter="url(#textGlow)">
    <tspan fill="#ffffff">Stash it. </tspan>
    <tspan fill="#60a5fa">Find it.</tspan>
  </text>
</svg>`;

writeFileSync('website/public/og-image.svg', svg);
execSync('rsvg-convert -o website/public/og-image.png website/public/og-image.svg');
console.log('Regenerated ultra-bold minimalist website/public/og-image.png');
