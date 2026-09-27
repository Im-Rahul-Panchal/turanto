const sharp = require('sharp');
const path = require('path');

async function generateCategories(imagesDir) {
  console.log('Generating Category assets...');
  const catDir = path.join(imagesDir, 'categories');

  function escapeXml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function createCategoryCard(name, fromColor, toColor, iconSvg) {
    return `
    <svg width="480" height="480" viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </linearGradient>
        <radialGradient id="pedestal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
        <filter id="cShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.12" />
        </filter>
      </defs>

      <!-- Smooth Rounded Card -->
      <rect width="480" height="480" rx="36" fill="url(#cGrad)" />
      
      <!-- Studio Light Glow -->
      <circle cx="240" cy="210" r="180" fill="url(#pedestal)" />
      
      <!-- Ground Shadow for Object -->
      <ellipse cx="240" cy="340" rx="140" ry="18" fill="rgba(0,0,0,0.12)" />

      <!-- Center Iconic Vector Artwork -->
      <g transform="translate(140, 100)" filter="url(#cShadow)">
        ${iconSvg}
      </g>

      <!-- Category Label Pill at Bottom -->
      <rect x="50" y="380" width="380" height="64" rx="20" fill="white" filter="url(#cShadow)" />
      <text x="240" y="422" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" fill="#12201A" text-anchor="middle">
        ${escapeXml(name)}
      </text>
    </svg>
    `;
  }

  const categoryConfigs = [
    {
      file: 'category-fruits-veg.png',
      name: 'Fruits & Vegetables',
      from: '#D5F5E3',
      to: '#A9E9C6',
      svg: `
        <!-- Broccoli & Carrot -->
        <g transform="translate(10, 20)">
          <!-- Carrot -->
          <polygon points="120,40 180,180 140,190" fill="#FF6B35" />
          <path d="M120 40Q135 15 150 10" stroke="#00A65A" stroke-width="8" stroke-linecap="round" fill="none" />
          <path d="M120 40Q110 10 100 15" stroke="#00A65A" stroke-width="6" stroke-linecap="round" fill="none" />
          <!-- Red Apple -->
          <circle cx="65" cy="120" r="55" fill="#E53935" />
          <path d="M65 65Q75 45 85 48" stroke="#5D4037" stroke-width="6" stroke-linecap="round" fill="none" />
          <ellipse cx="90" cy="52" rx="14" ry="8" transform="rotate(-20 90 52)" fill="#4CAF50" />
        </g>
      `,
    },
    {
      file: 'category-dairy-breakfast.png',
      name: 'Dairy & Breakfast',
      from: '#E1EDFF',
      to: '#B9D3FF',
      svg: `
        <g transform="translate(20, 20)">
          <!-- Milk Bottle -->
          <rect x="30" y="40" width="65" height="150" rx="14" fill="white" stroke="#2F80ED" stroke-width="4" />
          <rect x="42" y="10" width="40" height="30" rx="6" fill="#2F80ED" />
          <rect x="30" y="90" width="65" height="45" fill="#2F80ED" />
          <!-- Cheese Wedge -->
          <polygon points="100,120 180,120 160,180 80,180" fill="#FFD54F" />
          <circle cx="120" cy="140" r="8" fill="#FFB300" />
          <circle cx="145" cy="155" r="6" fill="#FFB300" />
        </g>
      `,
    },
    {
      file: 'category-bakery.png',
      name: 'Bakery & Bread',
      from: '#FFF1D6',
      to: '#FFD98A',
      svg: `
        <g transform="translate(10, 30)">
          <!-- Bread Loaf -->
          <path d="M30 70C30 30 70 10 110 10C150 10 190 30 190 70V140H30V70Z" fill="#D7CCC8" stroke="#8D6E63" stroke-width="5" />
          <line x1="70" y1="35" x2="80" y2="75" stroke="#8D6E63" stroke-width="6" stroke-linecap="round" />
          <line x1="110" y1="30" x2="115" y2="75" stroke="#8D6E63" stroke-width="6" stroke-linecap="round" />
          <line x1="150" y1="35" x2="145" y2="75" stroke="#8D6E63" stroke-width="6" stroke-linecap="round" />
          <!-- Cookie -->
          <circle cx="150" cy="145" r="35" fill="#D7A15C" />
          <circle cx="138" cy="135" r="5" fill="#5D4037" />
          <circle cx="162" cy="140" r="5" fill="#5D4037" />
          <circle cx="148" cy="158" r="4" fill="#5D4037" />
        </g>
      `,
    },
    {
      file: 'category-snacks.png',
      name: 'Snacks & Munchies',
      from: '#FFE7DC',
      to: '#FFC2A8',
      svg: `
        <g transform="translate(15, 20)">
          <!-- Potato Chips Bag -->
          <polygon points="30,40 130,20 110,180 10,160" fill="#FF6B35" />
          <polygon points="30,40 40,25 120,10 130,20" fill="#E14F1B" />
          <circle cx="70" cy="100" r="28" fill="#FFE082" />
          <!-- Chocolate Bar -->
          <rect x="110" y="60" width="75" height="110" rx="8" fill="#5D4037" />
          <rect x="115" y="65" width="30" height="40" rx="4" fill="#4E342E" />
          <rect x="150" y="65" width="30" height="40" rx="4" fill="#4E342E" />
          <rect x="115" y="110" width="30" height="40" rx="4" fill="#4E342E" />
          <rect x="150" y="110" width="30" height="40" rx="4" fill="#4E342E" />
        </g>
      `,
    },
    {
      file: 'category-beverages.png',
      name: 'Cold & Hot Drinks',
      from: '#EEE8FF',
      to: '#CDBCF7',
      svg: `
        <g transform="translate(20, 20)">
          <!-- Soda Can -->
          <rect x="30" y="45" width="60" height="135" rx="14" fill="#E53935" />
          <ellipse cx="60" cy="45" rx="30" ry="10" fill="#B0BEC5" />
          <!-- Hot Tea Cup -->
          <path d="M105 90C105 150 130 170 170 170C210 170 235 150 235 90H105Z" fill="#7C5CE0" />
          <ellipse cx="170" cy="90" rx="65" ry="16" fill="#5E35B1" />
          <ellipse cx="170" cy="90" rx="55" ry="12" fill="#8D6E63" />
          <!-- Handle -->
          <path d="M230 105C250 105 255 140 225 150" stroke="#7C5CE0" stroke-width="8" stroke-linecap="round" fill="none" />
        </g>
      `,
    },
    {
      file: 'category-instant-food.png',
      name: 'Instant Food',
      from: '#FFF1D6',
      to: '#FFD98A',
      svg: `
        <g transform="translate(10, 30)">
          <!-- Noodle Bowl -->
          <path d="M20 70C20 150 65 170 120 170C175 170 220 150 220 70H20Z" fill="#F57C00" />
          <ellipse cx="120" cy="70" rx="100" ry="24" fill="#FFA726" />
          <ellipse cx="120" cy="70" rx="90" ry="20" fill="#FFF59D" />
          <!-- Chopsticks -->
          <line x1="190" y1="20" x2="60" y2="90" stroke="#8D6E63" stroke-width="8" stroke-linecap="round" />
          <line x1="195" y1="35" x2="65" y2="105" stroke="#8D6E63" stroke-width="8" stroke-linecap="round" />
        </g>
      `,
    },
    {
      file: 'category-staples.png',
      name: 'Staples & Grains',
      from: '#D5F5E3',
      to: '#A9E9C6',
      svg: `
        <g transform="translate(20, 20)">
          <!-- Jute Grain Sack -->
          <path d="M30 70C30 40 70 30 110 30C150 30 190 40 190 70L180 180H40L30 70Z" fill="#A1887F" />
          <ellipse cx="110" cy="70" rx="75" ry="22" fill="#D7CCC8" />
          <ellipse cx="110" cy="70" rx="65" ry="16" fill="#FFF8E1" />
          <!-- Oil Flask in front -->
          <rect x="130" y="90" width="55" height="90" rx="12" fill="#FFD54F" stroke="#FFA000" stroke-width="4" />
          <rect x="145" y="70" width="25" height="20" rx="4" fill="#FFA000" />
        </g>
      `,
    },
    {
      file: 'category-household.png',
      name: 'Household & Home',
      from: '#E1EDFF',
      to: '#B9D3FF',
      svg: `
        <g transform="translate(25, 20)">
          <!-- Detergent Bottle -->
          <rect x="40" y="60" width="90" height="130" rx="18" fill="#00C853" />
          <path d="M85 30H105V60H85V30Z" fill="#007934" />
          <rect x="50" y="80" width="20" height="50" rx="8" fill="#1565C0" />
          <!-- Spray Bottle -->
          <rect x="120" y="90" width="60" height="100" rx="12" fill="#29B6F6" />
          <polygon points="100,75 140,75 140,90 120,90" fill="#37474F" />
          <circle cx="165" cy="55" r="10" fill="white" opacity="0.8" />
        </g>
      `,
    },
    {
      file: 'category-personal-care.png',
      name: 'Personal Care',
      from: '#EEE8FF',
      to: '#CDBCF7',
      svg: `
        <g transform="translate(30, 20)">
          <!-- Pump Dispenser Bottle -->
          <rect x="35" y="70" width="70" height="120" rx="16" fill="#7C5CE0" />
          <rect x="60" y="45" width="20" height="25" fill="#CDBCF7" />
          <path d="M40 35H85C95 35 100 40 100 45H40V35Z" fill="#512DA8" />
          <!-- Skincare Cream Tub -->
          <ellipse cx="140" cy="150" rx="45" ry="30" fill="#FF80AB" />
          <rect x="95" y="130" width="90" height="40" rx="10" fill="#FF4081" />
          <rect x="92" y="120" width="96" height="16" rx="6" fill="#F8BBD0" />
        </g>
      `,
    },
    {
      file: 'category-baby-care.png',
      name: 'Baby Care',
      from: '#FFE7DC',
      to: '#FFC2A8',
      svg: `
        <g transform="translate(30, 20)">
          <!-- Baby Bottle -->
          <rect x="35" y="60" width="65" height="125" rx="14" fill="#B3E5FC" stroke="#0288D1" stroke-width="4" />
          <rect x="42" y="40" width="50" height="20" rx="6" fill="#0288D1" />
          <polygon points="52,40 67,15 82,40" fill="#FFE082" />
          <!-- Soft Teddy Ear / Diaper shape -->
          <circle cx="140" cy="130" r="45" fill="#FFF9C4" />
          <circle cx="115" cy="95" r="16" fill="#FFF9C4" />
          <circle cx="165" cy="95" r="16" fill="#FFF9C4" />
          <circle cx="128" cy="125" r="5" fill="#5D4037" />
          <circle cx="152" cy="125" r="5" fill="#5D4037" />
          <ellipse cx="140" cy="140" rx="10" ry="7" fill="#FFA000" />
        </g>
      `,
    },
    {
      file: 'category-pet-care.png',
      name: 'Pet Care',
      from: '#CCF2EA',
      to: '#96E0D0',
      svg: `
        <g transform="translate(30, 20)">
          <!-- Pet Bowl -->
          <path d="M30 110C30 160 55 170 100 170C145 170 170 160 170 110H30Z" fill="#00897B" />
          <ellipse cx="100" cy="110" rx="70" ry="18" fill="#4DB6AC" />
          <!-- Big Paw Print -->
          <circle cx="100" cy="70" r="20" fill="#004D40" />
          <circle cx="70" cy="40" r="10" fill="#004D40" />
          <circle cx="90" cy="30" r="10" fill="#004D40" />
          <circle cx="110" cy="30" r="10" fill="#004D40" />
          <circle cx="130" cy="40" r="10" fill="#004D40" />
        </g>
      `,
    },
    {
      file: 'category-stationery.png',
      name: 'Stationery',
      from: '#FFF1D6',
      to: '#FFD98A',
      svg: `
        <g transform="translate(30, 20)">
          <!-- Notebook -->
          <rect x="30" y="30" width="110" height="150" rx="12" fill="#3949AB" />
          <rect x="30" y="30" width="22" height="150" rx="4" fill="#283593" />
          <line x1="60" y1="65" x2="120" y2="65" stroke="white" stroke-width="4" stroke-linecap="round" />
          <line x1="60" y1="90" x2="120" y2="90" stroke="white" stroke-width="4" stroke-linecap="round" />
          <line x1="60" y1="115" x2="105" y2="115" stroke="white" stroke-width="4" stroke-linecap="round" />
          <!-- Pencil -->
          <polygon points="120,40 180,140 160,150 105,50" fill="#FFB300" />
          <polygon points="105,50 120,40 100,20" fill="#FFE082" />
          <polygon points="100,20 95,15 98,25" fill="#212121" />
        </g>
      `,
    },
    {
      file: 'category-wellness.png',
      name: 'Wellness & Health',
      from: '#D5F5E3',
      to: '#A9E9C6',
      svg: `
        <g transform="translate(30, 20)">
          <!-- Capsule / Pill -->
          <g transform="rotate(35 90 90)">
            <rect x="40" y="50" width="50" height="100" rx="25" fill="#00E676" />
            <rect x="40" y="50" width="50" height="50" rx="25" fill="#00A65A" />
          </g>
          <!-- Health Cross Badge -->
          <circle cx="140" cy="120" r="38" fill="#E53935" />
          <rect x="133" y="98" width="14" height="44" rx="3" fill="white" />
          <rect x="118" y="113" width="44" height="14" rx="3" fill="white" />
        </g>
      `,
    },
    {
      file: 'category-home-care.png',
      name: 'Home Care',
      from: '#CCF2EA',
      to: '#96E0D0',
      svg: `
        <g transform="translate(30, 20)">
          <!-- Cozy House -->
          <polygon points="100,20 180,85 20,85" fill="#00897B" />
          <rect x="35" y="85" width="130" height="95" rx="8" fill="#E0F2F1" />
          <rect x="80" y="115" width="40" height="65" rx="6" fill="#004D40" />
          <circle cx="112" cy="150" r="4" fill="#FFD54F" />
          <!-- Sparkle of freshness -->
          <polygon points="180,30 183,40 195,43 183,46 180,56 177,46 165,43 177,40" fill="#FFD54F" />
        </g>
      `,
    },
  ];

  for (const cat of categoryConfigs) {
    const cardSvg = createCategoryCard(cat.name, cat.from, cat.to, cat.svg);
    await sharp(Buffer.from(cardSvg)).png().toFile(path.join(catDir, cat.file));
  }

  console.log(`✓ All ${categoryConfigs.length} categories generated.`);
}

module.exports = { generateCategories };
