const sharp = require('sharp');
const path = require('path');

// Generator for all 66 products
async function generateProducts(imagesDir) {
  console.log('Generating 66 realistic product assets...');
  const prodDir = path.join(imagesDir, 'products');

  function wrapProduct(name, tintColor, objectSvg) {
    return `
    <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pedestalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="${tintColor}" stop-opacity="0.22" />
          <stop offset="60%" stop-color="${tintColor}" stop-opacity="0.08" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
        <filter id="pShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#12201A" flood-opacity="0.14" />
        </filter>
        <filter id="innerDepth" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.1" />
        </filter>
      </defs>

      <!-- Crisp Clean Studio Background with soft radial warmth -->
      <rect width="600" height="600" rx="32" fill="#FFFFFF" />
      <circle cx="300" cy="290" r="260" fill="url(#pedestalGlow)" />

      <!-- Soft Ambient Ground Shadow -->
      <ellipse cx="300" cy="460" rx="190" ry="24" fill="#E8EFEB" />
      <ellipse cx="300" cy="460" rx="130" ry="14" fill="#C8D4CE" opacity="0.7" />

      <!-- Center Product Graphic -->
      <g transform="translate(150, 110)" filter="url(#pShadow)">
        ${objectSvg}
      </g>
    </svg>
    `;
  }

  // Define unique graphic for every product
  const products = [
    // 1-12 Fruits & Veg
    {
      file: 'product-tomato.png',
      name: 'Tomato',
      tint: '#FF6B35',
      svg: `
        <circle cx="150" cy="180" r="115" fill="#E53935" />
        <circle cx="170" cy="170" r="95" fill="#C62828" opacity="0.4" />
        <path d="M150 70Q145 35 155 30" stroke="#388E3C" stroke-width="12" stroke-linecap="round" fill="none" />
        <!-- Calyx leaves -->
        <polygon points="150,70 120,50 135,75" fill="#4CAF50" />
        <polygon points="150,70 180,50 165,75" fill="#4CAF50" />
        <polygon points="150,70 130,95 145,80" fill="#4CAF50" />
        <polygon points="150,70 170,95 155,80" fill="#4CAF50" />
        <!-- Gloss shine -->
        <ellipse cx="105" cy="140" rx="20" ry="40" transform="rotate(-30 105 140)" fill="white" opacity="0.4" />
      `,
    },
    {
      file: 'product-onion.png',
      name: 'Onion',
      tint: '#BA68C8',
      svg: `
        <!-- Onion Bulb -->
        <path d="M150 40C80 90 60 170 80 230C100 280 200 280 220 230C240 170 220 90 150 40Z" fill="#AB47BC" />
        <path d="M150 45C90 95 75 170 95 225C110 270 190 270 205 225C225 170 210 95 150 45Z" fill="#8E24AA" opacity="0.6" />
        <!-- Root fibers -->
        <line x1="140" y1="260" x2="135" y2="290" stroke="#8D6E63" stroke-width="4" stroke-linecap="round" />
        <line x1="150" y1="265" x2="150" y2="295" stroke="#8D6E63" stroke-width="4" stroke-linecap="round" />
        <line x1="160" y1="260" x2="165" y2="290" stroke="#8D6E63" stroke-width="4" stroke-linecap="round" />
        <!-- Sprout top -->
        <path d="M150 40L145 10" stroke="#689F38" stroke-width="8" stroke-linecap="round" />
      `,
    },
    {
      file: 'product-potato.png',
      name: 'Potato',
      tint: '#D7CCC8',
      svg: `
        <ellipse cx="150" cy="180" rx="130" ry="95" fill="#BCAAA4" />
        <ellipse cx="150" cy="180" rx="115" ry="80" fill="#A1887F" opacity="0.5" />
        <!-- Potato eyes -->
        <ellipse cx="90" cy="150" rx="6" ry="3" fill="#6D4C41" />
        <ellipse cx="170" cy="130" rx="8" ry="4" fill="#6D4C41" />
        <ellipse cx="210" cy="180" rx="7" ry="3" fill="#6D4C41" />
        <ellipse cx="130" cy="210" rx="6" ry="3" fill="#6D4C41" />
        <ellipse cx="80" cy="200" rx="5" ry="3" fill="#6D4C41" />
      `,
    },
    {
      file: 'product-carrot.png',
      name: 'Carrot',
      tint: '#FF6B35',
      svg: `
        <!-- Slanted Crunchy Carrot -->
        <polygon points="120,60 180,60 160,280 140,280" fill="#FF7043" />
        <polygon points="120,60 150,60 140,280" fill="#F4511E" />
        <!-- Horizontal ridges -->
        <line x1="125" y1="110" x2="155" y2="110" stroke="#BF360C" stroke-width="4" stroke-linecap="round" />
        <line x1="140" y1="160" x2="170" y2="160" stroke="#BF360C" stroke-width="4" stroke-linecap="round" />
        <line x1="135" y1="210" x2="160" y2="210" stroke="#BF360C" stroke-width="3" stroke-linecap="round" />
        <!-- Lush Green Foliage top -->
        <path d="M140 60C120 20 80 15 70 30" stroke="#4CAF50" stroke-width="8" stroke-linecap="round" fill="none" />
        <path d="M150 60C150 15 150 5 150 0" stroke="#4CAF50" stroke-width="8" stroke-linecap="round" fill="none" />
        <path d="M160 60C180 20 220 15 230 30" stroke="#4CAF50" stroke-width="8" stroke-linecap="round" fill="none" />
      `,
    },
    {
      file: 'product-capsicum.png',
      name: 'Capsicum',
      tint: '#66BB6A',
      svg: `
        <!-- Green Bell Pepper -->
        <path d="M70 120C70 80 110 70 150 70C190 70 230 80 230 120C230 200 200 250 150 250C100 250 70 200 70 120Z" fill="#43A047" />
        <!-- Pepper lobes -->
        <ellipse cx="110" cy="150" rx="35" ry="70" fill="#4CAF50" />
        <ellipse cx="150" cy="155" rx="35" ry="75" fill="#388E3C" />
        <ellipse cx="190" cy="150" rx="35" ry="70" fill="#2E7D32" />
        <!-- Stem -->
        <path d="M150 70C150 40 170 30 180 25" stroke="#1B5E20" stroke-width="12" stroke-linecap="round" fill="none" />
      `,
    },
    {
      file: 'product-spinach.png',
      name: 'Spinach',
      tint: '#4CAF50',
      svg: `
        <!-- Bunch of crisp palak / spinach leaves -->
        <g transform="translate(40, 20)">
          <!-- Back leaves -->
          <ellipse cx="110" cy="130" rx="60" ry="100" transform="rotate(-25 110 130)" fill="#2E7D32" />
          <ellipse cx="150" cy="120" rx="60" ry="100" transform="rotate(25 150 120)" fill="#388E3C" />
          <!-- Front leaf -->
          <ellipse cx="130" cy="150" rx="70" ry="110" fill="#43A047" />
          <!-- Veins -->
          <line x1="130" y1="70" x2="130" y2="270" stroke="#81C784" stroke-width="6" stroke-linecap="round" />
          <line x1="130" y1="130" x2="95" y2="100" stroke="#81C784" stroke-width="4" stroke-linecap="round" />
          <line x1="130" y1="160" x2="165" y2="130" stroke="#81C784" stroke-width="4" stroke-linecap="round" />
          <line x1="130" y1="200" x2="100" y2="175" stroke="#81C784" stroke-width="4" stroke-linecap="round" />
        </g>
      `,
    },
    {
      file: 'product-apple.png',
      name: 'Apple',
      tint: '#E53935',
      svg: `
        <circle cx="120" cy="160" r="85" fill="#E53935" />
        <circle cx="170" cy="160" r="85" fill="#C62828" />
        <path d="M145 85Q155 45 175 40" stroke="#5D4037" stroke-width="10" stroke-linecap="round" fill="none" />
        <ellipse cx="185" cy="50" rx="24" ry="12" transform="rotate(-20 185 50)" fill="#4CAF50" />
        <ellipse cx="95" cy="130" rx="15" ry="35" transform="rotate(-25 95 130)" fill="white" opacity="0.4" />
      `,
    },
    {
      file: 'product-banana.png',
      name: 'Banana',
      tint: '#FFD54F',
      svg: `
        <!-- Bunch of 2 ripe golden bananas -->
        <path d="M60 90C120 70 210 110 240 230C220 220 140 180 60 90Z" fill="#FDD835" />
        <path d="M70 120C130 100 210 140 230 250C210 240 140 200 70 120Z" fill="#FFEE58" />
        <!-- Crown tip -->
        <polygon points="50,85 70,85 65,115 45,115" fill="#689F38" />
        <!-- Brown tips -->
        <circle cx="230" cy="248" r="6" fill="#5D4037" />
      `,
    },
    {
      file: 'product-mango.png',
      name: 'Mango',
      tint: '#FFA000',
      svg: `
        <path d="M120 70C200 40 240 110 230 190C220 260 140 270 90 220C40 170 60 90 120 70Z" fill="#FFB300" />
        <path d="M125 75C195 48 230 112 222 185C212 248 142 258 98 212C55 168 70 95 125 75Z" fill="#FFA000" opacity="0.6" />
        <!-- Red blush on shoulder -->
        <ellipse cx="170" cy="110" rx="35" ry="25" fill="#FF5722" opacity="0.5" />
        <path d="M120 70Q110 40 100 35" stroke="#5D4037" stroke-width="8" stroke-linecap="round" fill="none" />
      `,
    },
    {
      file: 'product-orange.png',
      name: 'Orange',
      tint: '#FF9800',
      svg: `
        <circle cx="150" cy="160" r="105" fill="#FB8C00" />
        <circle cx="170" cy="160" r="95" fill="#F57C00" opacity="0.5" />
        <circle cx="150" cy="60" r="10" fill="#388E3C" />
        <ellipse cx="110" cy="120" rx="16" ry="32" transform="rotate(-30 110 120)" fill="white" opacity="0.3" />
      `,
    },
    {
      file: 'product-grapes.png',
      name: 'Grapes',
      tint: '#7B1FA2',
      svg: `
        <!-- Bunch of dark purple juicy grapes -->
        <g transform="translate(60, 40)">
          <!-- Stem -->
          <path d="M90 20Q90 50 90 70" stroke="#689F38" stroke-width="10" stroke-linecap="round" fill="none" />
          <ellipse cx="60" cy="30" rx="25" ry="15" fill="#4CAF50" />
          <!-- Row 1 -->
          <circle cx="60" cy="80" r="24" fill="#6A1B9A" />
          <circle cx="95" cy="80" r="24" fill="#7B1FA2" />
          <circle cx="130" cy="80" r="24" fill="#8E24AA" />
          <!-- Row 2 -->
          <circle cx="45" cy="115" r="24" fill="#4A148C" />
          <circle cx="80" cy="115" r="24" fill="#6A1B9A" />
          <circle cx="115" cy="115" r="24" fill="#7B1FA2" />
          <circle cx="150" cy="115" r="24" fill="#8E24AA" />
          <!-- Row 3 -->
          <circle cx="65" cy="150" r="24" fill="#4A148C" />
          <circle cx="100" cy="150" r="24" fill="#6A1B9A" />
          <circle cx="135" cy="150" r="24" fill="#7B1FA2" />
          <!-- Row 4 -->
          <circle cx="80" cy="185" r="22" fill="#4A148C" />
          <circle cx="115" cy="185" r="22" fill="#6A1B9A" />
          <!-- Bottom grape -->
          <circle cx="98" cy="218" r="20" fill="#4A148C" />
        </g>
      `,
    },
    {
      file: 'product-pomegranate.png',
      name: 'Pomegranate',
      tint: '#C2185B',
      svg: `
        <circle cx="150" cy="170" r="105" fill="#C2185B" />
        <circle cx="170" cy="170" r="95" fill="#880E4F" opacity="0.4" />
        <!-- Crown on top -->
        <polygon points="135,70 142,45 150,65 158,45 165,70" fill="#880E4F" />
        <!-- Little cut window showing arils/seeds -->
        <ellipse cx="120" cy="150" rx="35" ry="25" fill="#880E4F" />
        <circle cx="110" cy="145" r="6" fill="#FF80AB" />
        <circle cx="125" cy="145" r="6" fill="#FF80AB" />
        <circle cx="118" cy="158" r="6" fill="#FF80AB" />
      `,
    },

    // 13-21 Dairy & Bakery
    {
      file: 'product-milk.png',
      name: 'Milk',
      tint: '#2196F3',
      svg: `
        <!-- Modern Milk Pouch / Bottle -->
        <rect x="80" y="70" width="140" height="200" rx="24" fill="#F5F5F5" stroke="#E0E0E0" stroke-width="4" />
        <rect x="80" y="130" width="140" height="90" fill="#1976D2" />
        <text x="150" y="180" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="white" text-anchor="middle">MILK</text>
        <text x="150" y="202" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#BBDEFB" text-anchor="middle">500 ml · Pure Cow</text>
        <polygon points="120,40 180,40 170,70 130,70" fill="#1976D2" />
      `,
    },
    {
      file: 'product-curd.png',
      name: 'Curd',
      tint: '#03A9F4',
      svg: `
        <!-- Curd / Dahi Tub -->
        <polygon points="70,100 230,100 210,240 90,240" fill="#E1F5FE" stroke="#0288D1" stroke-width="4" />
        <ellipse cx="150" cy="100" rx="80" ry="22" fill="#0288D1" />
        <text x="150" y="170" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#01579B" text-anchor="middle">DAHI</text>
        <text x="150" y="195" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#0288D1" text-anchor="middle">Fresh Set Curd · 400g</text>
      `,
    },
    {
      file: 'product-paneer.png',
      name: 'Paneer',
      tint: '#4CAF50',
      svg: `
        <!-- Fresh Paneer Block in sealed pack -->
        <rect x="60" y="80" width="180" height="150" rx="14" fill="#FFFFFF" stroke="#00A65A" stroke-width="4" />
        <rect x="75" y="95" width="150" height="120" rx="8" fill="#F1F8E9" />
        <text x="150" y="150" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#2E7D32" text-anchor="middle">PANEER</text>
        <text x="150" y="175" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#558B2F" text-anchor="middle">Malai Soft · 200g</text>
      `,
    },
    {
      file: 'product-butter.png',
      name: 'Butter',
      tint: '#FBC02D',
      svg: `
        <!-- Golden Butter Pack -->
        <polygon points="60,110 180,60 240,90 120,140" fill="#FFF59D" />
        <polygon points="60,110 120,140 120,230 60,200" fill="#FBC02D" />
        <polygon points="120,140 240,90 240,180 120,230" fill="#F57F17" />
        <text x="180" y="150" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="white">BUTTER</text>
      `,
    },
    {
      file: 'product-cheese.png',
      name: 'Cheese',
      tint: '#FFA000',
      svg: `
        <!-- Cheese Slice Pack / Block -->
        <polygon points="50,160 170,90 250,150 130,220" fill="#FFE082" />
        <polygon points="50,160 130,220 130,240 50,180" fill="#FFA000" />
        <polygon points="130,220 250,150 250,170 130,240" fill="#FF8F00" />
        <circle cx="120" cy="140" r="14" fill="#FFB300" />
        <circle cx="170" cy="130" r="10" fill="#FFB300" />
        <circle cx="190" cy="170" r="12" fill="#FFB300" />
      `,
    },
    {
      file: 'product-bread.png',
      name: 'Bread',
      tint: '#A1887F',
      svg: `
        <!-- Bread Loaf in transparent wrapper -->
        <path d="M60 110C60 70 100 50 150 50C200 50 240 70 240 110V220H60V110Z" fill="#D7CCC8" stroke="#8D6E63" stroke-width="4" />
        <!-- Slices -->
        <line x1="95" y1="65" x2="95" y2="220" stroke="#8D6E63" stroke-width="3" stroke-dasharray="6 4" />
        <line x1="130" y1="55" x2="130" y2="220" stroke="#8D6E63" stroke-width="3" stroke-dasharray="6 4" />
        <line x1="165" y1="55" x2="165" y2="220" stroke="#8D6E63" stroke-width="3" stroke-dasharray="6 4" />
        <line x1="200" y1="65" x2="200" y2="220" stroke="#8D6E63" stroke-width="3" stroke-dasharray="6 4" />
        <rect x="75" y="140" width="150" height="45" rx="8" fill="#F57C00" />
        <text x="150" y="170" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="white" text-anchor="middle">WHOLE WHEAT</text>
      `,
    },
    {
      file: 'product-bun.png',
      name: 'Bun',
      tint: '#D7CCC8',
      svg: `
        <!-- 2 Soft Golden Burger Buns -->
        <ellipse cx="150" cy="150" rx="90" ry="60" fill="#D7A15C" />
        <ellipse cx="150" cy="180" rx="90" ry="30" fill="#BCAAA4" />
        <!-- Sesame seeds -->
        <circle cx="120" cy="130" r="3" fill="#FFF8E1" />
        <circle cx="150" cy="120" r="3" fill="#FFF8E1" />
        <circle cx="180" cy="135" r="3" fill="#FFF8E1" />
        <circle cx="135" cy="145" r="3" fill="#FFF8E1" />
        <circle cx="165" cy="145" r="3" fill="#FFF8E1" />
      `,
    },
    {
      file: 'product-rusk.png',
      name: 'Rusk',
      tint: '#D7A15C',
      svg: `
        <!-- Crispy Elaichi Rusk pieces -->
        <rect x="70" y="80" width="140" height="150" rx="18" fill="#D7A15C" stroke="#A1887F" stroke-width="4" />
        <rect x="85" y="95" width="110" height="120" rx="10" fill="#E6B87E" />
        <text x="140" y="160" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="#5D4037" text-anchor="middle">RUSK</text>
      `,
    },
    {
      file: 'product-cake.png',
      name: 'Cake',
      tint: '#EC407A',
      svg: `
        <!-- Slice of chocolate / strawberry cake -->
        <polygon points="60,180 150,70 240,180" fill="#4E342E" />
        <rect x="60" y="180" width="180" height="40" fill="#3E2723" />
        <line x1="60" y1="180" x2="240" y2="180" stroke="#FF4081" stroke-width="8" />
        <circle cx="150" cy="65" r="14" fill="#D81B60" />
      `,
    },

    // 22-26 Snacks
    {
      file: 'product-chips.png',
      name: 'Chips',
      tint: '#FF5722',
      svg: `
        <!-- Bright potato chips bag -->
        <polygon points="70,60 230,40 210,230 50,210" fill="#00A65A" />
        <polygon points="70,60 80,45 220,25 230,40" fill="#046B3C" />
        <circle cx="140" cy="130" r="45" fill="#FFD54F" />
        <text x="140" y="138" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#E65100" text-anchor="middle">CHIPS</text>
      `,
    },
    {
      file: 'product-namkeen.png',
      name: 'Namkeen',
      tint: '#FFA000',
      svg: `
        <polygon points="60,60 220,50 210,230 70,220" fill="#F57C00" />
        <rect x="80" y="120" width="120" height="50" rx="8" fill="#FFF3E0" />
        <text x="140" y="152" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#E65100" text-anchor="middle">BHUJIA</text>
      `,
    },
    {
      file: 'product-biscuits.png',
      name: 'Biscuits',
      tint: '#FFB300',
      svg: `
        <rect x="60" y="100" width="180" height="85" rx="14" fill="#FBC02D" stroke="#F57F17" stroke-width="4" />
        <text x="150" y="150" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#E65100" text-anchor="middle">GLUCOSE</text>
      `,
    },
    {
      file: 'product-chocolate.png',
      name: 'Chocolate',
      tint: '#5D4037',
      svg: `
        <rect x="70" y="60" width="160" height="170" rx="12" fill="#3E2723" />
        <rect x="70" y="60" width="160" height="70" rx="12" fill="#7C5CE0" />
        <text x="150" y="105" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">CHOCO</text>
      `,
    },
    {
      file: 'product-almonds.png',
      name: 'Almonds',
      tint: '#8D6E63',
      svg: `
        <!-- Zip pouch of almonds -->
        <rect x="70" y="70" width="160" height="180" rx="16" fill="#8D6E63" />
        <rect x="90" y="130" width="120" height="80" rx="8" fill="#FFF8E1" />
        <text x="150" y="175" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#5D4037" text-anchor="middle">BADAM</text>
      `,
    },

    // 27-32 Beverages
    {
      file: 'product-tea.png',
      name: 'Tea',
      tint: '#388E3C',
      svg: `
        <rect x="70" y="60" width="160" height="190" rx="14" fill="#2E7D32" />
        <circle cx="150" cy="140" r="45" fill="#A5D6A7" />
        <text x="150" y="148" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="#1B5E20" text-anchor="middle">CHAI</text>
      `,
    },
    {
      file: 'product-coffee.png',
      name: 'Coffee',
      tint: '#4E342E',
      svg: `
        <!-- Glass Jar of Coffee -->
        <rect x="85" y="70" width="130" height="180" rx="20" fill="#4E342E" stroke="#8D6E63" stroke-width="4" />
        <rect x="100" y="40" width="100" height="30" rx="8" fill="#D7CCC8" />
        <rect x="95" y="120" width="110" height="70" rx="8" fill="#D7CCC8" />
        <text x="150" y="162" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#3E2723" text-anchor="middle">COFFEE</text>
      `,
    },
    {
      file: 'product-juice.png',
      name: 'Juice',
      tint: '#FF9800',
      svg: `
        <rect x="80" y="60" width="140" height="190" rx="14" fill="#FB8C00" />
        <polygon points="120,40 180,40 165,60 135,60" fill="#FFF3E0" />
        <circle cx="150" cy="140" r="35" fill="white" />
        <text x="150" y="147" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#E65100" text-anchor="middle">JUICE</text>
      `,
    },
    {
      file: 'product-cola.png',
      name: 'Cola',
      tint: '#D32F2F',
      svg: `
        <rect x="100" y="60" width="100" height="190" rx="20" fill="#B71C1C" />
        <ellipse cx="150" cy="60" rx="50" ry="14" fill="#CFD8DC" />
        <rect x="100" y="120" width="100" height="60" fill="#D32F2F" />
        <text x="150" y="158" font-family="system-ui, sans-serif" font-size="24" font-weight="900" fill="white" text-anchor="middle">COLA</text>
      `,
    },
    {
      file: 'product-water.png',
      name: 'Water',
      tint: '#03A9F4',
      svg: `
        <rect x="100" y="70" width="100" height="180" rx="18" fill="#E1F5FE" stroke="#0288D1" stroke-width="4" />
        <rect x="125" y="40" width="50" height="30" rx="6" fill="#0288D1" />
        <rect x="100" y="130" width="100" height="60" fill="#0288D1" />
        <text x="150" y="168" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">AQUA</text>
      `,
    },
    {
      file: 'product-energy-drink.png',
      name: 'Energy Drink',
      tint: '#7C5CE0',
      svg: `
        <rect x="105" y="55" width="90" height="195" rx="16" fill="#212121" />
        <ellipse cx="150" cy="55" rx="45" ry="12" fill="#B0BEC5" />
        <polygon points="155,90 130,150 150,150 140,195 175,135 150,135" fill="#FFEB3B" />
      `,
    },

    // 33-35 Instant Food
    {
      file: 'product-noodles.png',
      name: 'Noodles',
      tint: '#FBC02D',
      svg: `
        <rect x="60" y="70" width="180" height="170" rx="16" fill="#FBC02D" />
        <circle cx="150" cy="140" r="45" fill="#D32F2F" />
        <text x="150" y="148" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">2-MIN</text>
      `,
    },
    {
      file: 'product-pasta.png',
      name: 'Pasta',
      tint: '#FFA726',
      svg: `
        <rect x="65" y="65" width="170" height="180" rx="16" fill="#1565C0" />
        <rect x="85" y="125" width="130" height="70" rx="10" fill="#FFE082" />
        <text x="150" y="168" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#E65100" text-anchor="middle">PASTA</text>
      `,
    },
    {
      file: 'product-sauce.png',
      name: 'Sauce',
      tint: '#D32F2F',
      svg: `
        <!-- Glass Ketchup Bottle -->
        <polygon points="120,40 180,40 200,90 190,240 110,240 100,90" fill="#D32F2F" />
        <rect x="130" y="20" width="40" height="20" fill="#388E3C" />
        <circle cx="150" cy="150" r="35" fill="white" />
        <text x="150" y="156" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#D32F2F" text-anchor="middle">SAUCE</text>
      `,
    },

    // 36-41 Staples
    {
      file: 'product-oil.png',
      name: 'Oil',
      tint: '#FFB300',
      svg: `
        <rect x="90" y="80" width="120" height="170" rx="18" fill="#FFF176" stroke="#FBC02D" stroke-width="4" />
        <rect x="125" y="50" width="50" height="30" rx="6" fill="#F57F17" />
        <circle cx="150" cy="150" r="35" fill="#F57F17" />
        <text x="150" y="156" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="white" text-anchor="middle">OIL</text>
      `,
    },
    {
      file: 'product-rice.png',
      name: 'Rice',
      tint: '#81C784',
      svg: `
        <rect x="65" y="65" width="170" height="180" rx="20" fill="#2E7D32" />
        <rect x="85" y="115" width="130" height="80" rx="8" fill="#FFFFFF" />
        <text x="150" y="162" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#1B5E20" text-anchor="middle">BASMATI</text>
      `,
    },
    {
      file: 'product-atta.png',
      name: 'Atta',
      tint: '#D7CCC8',
      svg: `
        <rect x="65" y="65" width="170" height="180" rx="18" fill="#F57C00" />
        <circle cx="150" cy="145" r="45" fill="white" />
        <text x="150" y="152" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#E65100" text-anchor="middle">ATTA</text>
      `,
    },
    {
      file: 'product-sugar.png',
      name: 'Sugar',
      tint: '#90CAF9',
      svg: `
        <rect x="65" y="65" width="170" height="180" rx="18" fill="#E3F2FD" stroke="#1E88E5" stroke-width="4" />
        <text x="150" y="162" font-family="system-ui, sans-serif" font-size="26" font-weight="900" fill="#1565C0" text-anchor="middle">SUGAR</text>
      `,
    },
    {
      file: 'product-salt.png',
      name: 'Salt',
      tint: '#64B5F6',
      svg: `
        <rect x="65" y="65" width="170" height="180" rx="18" fill="#1976D2" />
        <circle cx="150" cy="140" r="40" fill="white" />
        <text x="150" y="148" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#0D47A1" text-anchor="middle">SALT</text>
      `,
    },
    {
      file: 'product-dal.png',
      name: 'Dal',
      tint: '#FFB74D',
      svg: `
        <rect x="65" y="65" width="170" height="180" rx="18" fill="#F57F17" />
        <rect x="85" y="125" width="130" height="70" rx="8" fill="#FFF9C4" />
        <text x="150" y="168" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="#E65100" text-anchor="middle">TOOR DAL</text>
      `,
    },

    // 42-46 Cleaning & Household
    {
      file: 'product-detergent.png',
      name: 'Detergent',
      tint: '#1E88E5',
      svg: `
        <rect x="70" y="65" width="160" height="180" rx="18" fill="#0D47A1" />
        <polygon points="150,90 180,140 120,140" fill="#FF5252" />
        <text x="150" y="195" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">WASH</text>
      `,
    },
    {
      file: 'product-dishwash.png',
      name: 'Dishwash',
      tint: '#00E676',
      svg: `
        <rect x="100" y="70" width="100" height="180" rx="20" fill="#00C853" />
        <rect x="120" y="40" width="60" height="30" rx="6" fill="#FDD835" />
        <text x="150" y="165" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="white" text-anchor="middle">GEL</text>
      `,
    },
    {
      file: 'product-floor-cleaner.png',
      name: 'Floor Cleaner',
      tint: '#FF6D00',
      svg: `
        <rect x="90" y="65" width="120" height="185" rx="22" fill="#E65100" />
        <circle cx="150" cy="150" r="32" fill="white" />
        <text x="150" y="156" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#E65100" text-anchor="middle">SHINE</text>
      `,
    },
    {
      file: 'product-toilet-cleaner.png',
      name: 'Toilet Cleaner',
      tint: '#1565C0',
      svg: `
        <!-- Bent Neck Bottle -->
        <path d="M120 40H160L180 80L175 240H115L110 80L120 40Z" fill="#0D47A1" />
        <rect x="130" y="20" width="30" height="20" rx="4" fill="#D50000" />
      `,
    },
    {
      file: 'product-mosquito-repellent.png',
      name: 'Mosquito Repellent',
      tint: '#2E7D32',
      svg: `
        <rect x="100" y="80" width="100" height="150" rx="16" fill="#388E3C" />
        <rect x="125" y="50" width="50" height="30" rx="8" fill="#C8E6C9" />
        <circle cx="150" cy="140" r="28" fill="#F44336" />
        <line x1="130" y1="140" x2="170" y2="140" stroke="white" stroke-width="6" />
      `,
    },

    // 47-51 Personal Care
    {
      file: 'product-soap.png',
      name: 'Soap',
      tint: '#80CBC4',
      svg: `
        <rect x="70" y="100" width="160" height="100" rx="28" fill="#80CBC4" stroke="#00897B" stroke-width="4" />
        <ellipse cx="150" cy="150" rx="55" ry="30" fill="#E0F2F1" />
        <text x="150" y="156" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#004D40" text-anchor="middle">SOAP</text>
      `,
    },
    {
      file: 'product-shampoo.png',
      name: 'Shampoo',
      tint: '#7C5CE0',
      svg: `
        <rect x="100" y="60" width="100" height="190" rx="24" fill="#6A1B9A" />
        <rect x="115" y="35" width="70" height="25" rx="6" fill="#CE93D8" />
        <text x="150" y="150" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="white" text-anchor="middle">SHAMPOO</text>
      `,
    },
    {
      file: 'product-toothpaste.png',
      name: 'Toothpaste',
      tint: '#E53935',
      svg: `
        <polygon points="60,110 220,110 240,140 220,170 60,170" fill="#D32F2F" />
        <rect x="40" y="125" width="20" height="30" fill="white" />
        <text x="150" y="148" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="white" text-anchor="middle">DENTAL</text>
      `,
    },
    {
      file: 'product-deodorant.png',
      name: 'Deodorant',
      tint: '#0288D1',
      svg: `
        <rect x="105" y="70" width="90" height="180" rx="20" fill="#0288D1" />
        <rect x="105" y="40" width="90" height="30" rx="8" fill="#37474F" />
        <text x="150" y="155" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="white" text-anchor="middle">FRESH</text>
      `,
    },
    {
      file: 'product-lotion.png',
      name: 'Lotion',
      tint: '#F48FB1',
      svg: `
        <rect x="95" y="70" width="110" height="180" rx="20" fill="#F8BBD0" stroke="#F06292" stroke-width="4" />
        <rect x="135" y="40" width="30" height="30" fill="#F06292" />
        <text x="150" y="160" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#AD1457" text-anchor="middle">LOTION</text>
      `,
    },

    // 52-55 Baby Care
    {
      file: 'product-baby-milk.png',
      name: 'Baby Milk',
      tint: '#81D4FA',
      svg: `
        <rect x="80" y="70" width="140" height="180" rx="20" fill="#E1F5FE" stroke="#0288D1" stroke-width="4" />
        <circle cx="150" cy="150" r="35" fill="#FFE082" />
        <text x="150" y="156" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#0277BD" text-anchor="middle">BABY</text>
      `,
    },
    {
      file: 'product-diapers.png',
      name: 'Diapers',
      tint: '#B39DDB',
      svg: `
        <rect x="70" y="70" width="160" height="170" rx="20" fill="#7E57C2" />
        <rect x="90" y="120" width="120" height="60" rx="8" fill="white" />
        <text x="150" y="156" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#512DA8" text-anchor="middle">DIAPERS</text>
      `,
    },
    {
      file: 'product-baby-soap.png',
      name: 'Baby Soap',
      tint: '#FFE082',
      svg: `
        <rect x="75" y="90" width="150" height="110" rx="24" fill="#FFF9C4" stroke="#FBC02D" stroke-width="4" />
        <text x="150" y="152" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#F57F17" text-anchor="middle">GENTLE</text>
      `,
    },
    {
      file: 'product-baby-food.png',
      name: 'Baby Food',
      tint: '#FFCC80',
      svg: `
        <polygon points="80,100 220,100 200,230 100,230" fill="#FFE0B2" stroke="#FB8C00" stroke-width="4" />
        <ellipse cx="150" cy="100" rx="70" ry="20" fill="#FFA726" />
        <text x="150" y="165" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#E65100" text-anchor="middle">PUREE</text>
      `,
    },

    // 56-57 Pet Care
    {
      file: 'product-pet-food.png',
      name: 'Pet Food',
      tint: '#80CBC4',
      svg: `
        <polygon points="70,70 230,70 210,240 90,240" fill="#00897B" />
        <circle cx="150" cy="140" r="30" fill="#FFF9C4" />
        <!-- Paw Print -->
        <circle cx="150" cy="145" r="10" fill="#004D40" />
        <circle cx="138" cy="130" r="5" fill="#004D40" />
        <circle cx="150" cy="125" r="5" fill="#004D40" />
        <circle cx="162" cy="130" r="5" fill="#004D40" />
      `,
    },
    {
      file: 'product-pet-shampoo.png',
      name: 'Pet Shampoo',
      tint: '#4DB6AC',
      svg: `
        <rect x="100" y="70" width="100" height="180" rx="20" fill="#26A69A" />
        <circle cx="150" cy="145" r="25" fill="white" />
        <text x="150" y="152" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#004D40" text-anchor="middle">PET</text>
      `,
    },

    // 58-60 Stationery
    {
      file: 'product-notebook.png',
      name: 'Notebook',
      tint: '#9FA8DA',
      svg: `
        <rect x="75" y="55" width="150" height="190" rx="14" fill="#3949AB" />
        <rect x="75" y="55" width="25" height="190" rx="4" fill="#283593" />
        <line x1="115" y1="95" x2="195" y2="95" stroke="white" stroke-width="4" stroke-linecap="round" />
        <line x1="115" y1="125" x2="195" y2="125" stroke="white" stroke-width="4" stroke-linecap="round" />
        <line x1="115" y1="155" x2="175" y2="155" stroke="white" stroke-width="4" stroke-linecap="round" />
      `,
    },
    {
      file: 'product-pen.png',
      name: 'Pen',
      tint: '#90CAF9',
      svg: `
        <g transform="rotate(35 150 150)">
          <rect x="140" y="40" width="20" height="200" rx="6" fill="#1565C0" />
          <polygon points="140,240 160,240 150,270" fill="#CFD8DC" />
          <polygon points="148,270 152,270 150,278" fill="#212121" />
        </g>
      `,
    },
    {
      file: 'product-pencil-box.png',
      name: 'Pencil Box',
      tint: '#FFAB91',
      svg: `
        <rect x="55" y="100" width="190" height="90" rx="16" fill="#FF7043" stroke="#D84315" stroke-width="4" />
        <line x1="75" y1="130" x2="195" y2="130" stroke="#FFE082" stroke-width="8" stroke-linecap="round" />
        <line x1="75" y1="155" x2="195" y2="155" stroke="#81D4FA" stroke-width="8" stroke-linecap="round" />
      `,
    },

    // 61-64 Wellness
    {
      file: 'product-bandage.png',
      name: 'Bandage',
      tint: '#FFE0B2',
      svg: `
        <rect x="65" y="100" width="170" height="90" rx="20" fill="#FFE0B2" stroke="#FFB74D" stroke-width="4" />
        <circle cx="150" cy="145" r="18" fill="#FFCC80" />
        <line x1="140" y1="145" x2="160" y2="145" stroke="#E65100" stroke-width="4" />
        <line x1="150" y1="135" x2="150" y2="155" stroke="#E65100" stroke-width="4" />
      `,
    },
    {
      file: 'product-sanitizer.png',
      name: 'Sanitizer',
      tint: '#80DEEA',
      svg: `
        <rect x="100" y="80" width="100" height="160" rx="20" fill="#E0F7FA" stroke="#00ACC1" stroke-width="4" />
        <rect x="125" y="45" width="50" height="35" rx="6" fill="#00838F" />
        <circle cx="150" cy="150" r="30" fill="#00BCD4" />
        <text x="150" y="156" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="white" text-anchor="middle">CLEAN</text>
      `,
    },
    {
      file: 'product-vitamins.png',
      name: 'Vitamins',
      tint: '#A5D6A7',
      svg: `
        <rect x="95" y="70" width="110" height="170" rx="18" fill="#2E7D32" />
        <rect x="110" y="40" width="80" height="30" rx="8" fill="#FDD835" />
        <text x="150" y="155" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">VIT-C</text>
      `,
    },
    {
      file: 'product-first-aid.png',
      name: 'First Aid',
      tint: '#EF9A9A',
      svg: `
        <rect x="65" y="70" width="170" height="160" rx="20" fill="#E53935" />
        <rect x="135" y="105" width="30" height="90" rx="6" fill="white" />
        <rect x="105" y="135" width="90" height="30" rx="6" fill="white" />
      `,
    },

    // 65-66 Home Extra
    {
      file: 'product-air-freshener.png',
      name: 'Air Freshener',
      tint: '#CE93D8',
      svg: `
        <rect x="105" y="70" width="90" height="180" rx="22" fill="#AB47BC" />
        <ellipse cx="150" cy="50" rx="20" ry="12" fill="#E1BEE7" />
        <text x="150" y="160" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="white" text-anchor="middle">AROMA</text>
      `,
    },
    {
      file: 'product-battery.png',
      name: 'Battery',
      tint: '#90CAF9',
      svg: `
        <rect x="110" y="70" width="80" height="170" rx="12" fill="#212121" stroke="#FFD54F" stroke-width="4" />
        <rect x="135" y="50" width="30" height="20" rx="4" fill="#CFD8DC" />
        <text x="150" y="150" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#FFD54F" text-anchor="middle">AA</text>
      `,
    },
  ];

  for (const p of products) {
    const svgCode = wrapProduct(p.name, p.tint, p.svg);
    await sharp(Buffer.from(svgCode)).png().toFile(path.join(prodDir, p.file));
  }

  console.log(`✓ All ${products.length} product images generated successfully.`);
}

module.exports = { generateProducts };
