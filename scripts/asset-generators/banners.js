const sharp = require('sharp');
const path = require('path');

async function generateBanners(imagesDir) {
  console.log('Generating Hero & Offer Banners...');
  const bannersDir = path.join(imagesDir, 'banners');
  const offersDir = path.join(imagesDir, 'offers');

  function escapeXml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Helper for Hero Banners (1200 x 640)
  function createHeroBannerSvg({
    bgGradient,
    badgeText,
    badgeColor,
    badgeBg,
    title,
    subtitle,
    speedBadge = '⚡ 10 MIN DELIVERY',
    graphicSvg,
  }) {
    return `
    <svg width="1200" height="640" viewBox="0 0 1200 640" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${bgGradient}
        <filter id="bShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.2" />
        </filter>
        <radialGradient id="cornerGlow" cx="90%" cy="20%" r="60%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Background Canvas with smooth rounded corners -->
      <rect width="1200" height="640" rx="36" fill="url(#heroGrad)" />
      <rect width="1200" height="640" rx="36" fill="url(#cornerGlow)" />

      <!-- Decorative subtle curves & circles on right -->
      <g opacity="0.18">
        <circle cx="950" cy="320" r="280" fill="white" />
        <circle cx="1020" cy="240" r="190" stroke="white" stroke-width="24" fill="none" />
        <circle cx="820" cy="480" r="140" fill="white" />
      </g>

      <!-- Left Text Content -->
      <g transform="translate(80, 110)">
        <!-- Top Badge -->
        <rect x="0" y="0" width="160" height="42" rx="21" fill="${badgeBg}" />
        <text x="80" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="800" fill="${badgeColor}" text-anchor="middle" letter-spacing="1">
          ${escapeXml(badgeText.toUpperCase())}
        </text>

        <!-- Big Headline -->
        <text x="0" y="115" font-family="system-ui, -apple-system, sans-serif" font-size="58" font-weight="900" fill="white" letter-spacing="-1">
          ${escapeXml(title)}
        </text>

        <!-- Subtitle -->
        <text x="0" y="170" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="600" fill="rgba(255, 255, 255, 0.92)" letter-spacing="0.2">
          ${escapeXml(subtitle)}
        </text>

        <!-- Speed / Turanto Guarantee Pill -->
        <g transform="translate(0, 225)">
          <rect x="0" y="0" width="240" height="46" rx="23" fill="rgba(0, 0, 0, 0.25)" />
          <text x="120" y="29" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#FFE082" text-anchor="middle">
            ${escapeXml(speedBadge)}
          </text>
        </g>
      </g>

      <!-- Right 3D Visual Group -->
      <g transform="translate(680, 80)" filter="url(#bShadow)">
        ${graphicSvg}
      </g>
    </svg>
    `;
  }

  // 1. Weekend Sale (Hero)
  const weekendHero = createHeroBannerSvg({
    bgGradient: `
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FF6B35" />
        <stop offset="50%" stop-color="#E14F1B" />
        <stop offset="100%" stop-color="#9C27B0" />
      </linearGradient>
    `,
    badgeText: 'Limited time',
    badgeColor: '#E14F1B',
    badgeBg: '#FFE7DC',
    title: 'Weekend Sale',
    subtitle: 'Up to 50% off across the store',
    speedBadge: '⚡ 10 MIN TO YOUR DOOR',
    graphicSvg: `
      <!-- Festive Shopping Bags & Gift Box -->
      <g transform="translate(60, 40)">
        <!-- Giant Orange Shopping Bag -->
        <path d="M40 160L70 420H290L320 160H40Z" fill="#FFA726" />
        <polygon points="40,160 70,130 290,130 320,160" fill="#FB8C00" />
        <path d="M120 130V70C120 40 140 20 180 20C220 20 240 40 240 70V130" stroke="#E65100" stroke-width="18" stroke-linecap="round" fill="none" />
        <text x="180" y="290" font-family="system-ui, sans-serif" font-size="64" font-weight="900" fill="white" text-anchor="middle">50%</text>
        <text x="180" y="340" font-family="system-ui, sans-serif" font-size="26" font-weight="800" fill="#FFE082" text-anchor="middle">OFF</text>

        <!-- Red Gift Box in front -->
        <g transform="translate(190, 240)">
          <rect x="0" y="40" width="160" height="140" rx="16" fill="#E53935" />
          <rect x="-10" y="20" width="180" height="35" rx="8" fill="#C62828" />
          <!-- Gold Ribbon -->
          <rect x="65" y="20" width="30" height="160" fill="#FFD54F" />
          <!-- Bow -->
          <ellipse cx="60" cy="15" rx="28" ry="18" fill="#FFCA28" />
          <ellipse cx="100" cy="15" rx="28" ry="18" fill="#FFCA28" />
          <circle cx="80" cy="18" r="14" fill="#FFB300" />
        </g>
      </g>
    `,
  });
  await sharp(Buffer.from(weekendHero)).png().toFile(path.join(bannersDir, 'banner-weekend-sale.png'));

  // 2. Fresh Fruits (Hero)
  const fruitsHero = createHeroBannerSvg({
    bgGradient: `
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00A65A" />
        <stop offset="60%" stop-color="#046B3C" />
        <stop offset="100%" stop-color="#0B4627" />
      </linearGradient>
    `,
    badgeText: 'Farm fresh',
    badgeColor: '#046B3C',
    badgeBg: '#D5F5E3',
    title: 'Fresh Fruits Drop',
    subtitle: 'Picked this morning, at your door by 9',
    speedBadge: '🌿 100% ORGANIC & FRESH',
    graphicSvg: `
      <!-- Orchard Fruits Visual: Crisp Red Apple, Mango, Orange -->
      <g transform="translate(40, 20)">
        <!-- Wooden crate shadow & base -->
        <ellipse cx="220" cy="400" rx="180" ry="30" fill="rgba(0,0,0,0.3)" />
        
        <!-- Big Luscious Apple -->
        <g transform="translate(80, 140)">
          <circle cx="80" cy="90" r="85" fill="#E53935" />
          <circle cx="120" cy="90" r="85" fill="#C62828" />
          <!-- Apple Stem & Leaf -->
          <path d="M100 15Q115 -10 130 -5" stroke="#5D4037" stroke-width="10" stroke-linecap="round" fill="none" />
          <ellipse cx="140" cy="5" rx="24" ry="12" transform="rotate(-25 140 5)" fill="#4CAF50" />
          <ellipse cx="65" cy="65" rx="16" ry="32" transform="rotate(-30 65 65)" fill="white" opacity="0.3" />
        </g>

        <!-- Alphonso Mango -->
        <g transform="translate(210, 160)">
          <path d="M40 50C100 10 180 50 160 140C140 210 60 220 20 180C-20 140 0 80 40 50Z" fill="#FFA000" />
          <path d="M45 55C95 20 165 55 150 135C135 195 70 205 35 170C5 135 15 80 45 55Z" fill="#FFB300" opacity="0.7" />
          <!-- Dew drops -->
          <circle cx="80" cy="110" r="7" fill="white" opacity="0.6" />
        </g>

        <!-- Fresh Sliced Orange in front -->
        <g transform="translate(140, 260)">
          <circle cx="70" cy="70" r="70" fill="#FF9800" />
          <circle cx="70" cy="70" r="62" fill="#FFE0B2" />
          <circle cx="70" cy="70" r="54" fill="#FF9800" />
          <circle cx="70" cy="70" r="14" fill="#FFE0B2" />
        </g>
      </g>
    `,
  });
  await sharp(Buffer.from(fruitsHero)).png().toFile(path.join(bannersDir, 'banner-fresh-fruits.png'));

  // 3. Breakfast Essentials (Hero)
  const breakfastHero = createHeroBannerSvg({
    bgGradient: `
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFB300" />
        <stop offset="50%" stop-color="#F57C00" />
        <stop offset="100%" stop-color="#E65100" />
      </linearGradient>
    `,
    badgeText: 'Morning deal',
    badgeColor: '#7A5206',
    badgeBg: '#FFF1D6',
    title: 'Breakfast in 10 min',
    subtitle: 'Milk, bread and butter on one basket',
    speedBadge: '🥛 COLD CHAIN DELIVERED',
    graphicSvg: `
      <!-- Milk bottle, loaf of bread, fresh eggs -->
      <g transform="translate(40, 20)">
        <!-- Milk Bottle -->
        <g transform="translate(60, 80)">
          <rect x="30" y="80" width="100" height="260" rx="20" fill="white" stroke="#E0E0E0" stroke-width="4" />
          <rect x="45" y="30" width="70" height="50" rx="8" fill="white" stroke="#E0E0E0" stroke-width="4" />
          <rect x="40" y="10" width="80" height="25" rx="6" fill="#1E88E5" />
          <!-- Blue Milk Banner -->
          <rect x="30" y="170" width="100" height="80" fill="#2196F3" />
          <text x="80" y="218" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="white" text-anchor="middle">MILK</text>
        </g>

        <!-- Fresh Bread Loaf -->
        <g transform="translate(160, 160)">
          <path d="M20 90C20 40 60 10 130 10C200 10 240 40 240 90V180H20V90Z" fill="#8D6E63" />
          <path d="M30 90C30 50 65 24 130 24C195 24 230 50 230 90V170H30V90Z" fill="#D7CCC8" />
          <!-- Cuts on bread crust -->
          <line x1="70" y1="40" x2="85" y2="90" stroke="#6D4C41" stroke-width="8" stroke-linecap="round" />
          <line x1="125" y1="35" x2="135" y2="90" stroke="#6D4C41" stroke-width="8" stroke-linecap="round" />
          <line x1="180" y1="40" x2="185" y2="90" stroke="#6D4C41" stroke-width="8" stroke-linecap="round" />
        </g>

        <!-- Butter Block in front -->
        <g transform="translate(190, 270)">
          <polygon points="10,40 60,10 180,10 130,40" fill="#FFF59D" />
          <polygon points="10,40 130,40 130,100 10,100" fill="#FFEE58" />
          <polygon points="130,40 180,10 180,70 130,100" fill="#FDD835" />
          <text x="70" y="75" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#F57F17">BUTTER</text>
        </g>
      </g>
    `,
  });
  await sharp(Buffer.from(breakfastHero)).png().toFile(path.join(bannersDir, 'banner-breakfast-essentials.png'));

  // 4. Household Deals (Hero)
  const householdHero = createHeroBannerSvg({
    bgGradient: `
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E88E5" />
        <stop offset="50%" stop-color="#1565C0" />
        <stop offset="100%" stop-color="#0D47A1" />
      </linearGradient>
    `,
    badgeText: 'Big savings',
    badgeColor: '#17478F',
    badgeBg: '#E1EDFF',
    title: 'Home Essentials',
    subtitle: 'Detergents and cleaners, priced lower',
    speedBadge: '✨ SPARKLING CLEAN SAVINGS',
    graphicSvg: `
      <!-- Detergent bottle, spray bottle, bubbles -->
      <g transform="translate(60, 30)">
        <!-- Big Detergent Jug -->
        <g transform="translate(40, 80)">
          <rect x="40" y="80" width="160" height="250" rx="36" fill="#00E676" />
          <path d="M120 20H150C160 20 170 30 170 40V80H120V20Z" fill="#00C853" />
          <!-- Jug Handle Hole -->
          <rect x="60" y="120" width="30" height="100" rx="15" fill="#1565C0" />
          <!-- Brand Badge -->
          <circle cx="150" cy="190" r="42" fill="white" />
          <text x="150" y="196" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#00C853" text-anchor="middle">CLEAN</text>
        </g>

        <!-- Blue Trigger Spray Bottle in front -->
        <g transform="translate(180, 120)">
          <rect x="40" y="90" width="90" height="200" rx="20" fill="#00B0FF" />
          <!-- Spray Nozzle -->
          <rect x="65" y="45" width="40" height="45" fill="#ECEFF1" />
          <polygon points="10,35 65,35 65,65 30,65" fill="#37474F" />
          <rect x="50" y="65" width="15" height="40" rx="4" fill="#37474F" />
        </g>

        <!-- Bubbles & Sparkles -->
        <circle cx="130" cy="60" r="24" stroke="white" stroke-width="4" fill="rgba(255,255,255,0.3)" />
        <circle cx="280" cy="90" r="16" stroke="white" stroke-width="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="310" cy="180" r="28" stroke="white" stroke-width="5" fill="rgba(255,255,255,0.3)" />
      </g>
    `,
  });
  await sharp(Buffer.from(householdHero)).png().toFile(path.join(bannersDir, 'banner-household-deals.png'));

  // 5. Instant Meals (Hero)
  const instantHero = createHeroBannerSvg({
    bgGradient: `
      <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8E24AA" />
        <stop offset="50%" stop-color="#6A1B9A" />
        <stop offset="100%" stop-color="#4A148C" />
      </linearGradient>
    `,
    badgeText: 'Quick pick',
    badgeColor: '#442FA0',
    badgeBg: '#EEE8FF',
    title: '10-Minute Meals',
    subtitle: 'Noodles, pasta and sauces in stock',
    speedBadge: '🍜 CRAVINGS SATISFIED FAST',
    graphicSvg: `
      <!-- Steaming noodle bowl & chopsticks -->
      <g transform="translate(60, 40)">
        <!-- Ramen Bowl -->
        <g transform="translate(60, 150)">
          <!-- Bowl Body -->
          <path d="M20 70C20 180 80 230 170 230C260 230 320 180 320 70H20Z" fill="#E53935" />
          <ellipse cx="170" cy="70" rx="150" ry="32" fill="#B71C1C" />
          <ellipse cx="170" cy="70" rx="140" ry="26" fill="#FDD835" />
          
          <!-- Chopsticks -->
          <line x1="280" y1="10" x2="80" y2="100" stroke="#D7CCC8" stroke-width="12" stroke-linecap="round" />
          <line x1="290" y1="30" x2="90" y2="120" stroke="#D7CCC8" stroke-width="12" stroke-linecap="round" />
          
          <!-- Steam Whorls -->
          <path d="M130 30C120 0 140 -20 130 -40" stroke="white" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6" />
          <path d="M170 25C160 -5 180 -25 170 -45" stroke="white" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.8" />
          <path d="M210 30C200 0 220 -20 210 -40" stroke="white" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.6" />
        </g>
      </g>
    `,
  });
  await sharp(Buffer.from(instantHero)).png().toFile(path.join(bannersDir, 'banner-instant-meals.png'));

  // Offer Banners (840 x 620)
  function createOfferSvg(title, subtitle, badge, fromColor, toColor, iconSvg) {
    return `
    <svg width="840" height="620" viewBox="0 0 840 620" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="oGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${fromColor}" />
          <stop offset="100%" stop-color="${toColor}" />
        </linearGradient>
        <filter id="oShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.18" />
        </filter>
      </defs>
      <rect width="840" height="620" rx="32" fill="url(#oGrad)" />
      
      <!-- Ambient Circles -->
      <circle cx="680" cy="180" r="160" fill="white" opacity="0.15" />
      <circle cx="740" cy="460" r="140" fill="white" opacity="0.1" />

      <!-- Left Text Content -->
      <g transform="translate(64, 100)">
        <!-- Badge -->
        <rect x="0" y="0" width="160" height="40" rx="20" fill="rgba(255,255,255,0.25)" />
        <text x="80" y="26" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="white" text-anchor="middle" letter-spacing="0.5">
          ${escapeXml(badge.toUpperCase())}
        </text>

        <text x="0" y="110" font-family="system-ui, sans-serif" font-size="52" font-weight="900" fill="white">
          ${escapeXml(title)}
        </text>
        <text x="0" y="165" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="rgba(255,255,255,0.9)" width="400">
          ${escapeXml(subtitle)}
        </text>

        <!-- CTA pill -->
        <g transform="translate(0, 240)">
          <rect x="0" y="0" width="180" height="52" rx="26" fill="white" filter="url(#oShadow)" />
          <text x="90" y="33" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="${toColor}" text-anchor="middle">
            Shop Now →
          </text>
        </g>
      </g>

      <!-- Right Emblem Visual -->
      <g transform="translate(540, 180)" filter="url(#oShadow)">
        ${iconSvg}
      </g>
    </svg>
    `;
  }

  // 1. Today's Deals
  const todaysDealsSvg = createOfferSvg(
    "Today's Deals",
    'Hand-picked price drops every day',
    'Fresh picks',
    '#00C853',
    '#007934',
    `
    <circle cx="110" cy="110" r="110" fill="white" />
    <path d="M60 80L80 170H140L160 80H60Z" fill="#00C853" />
    <circle cx="85" cy="185" r="12" fill="#007934" />
    <circle cx="135" cy="185" r="12" fill="#007934" />
    <text x="110" y="125" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="white" text-anchor="middle">%</text>
    `
  );
  await sharp(Buffer.from(todaysDealsSvg)).png().toFile(path.join(offersDir, 'offer-todays-deals.png'));

  // 2. Flash Deals
  const flashDealsSvg = createOfferSvg(
    'Flash Deals',
    'Very limited quantities while stock lasts',
    'Ends soon',
    '#FF6B35',
    '#D84315',
    `
    <circle cx="110" cy="110" r="110" fill="white" />
    <polygon points="120,30 65,115 110,115 85,190 155,95 115,95" fill="#FF6B35" />
    <polygon points="115,40 75,110 110,110 95,170 145,100 115,100" fill="#FFD54F" />
    `
  );
  await sharp(Buffer.from(flashDealsSvg)).png().toFile(path.join(offersDir, 'offer-flash-deals.png'));

  // 3. Under 99
  const under99Svg = createOfferSvg(
    'Under ₹99',
    'Everyday staples that never cost more',
    'Budget friendly',
    '#00B4D8',
    '#0077B6',
    `
    <circle cx="110" cy="110" r="110" fill="white" />
    <circle cx="110" cy="110" r="85" fill="#FFE082" stroke="#FFB300" stroke-width="8" />
    <text x="110" y="126" font-family="system-ui, sans-serif" font-size="52" font-weight="900" fill="#E65100" text-anchor="middle">₹99</text>
    `
  );
  await sharp(Buffer.from(under99Svg)).png().toFile(path.join(offersDir, 'offer-under-99.png'));

  // 4. BOGO
  const bogoSvg = createOfferSvg(
    'Buy 1 Get 1',
    'Snacks & drinks, two for the price of one',
    'Double up',
    '#7C5CE0',
    '#512DA8',
    `
    <circle cx="110" cy="110" r="110" fill="white" />
    <rect x="50" y="70" width="70" height="70" rx="12" fill="#7C5CE0" />
    <rect x="100" y="90" width="70" height="70" rx="12" fill="#FF6B35" />
    <text x="85" y="115" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="white" text-anchor="middle">1+1</text>
    `
  );
  await sharp(Buffer.from(bogoSvg)).png().toFile(path.join(offersDir, 'offer-bogo.png'));

  // 5. Best Discounts
  const bestDiscountsSvg = createOfferSvg(
    'Best Discounts',
    'Steepest markdowns across all categories',
    'Up to 40% off',
    '#E53935',
    '#B71C1C',
    `
    <circle cx="110" cy="110" r="110" fill="white" />
    <text x="110" y="100" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="#E53935" text-anchor="middle">40%</text>
    <text x="110" y="140" font-family="system-ui, sans-serif" font-size="24" font-weight="800" fill="#FF8A80" text-anchor="middle">OFF</text>
    `
  );
  await sharp(Buffer.from(bestDiscountsSvg)).png().toFile(path.join(offersDir, 'offer-best-discounts.png'));

  // 6. Weekend Specials
  const weekendSpecialsSvg = createOfferSvg(
    'Weekend Specials',
    'Family favourites at special pricing',
    'Weekend only',
    '#FFA000',
    '#E65100',
    `
    <circle cx="110" cy="110" r="110" fill="white" />
    <polygon points="110,40 130,85 180,90 142,125 152,175 110,150 68,175 78,125 40,90 90,85" fill="#FFA000" />
    <polygon points="110,55 125,90 165,95 135,120 142,160 110,140 78,160 85,120 55,95 95,90" fill="#FFD54F" />
    `
  );
  await sharp(Buffer.from(weekendSpecialsSvg)).png().toFile(path.join(offersDir, 'offer-weekend-specials.png'));

  console.log('✓ All 5 hero banners and 6 offer banners generated.');
}

module.exports = { generateBanners };
