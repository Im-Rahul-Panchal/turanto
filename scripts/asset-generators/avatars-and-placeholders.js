const sharp = require('sharp');
const path = require('path');

async function generateAvatarsAndPlaceholders(imagesDir) {
  console.log('Generating Avatars and Placeholders...');
  const avatarsDir = path.join(imagesDir, 'avatars');
  const placeholdersDir = path.join(imagesDir, 'placeholders');

  // 1. User Avatar (256x256)
  const avatarSvg = `
  <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="avGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00A65A" />
        <stop offset="100%" stop-color="#046B3C" />
      </linearGradient>
    </defs>
    <!-- Background Circle -->
    <circle cx="128" cy="128" r="128" fill="#EEFBF3" />
    <circle cx="128" cy="128" r="120" fill="url(#avGrad)" />
    
    <!-- User Head & Shoulders silhouette -->
    <circle cx="128" cy="100" r="44" fill="#FFFFFF" />
    <path d="M56 216C56 176 88 152 128 152C168 152 200 176 200 216V224H56V216Z" fill="#FFFFFF" />
    
    <!-- Stylish Glasses / Smile -->
    <path d="M106 100C110 108 146 108 150 100" stroke="#046B3C" stroke-width="4" stroke-linecap="round" fill="none" />
  </svg>
  `;
  await sharp(Buffer.from(avatarSvg)).png().toFile(path.join(avatarsDir, 'avatar-user.png'));

  // 2. Product Placeholder (600x600)
  const productPlaceholderSvg = `
  <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="plPedestal" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#EEFBF3" />
        <stop offset="100%" stop-color="#FFFFFF" />
      </radialGradient>
      <filter id="plShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#004D25" flood-opacity="0.1" />
      </filter>
    </defs>
    <rect width="600" height="600" rx="36" fill="#F6F9F8" />
    <circle cx="300" cy="300" r="230" fill="url(#plPedestal)" />
    
    <!-- Floating Minimal Shopping Bag with Leaf -->
    <g transform="translate(190, 160)" filter="url(#plShadow)">
      <rect x="30" y="70" width="160" height="180" rx="28" fill="#00A65A" />
      <path d="M70 70V40C70 24 82 12 110 12C138 12 150 24 150 40V70" stroke="#046B3C" stroke-width="14" stroke-linecap="round" fill="none" />
      <circle cx="110" cy="160" r="32" fill="white" />
      <path d="M110 144L94 168H110L102 184L126 158H112L118 144H110Z" fill="#FFB300" />
    </g>

    <text x="300" y="460" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="#6E8078" text-anchor="middle">
      turanto<tspan fill="#00A65A">.</tspan>
    </text>
  </svg>
  `;
  await sharp(Buffer.from(productPlaceholderSvg)).png().toFile(path.join(placeholdersDir, 'placeholder-product.png'));

  // 3. Generic Placeholder (600x600)
  const genericPlaceholderSvg = `
  <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EEFBF3" />
        <stop offset="100%" stop-color="#D5F5E3" />
      </linearGradient>
    </defs>
    <rect width="600" height="600" rx="36" fill="url(#genGrad)" />
    
    <g transform="translate(200, 190)">
      <rect x="20" y="20" width="160" height="160" rx="44" fill="#00A65A" />
      <path d="M96 32L54 94H92L64 136L124 74H86L108 32H96Z" fill="white" />
    </g>

    <text x="300" y="440" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#046B3C" text-anchor="middle" letter-spacing="1">
      TURANTO
    </text>
  </svg>
  `;
  await sharp(Buffer.from(genericPlaceholderSvg)).png().toFile(path.join(placeholdersDir, 'placeholder-generic.png'));

  console.log('✓ Avatars and Placeholders generated.');
}

module.exports = { generateAvatarsAndPlaceholders };
