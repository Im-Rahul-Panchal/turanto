const path = require('path');
const fs = require('fs');

const { generateBrandAssets } = require('./asset-generators/brand');
const { generateIllustrations } = require('./asset-generators/illustrations');
const { generateBanners } = require('./asset-generators/banners');
const { generateCategories } = require('./asset-generators/categories');
const { generateAvatarsAndPlaceholders } = require('./asset-generators/avatars-and-placeholders');
const { generateProducts } = require('./asset-generators/products');

async function main() {
  console.log('=== Starting Turanto Full Production Asset Generation ===');
  const repoRoot = path.resolve(__dirname, '..');
  const imagesDir = path.join(repoRoot, 'assets', 'images');

  try {
    await generateBrandAssets(imagesDir);
    await generateIllustrations(imagesDir);
    await generateBanners(imagesDir);
    await generateCategories(imagesDir);
    await generateAvatarsAndPlaceholders(imagesDir);
    await generateProducts(imagesDir);
    console.log('=== SUCCESS: All Turanto Assets Successfully Generated! ===');
  } catch (error) {
    console.error('Asset generation failed:', error);
    process.exit(1);
  }
}

main();
