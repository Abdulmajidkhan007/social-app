/**
 * Lumina Brand Asset Generator
 * Generates: icon.png (1024x1024), splash-icon.png (1024x1024),
 *            adaptive-icon.png (1024x1024), favicon.png (64x64)
 */

const sharp = require('sharp');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

// ─── Color tokens ──────────────────────────────────────────────────────────────
const VIOLET  = { r: 139, g: 92,  b: 246 };
const PINK    = { r: 236, g: 72,  b: 153 };
const ORANGE  = { r: 249, g: 115, b: 22  };
const BLACK   = { r: 0,   g: 0,   b: 0   };
const WHITE   = { r: 255, g: 255, b: 255 };

// ─── SVG helpers ───────────────────────────────────────────────────────────────

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function gradientColor(t) {
  // violet → pink → orange
  if (t < 0.5) {
    const s = t * 2;
    return { r: lerp(VIOLET.r, PINK.r, s), g: lerp(VIOLET.g, PINK.g, s), b: lerp(VIOLET.b, PINK.b, s) };
  } else {
    const s = (t - 0.5) * 2;
    return { r: lerp(PINK.r, ORANGE.r, s), g: lerp(PINK.g, ORANGE.g, s), b: lerp(PINK.b, ORANGE.b, s) };
  }
}

