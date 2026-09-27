const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateBrandAssets(imagesDir) {
  console.log('Generating Brand & Icon assets...');

  // 1. Turanto Primary Brand Logo (800x240)
  const logoSvg = `
  <svg width="800" height="240" viewBox="0 0 800 240" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00C853" />
        <stop offset="100%" stop-color="#007934" />
      </linearGradient>
      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFB300" />
        <stop offset="100%" stop-color="#FF6F00" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#00A65A" flood-opacity="0.3" />
      </filter>
    </defs>
    
    <!-- Brand Mark Icon -->
    <g transform="translate(60, 40)" filter="url(#shadow)">
      <rect width="160" height="160" rx="44" fill="url(#brandGrad)" />
      
      <!-- Speed Bolt / Leaf emblem -->
      <path d="M96 32L54 94H92L64 136L124 74H86L108 32H96Z" fill="white" />
      <path d="M102 38L68 88H96L76 122L120 72H92L108 38H102Z" fill="url(#accentGrad)" />
      
      <!-- Little speed trail dots -->
      <circle cx="42" cy="118" r="6" fill="#A9E9C6" />
      <circle cx="34" cy="98" r="4" fill="#6FD9A2" />
    </g>

    <!-- Turanto Wordmark -->
    <g transform="translate(250, 60)">
      <!-- Main Name -->
      <text x="0" y="82" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="88" font-weight="900" letter-spacing="-1.5" fill="#12201A">
        turanto<tspan fill="#00A65A">.</tspan>
      </text>
      
      <!-- Tagline & Speed Badge -->
      <rect x="2" y="104" width="138" height="26" rx="13" fill="#EEFBF3" />
      <circle cx="15" cy="117" r="5" fill="#00A65A" />
      <text x="26" y="121" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="700" fill="#00884A" letter-spacing="0.5">
        10 MIN DELIVERY
      </text>
      <text x="154" y="121" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="600" fill="#52645B" letter-spacing="0.2">
        Everything you need. Turanto.
      </text>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(logoSvg))
    .png()
    .toFile(path.join(imagesDir, 'logo', 'turanto-logo.png'));

  // 2. Turanto Mark (512x512)
  const markSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="markGrad" x1="10%" y1="0%" x2="90%" y2="100%">
        <stop offset="0%" stop-color="#00D46A" />
        <stop offset="60%" stop-color="#00A65A" />
        <stop offset="100%" stop-color="#046B3C" />
      </linearGradient>
      <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE082" />
        <stop offset="100%" stop-color="#FF9800" />
      </linearGradient>
      <filter id="markShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#004D25" flood-opacity="0.25" />
      </filter>
    </defs>
    
    <rect x="32" y="32" width="448" height="448" rx="124" fill="url(#markGrad)" filter="url(#markShadow)" />
    
    <!-- Decorative subtle ring -->
    <circle cx="256" cy="256" r="180" stroke="white" stroke-width="4" stroke-opacity="0.15" fill="none" />
    
    <!-- Stylized Speed Lightning 'T' -->
    <path d="M152 144H360C370 144 378 152 378 162C378 172 370 180 360 180H286V216L214 316H276L196 412L236 304H176L246 180H152C142 180 134 172 134 162C134 152 142 144 152 144Z" fill="white" />
    <path d="M280 220L224 298H274L208 384L242 292H192L254 184H286V220Z" fill="url(#boltGrad)" />
  </svg>
  `;

  await sharp(Buffer.from(markSvg))
    .png()
    .toFile(path.join(imagesDir, 'logo', 'turanto-mark.png'));

  // 3. App Icon (1024x1024)
  const iconSvg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00C853" />
        <stop offset="50%" stop-color="#00A65A" />
        <stop offset="100%" stop-color="#046B3C" />
      </linearGradient>
      <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFD54F" />
        <stop offset="100%" stop-color="#FF8F00" />
      </linearGradient>
      <radialGradient id="sunkenLight" cx="30%" cy="20%" r="70%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
      </radialGradient>
      <filter id="iconDepth" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="24" stdDeviation="32" flood-color="#002D15" flood-opacity="0.35" />
      </filter>
    </defs>
    
    <!-- Base Canvas -->
    <rect width="1024" height="1024" fill="url(#bgGrad)" />
    <rect width="1024" height="1024" fill="url(#sunkenLight)" />

    <!-- Center White Badge Circle -->
    <circle cx="512" cy="512" r="380" fill="white" filter="url(#iconDepth)" />
    
    <!-- Turanto Speed T Logo -->
    <g transform="translate(512, 512) scale(1.6) translate(-256, -256)">
      <!-- Outer energetic arc -->
      <path d="M120 256C120 180 180 120 256 120C310 120 356 150 378 196" stroke="#00A65A" stroke-width="28" stroke-linecap="round" fill="none" />
      
      <!-- Dynamic Speed T Symbol -->
      <path d="M160 160H352C364 160 372 170 370 182L354 236C352 242 346 246 340 246H288L236 346H296L206 456L242 334H182L246 216H160C148 216 140 206 142 194L148 174C150 166 154 160 160 160Z" fill="#00A65A" />
      <path d="M288 246L240 334H290L216 432L246 322H196L252 220H288V246Z" fill="url(#amberGlow)" />
    </g>

    <!-- Speed 10-Min Dot -->
    <circle cx="730" cy="300" r="32" fill="#FF6B35" filter="url(#iconDepth)" />
    <text x="730" y="311" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="white" text-anchor="middle">10m</text>
  </svg>
  `;

  await sharp(Buffer.from(iconSvg))
    .png()
    .toFile(path.join(imagesDir, 'icon.png'));

  // 4. Splash Icon (256x256)
  const splashSvg = `
  <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="splashAmber" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE082" />
        <stop offset="100%" stop-color="#FFB300" />
      </linearGradient>
    </defs>
    <!-- Clean white & amber mark on transparent background for splash screen -->
    <path d="M50 48H206C214 48 220 54 220 62C220 70 214 76 206 76H152V104L104 182H156L88 250L122 170H74L128 76H50C42 76 36 70 36 62C36 54 42 48 50 48Z" fill="white" />
    <path d="M152 104L110 172H150L98 230L126 160H86L134 82H152V104Z" fill="url(#splashAmber)" />
  </svg>
  `;

  await sharp(Buffer.from(splashSvg))
    .png()
    .toFile(path.join(imagesDir, 'splash-icon.png'));

  // 5. Android Adaptive Icons
  const androidFgSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="afgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00A65A" />
        <stop offset="100%" stop-color="#046B3C" />
      </linearGradient>
      <linearGradient id="afgAmber" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFD54F" />
        <stop offset="100%" stop-color="#FF8F00" />
      </linearGradient>
    </defs>
    <circle cx="256" cy="256" r="160" fill="white" />
    <g transform="translate(256, 256) scale(0.7) translate(-256, -256)">
      <path d="M152 144H360C370 144 378 152 378 162C378 172 370 180 360 180H286V216L214 316H276L196 412L236 304H176L246 180H152C142 180 134 172 134 162C134 152 142 144 152 144Z" fill="url(#afgGrad)" />
      <path d="M280 220L224 298H274L208 384L242 292H192L254 184H286V220Z" fill="url(#afgAmber)" />
    </g>
  </svg>
  `;
  await sharp(Buffer.from(androidFgSvg))
    .png()
    .toFile(path.join(imagesDir, 'android-icon-foreground.png'));

  const androidBgSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="abg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00C853" />
        <stop offset="100%" stop-color="#046B3C" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" fill="url(#abg)" />
  </svg>
  `;
  await sharp(Buffer.from(androidBgSvg))
    .png()
    .toFile(path.join(imagesDir, 'android-icon-background.png'));

  const androidMonoSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="256" cy="256" r="160" fill="white" />
    <path d="M182 174H330C336 174 342 180 342 186C342 192 336 198 330 198H278V226L228 300H270L216 370L242 292H202L252 198H182C176 198 170 192 170 186C170 180 176 174 182 174Z" fill="black" />
  </svg>
  `;
  await sharp(Buffer.from(androidMonoSvg))
    .png()
    .toFile(path.join(imagesDir, 'android-icon-monochrome.png'));

  // 6. Favicon (64x64)
  await sharp(Buffer.from(markSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(imagesDir, 'favicon.png'));

  console.log('✓ Brand & Icon assets generated.');
}

module.exports = { generateBrandAssets };
