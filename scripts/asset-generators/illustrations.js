const sharp = require('sharp');
const path = require('path');

async function generateIllustrations(imagesDir) {
  console.log('Generating Illustrations...');
  const illDir = path.join(imagesDir, 'illustrations');

  // Common SVG wrapper with lighting and gradients
  function wrap(content, primaryColor = '#00A65A', secondaryColor = '#FF6B35') {
    return `
    <svg width="720" height="560" viewBox="0 0 720 560" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F6F9F8" />
          <stop offset="100%" stop-color="#EEFBF3" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.16" />
          <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${primaryColor}" />
          <stop offset="100%" stop-color="#046B3C" />
        </linearGradient>
        <linearGradient id="secGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${secondaryColor}" />
          <stop offset="100%" stop-color="#E14F1B" />
        </linearGradient>
        <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFD54F" />
          <stop offset="100%" stop-color="#F5A524" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#12201A" flood-opacity="0.12" />
        </filter>
        <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${primaryColor}" flood-opacity="0.2" />
        </filter>
      </defs>

      <!-- Backdrop -->
      <rect width="720" height="560" rx="36" fill="url(#bgGlow)" />
      <circle cx="360" cy="270" r="220" fill="url(#sunGlow)" />
      
      <!-- Ground Shadow Oval -->
      <ellipse cx="360" cy="450" rx="200" ry="24" fill="#E1E9E5" />
      <ellipse cx="360" cy="450" rx="140" ry="14" fill="#C2CEC8" />

      <!-- Floating decorative stars / leaves -->
      <g opacity="0.8">
        <path d="M180 140L184 152L196 156L184 160L180 172L176 160L164 156L176 152Z" fill="${secondaryColor}" />
        <path d="M540 160L543 170L553 173L543 176L540 186L537 176L527 173L537 170Z" fill="${primaryColor}" />
        <circle cx="160" cy="280" r="6" fill="#A9E9C6" />
        <circle cx="560" cy="290" r="8" fill="#FFC2A8" />
        <circle cx="510" cy="110" r="5" fill="#FFD54F" />
      </g>

      ${content}
    </svg>
    `;
  }

  // 1. Empty Cart
  const emptyCartContent = `
    <!-- Super friendly 3D Shopping Cart -->
    <g transform="translate(190, 110)" filter="url(#shadow)">
      <!-- Cart Basket Frame -->
      <rect x="50" y="70" width="240" height="170" rx="28" fill="white" />
      <rect x="58" y="78" width="224" height="154" rx="22" fill="#F6F9F8" stroke="#E1E9E5" stroke-width="3" />
      
      <!-- Basket Wire Grid -->
      <line x1="110" y1="90" x2="110" y2="210" stroke="#CDBCF7" stroke-width="4" stroke-linecap="round" opacity="0.4" />
      <line x1="170" y1="90" x2="170" y2="210" stroke="#CDBCF7" stroke-width="4" stroke-linecap="round" opacity="0.4" />
      <line x1="230" y1="90" x2="230" y2="210" stroke="#CDBCF7" stroke-width="4" stroke-linecap="round" opacity="0.4" />
      <line x1="70" y1="130" x2="270" y2="130" stroke="#CDBCF7" stroke-width="4" stroke-linecap="round" opacity="0.4" />
      <line x1="70" y1="170" x2="270" y2="170" stroke="#CDBCF7" stroke-width="4" stroke-linecap="round" opacity="0.4" />

      <!-- Cart Handle -->
      <path d="M40 90H10C6 90 2 86 2 82V64C2 60 6 56 10 56H48" stroke="#52645B" stroke-width="12" stroke-linecap="round" />
      
      <!-- Cart Chassis & Wheels -->
      <path d="M50 240L70 280H260L280 240" stroke="#33463D" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Left Wheel -->
      <circle cx="95" cy="305" r="26" fill="#33463D" />
      <circle cx="95" cy="305" r="14" fill="#00A65A" />
      <circle cx="95" cy="305" r="5" fill="white" />
      
      <!-- Right Wheel -->
      <circle cx="235" cy="305" r="26" fill="#33463D" />
      <circle cx="235" cy="305" r="14" fill="#00A65A" />
      <circle cx="235" cy="305" r="5" fill="white" />

      <!-- Floating gentle plant leaf inside -->
      <g transform="translate(130, 110)">
        <ellipse cx="40" cy="35" rx="35" ry="20" transform="rotate(-30 40 35)" fill="#6FD9A2" opacity="0.8" />
        <path d="M15 48Q40 35 65 22" stroke="white" stroke-width="3" stroke-linecap="round" />
      </g>
    </g>
  `;
  await sharp(Buffer.from(wrap(emptyCartContent, '#00A65A', '#FF6B35'))).png().toFile(path.join(illDir, 'empty-cart.png'));

  // 2. Empty Orders
  const emptyOrdersContent = `
    <!-- Cheerful Delivery Box with 10-Min Clock -->
    <g transform="translate(195, 110)" filter="url(#shadow)">
      <!-- Cardboard parcel box -->
      <path d="M165 40L295 105L165 170L35 105L165 40Z" fill="#F5A524" />
      <path d="M35 105L165 170V305L35 240V105Z" fill="#D98A0B" />
      <path d="M165 170L295 105V240L165 305V170Z" fill="#B77305" />
      
      <!-- Tape Strip -->
      <path d="M135 55L265 120L245 130L115 65Z" fill="#EEF3F1" opacity="0.8" />
      
      <!-- Turanto Smile on box side -->
      <path d="M80 185C95 210 135 210 150 185" stroke="white" stroke-width="6" stroke-linecap="round" fill="none" />
      <circle cx="75" cy="175" r="5" fill="white" />
      <circle cx="155" cy="175" r="5" fill="white" />

      <!-- Speed Clock Badge -->
      <g transform="translate(220, 190)" filter="url(#shadow)">
        <circle cx="45" cy="45" r="45" fill="white" />
        <circle cx="45" cy="45" r="38" fill="#EEFBF3" />
        <circle cx="45" cy="45" r="32" stroke="#00A65A" stroke-width="4" fill="none" />
        <polyline points="45,25 45,45 60,45" stroke="#00A65A" stroke-width="4" stroke-linecap="round" />
        <circle cx="45" cy="45" r="4" fill="#00A65A" />
      </g>
    </g>
  `;
  await sharp(Buffer.from(wrap(emptyOrdersContent, '#2F80ED', '#F5A524'))).png().toFile(path.join(illDir, 'empty-orders.png'));

  // 3. Empty Favorites
  const emptyFavoritesContent = `
    <!-- Big Glowing 3D Heart with Grocery Elements -->
    <g transform="translate(200, 100)" filter="url(#shadow)">
      <!-- Outer Heart Glow -->
      <path d="M160 80C160 30 110 0 65 0C25 0 0 35 0 80C0 170 160 270 160 270C160 270 320 170 320 80C320 35 295 0 255 0C210 0 160 30 160 80Z" fill="url(#secGrad)" />
      
      <!-- Inner Heart Highlight -->
      <path d="M160 95C160 55 120 28 85 28C50 28 30 55 30 92C30 165 160 245 160 245C160 245 290 165 290 92C290 55 270 28 235 28C200 28 160 55 160 95Z" fill="#FF8452" opacity="0.6" />
      
      <!-- White shine on top-left -->
      <path d="M55 45C70 35 90 35 105 40C90 48 70 55 55 45Z" fill="white" opacity="0.8" />

      <!-- Cute floating grocery basket tag -->
      <g transform="translate(90, 110)">
        <rect x="0" y="0" width="140" height="90" rx="20" fill="white" filter="url(#shadow)" />
        <text x="70" y="42" font-family="system-ui, sans-serif" font-size="28" text-anchor="middle">🍎🥛🥖</text>
        <text x="70" y="70" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#00A65A" text-anchor="middle">Save Favorites</text>
      </g>
    </g>
  `;
  await sharp(Buffer.from(wrap(emptyFavoritesContent, '#FF6B35', '#F5A524'))).png().toFile(path.join(illDir, 'empty-favorites.png'));

  // 4. Empty Search
  const emptySearchContent = `
    <!-- Modern Magnifying Glass with Fresh Produce Inside Lens -->
    <g transform="translate(190, 90)" filter="url(#shadow)">
      <!-- Handle -->
      <rect x="230" y="240" width="44" height="150" rx="22" transform="rotate(-45 230 240)" fill="#33463D" />
      <rect x="238" y="248" width="28" height="134" rx="14" transform="rotate(-45 238 248)" fill="#52645B" />

      <!-- Glass Rim -->
      <circle cx="160" cy="160" r="140" fill="#7C5CE0" />
      <circle cx="160" cy="160" r="115" fill="#EEE8FF" />
      <circle cx="160" cy="160" r="105" fill="white" />
      
      <!-- Reflection Arc -->
      <path d="M80 130A95 95 0 0 1 200 70" stroke="#CDBCF7" stroke-width="12" stroke-linecap="round" fill="none" />
      
      <!-- Question Mark / Fruit curiosity -->
      <text x="160" y="190" font-family="system-ui, sans-serif" font-size="100" font-weight="900" fill="#7C5CE0" text-anchor="middle">?</text>
      
      <!-- Sparkle -->
      <polygon points="270,60 275,75 290,80 275,85 270,100 265,85 250,80 265,75" fill="#F5A524" />
    </g>
  `;
  await sharp(Buffer.from(wrap(emptySearchContent, '#7C5CE0', '#2F80ED'))).png().toFile(path.join(illDir, 'empty-search.png'));

  // 5. Empty Addresses
  const emptyAddressesContent = `
    <!-- Location Pin with Cozy Home -->
    <g transform="translate(200, 90)" filter="url(#shadow)">
      <!-- Giant 3D Location Marker -->
      <path d="M160 30C88 30 30 88 30 160C30 250 160 370 160 370C160 370 290 250 290 160C290 88 232 30 160 30Z" fill="url(#primaryGrad)" />
      
      <!-- Inner White Circle -->
      <circle cx="160" cy="155" r="75" fill="white" />
      
      <!-- Cute House Icon inside Pin -->
      <g transform="translate(125, 115)">
        <polygon points="35,0 70,28 0,28" fill="#FF6B35" />
        <rect x="10" y="28" width="50" height="42" fill="#FFE7DC" />
        <rect x="25" y="44" width="20" height="26" rx="4" fill="#E14F1B" />
        <rect x="44" y="10" width="8" height="14" fill="#7A5206" />
      </g>

      <!-- Location Pin Pulse Rings -->
      <ellipse cx="160" cy="370" rx="60" ry="12" fill="#00A65A" opacity="0.3" />
    </g>
  `;
  await sharp(Buffer.from(wrap(emptyAddressesContent, '#00A65A', '#F5A524'))).png().toFile(path.join(illDir, 'empty-addresses.png'));

  // 6. Order Success
  const orderSuccessContent = `
    <!-- Celebratory Delivery Grocery Bag with Confetti -->
    <g transform="translate(180, 80)" filter="url(#shadow)">
      <!-- Grocery Paper Bag with Turanto Logo -->
      <path d="M60 140L80 340H280L300 140H60Z" fill="#F5A524" />
      <polygon points="60,140 80,120 280,120 300,140" fill="#D98A0B" />
      
      <!-- Bag Handles -->
      <path d="M120 120V70C120 50 140 30 180 30C220 30 240 50 240 70V120" stroke="#7A5206" stroke-width="12" stroke-linecap="round" fill="none" />
      
      <!-- Groceries peeking out -->
      <!-- Baguette -->
      <rect x="190" y="30" width="34" height="120" rx="17" transform="rotate(20 190 30)" fill="#FFD54F" stroke="#D98A0B" stroke-width="3" />
      <!-- Carrot with leafy top -->
      <polygon points="120,50 150,130 110,130" fill="#FF6B35" />
      <path d="M120 50C110 20 90 25 95 40" stroke="#00A65A" stroke-width="6" stroke-linecap="round" fill="none" />
      <path d="M120 50C125 15 140 20 135 38" stroke="#00A65A" stroke-width="6" stroke-linecap="round" fill="none" />
      <!-- Fresh Milk Carton -->
      <rect x="140" y="70" width="55" height="85" rx="8" fill="#E1EDFF" stroke="#2F80ED" stroke-width="3" />
      <polygon points="140,70 167,48 195,70" fill="#B9D3FF" />

      <!-- Big Checkmark Seal -->
      <g transform="translate(130, 200)" filter="url(#shadow)">
        <circle cx="50" cy="50" r="50" fill="#00A65A" />
        <circle cx="50" cy="50" r="42" fill="#00C853" />
        <polyline points="32,52 44,64 68,38" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>

      <!-- Confetti bursts -->
      <g opacity="0.9">
        <rect x="10" y="80" width="12" height="6" rx="3" transform="rotate(25 10 80)" fill="#FF6B35" />
        <rect x="330" y="100" width="14" height="6" rx="3" transform="rotate(-30 330 100)" fill="#7C5CE0" />
        <circle cx="40" cy="180" r="7" fill="#00A65A" />
        <circle cx="320" cy="220" r="6" fill="#F5A524" />
        <polygon points="310,50 315,65 330,70 315,75 310,90 305,75 290,70 305,65" fill="#FFD54F" />
        <polygon points="50,40 54,52 66,56 54,60 50,72 46,60 34,56 46,52" fill="#00A65A" />
      </g>
    </g>
  `;
  await sharp(Buffer.from(wrap(orderSuccessContent, '#00A65A', '#FF6B35'))).png().toFile(path.join(illDir, 'order-success.png'));

  // 7. Error State
  const errorStateContent = `
    <!-- Friendly Network / Plug Reconnection Graphic -->
    <g transform="translate(190, 100)" filter="url(#shadow)">
      <!-- Cloud with friendly expression -->
      <path d="M100 230H270C305 230 330 205 330 170C330 140 310 115 280 110C275 60 230 20 180 20C140 20 105 45 95 85C65 90 40 115 40 150C40 195 65 230 100 230Z" fill="white" />
      
      <!-- Sad / Puzzled Cloud Face -->
      <circle cx="140" cy="120" r="8" fill="#52645B" />
      <circle cx="210" cy="120" r="8" fill="#52645B" />
      <path d="M155 160C165 145 185 145 195 160" stroke="#52645B" stroke-width="5" stroke-linecap="round" fill="none" />

      <!-- Disconnected Cable / Refresh Badge -->
      <g transform="translate(125, 200)" filter="url(#shadow)">
        <circle cx="50" cy="50" r="45" fill="#FF6B35" />
        <!-- Rotating Arrows icon -->
        <path d="M35 50C35 41.7 41.7 35 50 35C55 35 59.5 37.5 62 41.5M65 35V43H57" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
        <path d="M65 50C65 58.3 58.3 65 50 65C45 65 40.5 62.5 38 58.5M35 65V57H43" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
    </g>
  `;
  await sharp(Buffer.from(wrap(errorStateContent, '#FF6B35', '#E5484D'))).png().toFile(path.join(illDir, 'error-state.png'));

  console.log('✓ All 7 illustrations generated.');
}

module.exports = { generateIllustrations };