function toHex(c) {
  return '#' + [c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ─── App Icon SVG ─────────────────────────────────────────────────────────────
// Design: Dark rounded square + bold aperture iris with thick gradient blades

function makeIconSVG(size) {
  const s  = size;
  const cx = s / 2;
  const cy = s / 2;
  const r  = s * 0.38;   // outer radius
  const ir = s * 0.155;  // inner hole radius
  const br = s * 0.23;   // background corner radius
  const BLADE_HALF_ANGLE = 28; // degrees — wider blades

  const blades = [];
  for (let i = 0; i < 6; i++) {
    const a0 = (i * 60 - BLADE_HALF_ANGLE) * Math.PI / 180;
    const a1 = (i * 60 + BLADE_HALF_ANGLE) * Math.PI / 180;
    const aM = (i * 60) * Math.PI / 180;

    // Outer arc points
    const ox0 = cx + r * Math.cos(a0);
    const oy0 = cy + r * Math.sin(a0);
    const ox1 = cx + r * Math.cos(a1);
    const oy1 = cy + r * Math.sin(a1);

    // Inner arc points (offset by 60° for iris twist effect)
    const ia0 = (i * 60 - BLADE_HALF_ANGLE + 50) * Math.PI / 180;
    const ia1 = (i * 60 + BLADE_HALF_ANGLE + 50) * Math.PI / 180;
    const ix0 = cx + ir * Math.cos(ia0);
    const iy0 = cy + ir * Math.sin(ia0);
    const ix1 = cx + ir * Math.cos(ia1);
    const iy1 = cy + ir * Math.sin(ia1);

    const t = i / 6;
    const c0 = gradientColor(t);
    const c1 = gradientColor((t + 0.18) % 1);

    blades.push(`
      <defs>
        <linearGradient id="bg${i}" x1="${ox0}" y1="${oy0}" x2="${cx}" y2="${cy}" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stop-color="${toHex(c0)}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${toHex(c1)}" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <path d="M ${ox0} ${oy0}
               A ${r} ${r} 0 0 1 ${ox1} ${oy1}
               L ${ix1} ${iy1}
               A ${ir} ${ir} 0 0 0 ${ix0} ${iy0}
               Z"
            fill="url(#bg${i})"/>
    `);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#0C0A18"/>
      <stop offset="100%" stop-color="#160826"/>
    </linearGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${toHex(VIOLET)}"/>
      <stop offset="50%"  stop-color="${toHex(PINK)}"/>
      <stop offset="100%" stop-color="${toHex(ORANGE)}"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="${toHex(VIOLET)}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${s * 0.018}"/>
    </filter>
    <clipPath id="roundedClip">
      <rect width="${s}" height="${s}" rx="${br}" ry="${br}"/>
    </clipPath>
  </defs>

  <!-- Background -->
  <rect width="${s}" height="${s}" rx="${br}" ry="${br}" fill="url(#bgGrad)"/>

  <!-- Background radial glow -->
  <circle cx="${cx}" cy="${cy}" r="${r * 1.4}"
          fill="url(#centerGlow)" filter="url(#softBlur)" clip-path="url(#roundedClip)"/>

  <!-- Blades (drawn inside clip) -->
  <g clip-path="url(#roundedClip)">
    ${blades.join('\n')}
  </g>

  <!-- Center dark circle (lens body) -->
  <circle cx="${cx}" cy="${cy}" r="${ir * 1.08}" fill="#0C0A18"/>

  <!-- Lens ring -->
  <circle cx="${cx}" cy="${cy}" r="${ir * 0.98}" fill="none"
          stroke="url(#ringGrad)" stroke-width="${s * 0.014}"/>

  <!-- Inner lens reflection -->
  <circle cx="${cx}" cy="${cy}" r="${ir * 0.6}" fill="#111020" opacity="0.9"/>
  <circle cx="${cx - ir * 0.3}" cy="${cy - ir * 0.3}" r="${ir * 0.22}"
          fill="white" opacity="0.35"/>
  <circle cx="${cx + ir * 0.15}" cy="${cy + ir * 0.15}" r="${ir * 0.1}"
          fill="white" opacity="0.18"/>
</svg>`;
}

// ─── Splash Screen SVG ────────────────────────────────────────────────────────
// Design: Dark background + centered wordmark "Lumina" + small aperture icon

function makeSplashSVG(size) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const iconR = s * 0.18;   // larger icon
  const iconCy = cy - s * 0.10;
  const textY  = cy + s * 0.10;
  const tagY   = cy + s * 0.168;
  const fontSize = s * 0.080;
  const tagSize  = s * 0.030;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="splashBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06060A"/>
      <stop offset="100%" stop-color="#130820"/>
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="${toHex(VIOLET)}"/>
      <stop offset="50%"  stop-color="${toHex(PINK)}"/>
      <stop offset="100%" stop-color="${toHex(ORANGE)}"/>
    </linearGradient>
    <radialGradient id="splashGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="${toHex(VIOLET)}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${s}" height="${s}" fill="url(#splashBg)"/>

  <!-- Background glow -->
  <ellipse cx="${cx}" cy="${iconCy}" rx="${s * 0.45}" ry="${s * 0.35}"
           fill="url(#splashGlow)"/>

  <!-- Mini aperture icon -->
  ${makeMiniAperture(cx, iconCy, iconR, s)}

  <!-- Wordmark -->
  <text x="${cx}" y="${textY}"
        font-family="system-ui, -apple-system, 'SF Pro Display', Helvetica, Arial, sans-serif"
        font-size="${fontSize}"
        font-weight="800"
        letter-spacing="${-fontSize * 0.03}"
        text-anchor="middle"
        fill="url(#textGrad)">Lumina</text>

  <!-- Tagline -->
  <text x="${cx}" y="${tagY}"
        font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="${tagSize}"
        font-weight="400"
        letter-spacing="${tagSize * 0.08}"
        text-anchor="middle"
        fill="rgba(255,255,255,0.45)">SHARE YOUR WORLD</text>
</svg>`;
}

function makeMiniAperture(cx, cy, r, s) {
  const ir = r * 0.40;
  const BLADE_HALF = 28;
  const blades = [];

  for (let i = 0; i < 6; i++) {
    const a0 = (i * 60 - BLADE_HALF) * Math.PI / 180;
    const a1 = (i * 60 + BLADE_HALF) * Math.PI / 180;
    const ia0 = (i * 60 - BLADE_HALF + 50) * Math.PI / 180;
    const ia1 = (i * 60 + BLADE_HALF + 50) * Math.PI / 180;

    const ox0 = cx + r  * Math.cos(a0);  const oy0 = cy + r  * Math.sin(a0);
    const ox1 = cx + r  * Math.cos(a1);  const oy1 = cy + r  * Math.sin(a1);
    const ix0 = cx + ir * Math.cos(ia0); const iy0 = cy + ir * Math.sin(ia0);
    const ix1 = cx + ir * Math.cos(ia1); const iy1 = cy + ir * Math.sin(ia1);

    const t  = i / 6;
    const c0 = gradientColor(t);
    const c1 = gradientColor((t + 0.18) % 1);

    blades.push(`
      <defs>
        <linearGradient id="mb${i}" x1="${ox0}" y1="${oy0}" x2="${cx}" y2="${cy}" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stop-color="${toHex(c0)}"/>
          <stop offset="100%" stop-color="${toHex(c1)}" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <path d="M ${ox0} ${oy0} A ${r} ${r} 0 0 1 ${ox1} ${oy1}
               L ${ix1} ${iy1} A ${ir} ${ir} 0 0 0 ${ix0} ${iy0} Z"
            fill="url(#mb${i})"/>
    `);
  }

  return `
    ${blades.join('\n')}
    <circle cx="${cx}" cy="${cy}" r="${ir * 1.05}" fill="#06060A"/>
    <circle cx="${cx}" cy="${cy}" r="${ir * 0.95}" fill="none"
            stroke="url(#textGrad)" stroke-width="${s * 0.009}"/>
    <circle cx="${cx - ir * 0.3}" cy="${cy - ir * 0.3}" r="${ir * 0.22}"
            fill="white" opacity="0.35"/>
  `;
}

// ─── Adaptive Icon SVG (foreground only, no rounded corners) ─────────────────

function makeAdaptiveSVG(size) {
  const s  = size;
  const cx = s / 2;
  const cy = s / 2;
  const r  = s * 0.35;
  const ir = s * 0.145;
  const glowR = r * 1.05;
  const BLADE_HALF = 28;

  const blades = [];
  for (let i = 0; i < 6; i++) {
    const a0  = (i * 60 - BLADE_HALF)      * Math.PI / 180;
    const a1  = (i * 60 + BLADE_HALF)      * Math.PI / 180;
    const ia0 = (i * 60 - BLADE_HALF + 50) * Math.PI / 180;
    const ia1 = (i * 60 + BLADE_HALF + 50) * Math.PI / 180;
    const ox0 = cx + r  * Math.cos(a0);  const oy0 = cy + r  * Math.sin(a0);
    const ox1 = cx + r  * Math.cos(a1);  const oy1 = cy + r  * Math.sin(a1);
    const ix0 = cx + ir * Math.cos(ia0); const iy0 = cy + ir * Math.sin(ia0);
    const ix1 = cx + ir * Math.cos(ia1); const iy1 = cy + ir * Math.sin(ia1);
    const t = i / 6;
    const c0 = gradientColor(t);
    const c1 = gradientColor((t + 0.18) % 1);
    blades.push(`
      <defs>
        <linearGradient id="ab${i}" x1="${ox0}" y1="${oy0}" x2="${cx}" y2="${cy}" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stop-color="${toHex(c0)}"/>
          <stop offset="100%" stop-color="${toHex(c1)}" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <path d="M ${ox0} ${oy0} A ${r} ${r} 0 0 1 ${ox1} ${oy1}
               L ${ix1} ${iy1} A ${ir} ${ir} 0 0 0 ${ix0} ${iy0} Z"
            fill="url(#ab${i})"/>
    `);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <defs>
    <linearGradient id="aRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="${toHex(VIOLET)}"/>
      <stop offset="50%"  stop-color="${toHex(PINK)}"/>
      <stop offset="100%" stop-color="${toHex(ORANGE)}"/>
    </linearGradient>
    <radialGradient id="aGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="${toHex(VIOLET)}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
    <filter id="aBlur"><feGaussianBlur stdDeviation="${s * 0.025}"/></filter>
  </defs>

  <circle cx="${cx}" cy="${cy}" r="${glowR * 1.1}" fill="url(#aGlow)" filter="url(#aBlur)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
          stroke="url(#aRing)" stroke-width="${s * 0.01}" opacity="0.5"/>
  ${blades.join('\n')}
  <circle cx="${cx}" cy="${cy}" r="${ir}" fill="rgba(0,0,0,0.8)"/>
  <circle cx="${cx}" cy="${cy}" r="${ir * 0.6}" fill="none"
          stroke="url(#aRing)" stroke-width="${s * 0.007}"/>
  <circle cx="${cx - ir * 0.28}" cy="${cy - ir * 0.28}" r="${ir * 0.18}"
          fill="white" opacity="0.45"/>
</svg>`;
}

// ─── Favicon SVG ─────────────────────────────────────────────────────────────

function makeFaviconSVG(size) {
  const s  = size;
  const cx = s / 2;
  const cy = s / 2;
  const r  = s * 0.40;
  const ir = s * 0.16;
  const br = s * 0.22;
  const BLADE_HALF = 28;

  const blades = [];
  for (let i = 0; i < 6; i++) {
    const a0  = (i * 60 - BLADE_HALF)      * Math.PI / 180;
    const a1  = (i * 60 + BLADE_HALF)      * Math.PI / 180;
    const ia0 = (i * 60 - BLADE_HALF + 50) * Math.PI / 180;
    const ia1 = (i * 60 + BLADE_HALF + 50) * Math.PI / 180;
    const ox0 = cx + r  * Math.cos(a0);  const oy0 = cy + r  * Math.sin(a0);
    const ox1 = cx + r  * Math.cos(a1);  const oy1 = cy + r  * Math.sin(a1);
    const ix0 = cx + ir * Math.cos(ia0); const iy0 = cy + ir * Math.sin(ia0);
    const ix1 = cx + ir * Math.cos(ia1); const iy1 = cy + ir * Math.sin(ia1);
    const t = i / 6;
    const c = gradientColor(t);
    blades.push(
      `<path d="M ${ox0} ${oy0} A ${r} ${r} 0 0 1 ${ox1} ${oy1}
               L ${ix1} ${iy1} A ${ir} ${ir} 0 0 0 ${ix0} ${iy0} Z" fill="${toHex(c)}"/>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${br}" ry="${br}" fill="#0F0F14"/>
  ${blades.join('\n')}
  <circle cx="${cx}" cy="${cy}" r="${ir}" fill="#0F0F14" opacity="0.85"/>
</svg>`;
}

// ─── Monochrome adaptive icon ─────────────────────────────────────────────────

function makeMonochromeSVG(size) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r  = s * 0.34;
  const ir = s * 0.15;

  const blades = [];
  for (let i = 0; i < 6; i++) {
    const a0 = (i * 60 - 15) * Math.PI / 180;
    const a1 = (i * 60 + 15) * Math.PI / 180;
    const aM = (i * 60)      * Math.PI / 180;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const cpx = cx + ir * 1.0 * Math.cos(aM + Math.PI);
    const cpy = cy + ir * 1.0 * Math.sin(aM + Math.PI);
    const opacity = 0.5 + (i / 6) * 0.5;
    blades.push(
      `<path d="M ${x0} ${y0} Q ${cpx} ${cpy} ${x1} ${y1} L ${cx} ${cy} Z" fill="white" opacity="${opacity.toFixed(2)}"/>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  ${blades.join('\n')}
  <circle cx="${cx}" cy="${cy}" r="${ir}" fill="black" opacity="0.6"/>
  <circle cx="${cx}" cy="${cy}" r="${ir * 0.55}" fill="none"
          stroke="white" stroke-width="${s * 0.025}" opacity="0.8"/>
</svg>`;
}

// ─── Generate all assets ──────────────────────────────────────────────────────

async function generateAsset(svg, outputPath, width, height) {
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .png({ compressionLevel: 9, quality: 100 })
    .toFile(outputPath);
  console.log(`✓ ${outputPath.replace(__dirname + '/', '')}  (${width}×${height})`);
}

async function main() {
  console.log('\n🎨  Lumina Brand Asset Generator\n');

  await generateAsset(
    makeIconSVG(1024),
    path.join(ASSETS_DIR, 'icon.png'),
    1024, 1024
  );

  await generateAsset(
    makeSplashSVG(1024),
    path.join(ASSETS_DIR, 'splash-icon.png'),
    1024, 1024
  );

  await generateAsset(
    makeAdaptiveSVG(1024),
    path.join(ASSETS_DIR, 'adaptive-icon.png'),
    1024, 1024
  );

  await generateAsset(
    makeFaviconSVG(64),
    path.join(ASSETS_DIR, 'favicon.png'),
    64, 64
  );

  await generateAsset(
    makeMonochromeSVG(1024),
    path.join(ASSETS_DIR, 'android-icon-monochrome.png'),
    1024, 1024
  );

  // Dark solid background for adaptive icon background layer
  const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F0F14"/>
        <stop offset="100%" stop-color="#1A0A2E"/>
      </linearGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#g)"/>
  </svg>`;

  await generateAsset(
    bgSvg,
    path.join(ASSETS_DIR, 'android-icon-background.png'),
    1024, 1024
  );

  await generateAsset(
    makeAdaptiveSVG(1024),
    path.join(ASSETS_DIR, 'android-icon-foreground.png'),
    1024, 1024
  );

  console.log('\n✅  All brand assets generated successfully!\n');
}

main().catch(console.error);
