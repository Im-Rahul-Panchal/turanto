import type { Category, Subcategory } from '@/types';

/**
 * Category taxonomy. `order` controls presentation order; ids are stable and are
 * used in deep links (`/category/dairy-breakfast`), so they must not change once
 * shipped.
 */
export const categories: Category[] = [
  {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    tagline: 'Farm fresh, picked today',
    glyph: '🥦',
    imageKey: 'category-fruits-veg',
    tint: 'green',
    order: 1,
    subcategories: [
      { id: 'fresh-vegetables', name: 'Fresh Vegetables', glyph: '🥕' },
      { id: 'fresh-fruits', name: 'Fresh Fruits', glyph: '🍎' },
      { id: 'exotic-fruits', name: 'Exotic Fruits', glyph: '🥭' },
      { id: 'leafy-vegetables', name: 'Leafy Greens', glyph: '🥬' },
    ],
  },
  {
    id: 'dairy-breakfast',
    name: 'Dairy & Breakfast',
    tagline: 'Milk, paneer and more',
    glyph: '🥛',
    imageKey: 'category-dairy-breakfast',
    tint: 'blue',
    order: 2,
    subcategories: [
      { id: 'milk-curd', name: 'Milk & Curd', glyph: '🥛' },
      { id: 'paneer-cheese', name: 'Paneer & Cheese', glyph: '🧀' },
      { id: 'butter-cream', name: 'Butter & Cream', glyph: '🧈' },
      { id: 'breakfast-cereals', name: 'Breakfast', glyph: '🥣' },
    ],
  },
  {
    id: 'bakery',
    name: 'Bakery',
    tagline: 'Baked through the night',
    glyph: '🍞',
    imageKey: 'category-bakery',
    tint: 'amber',
    order: 3,
    subcategories: [
      { id: 'bread-buns', name: 'Bread & Buns', glyph: '🍞' },
      { id: 'rusk-toast', name: 'Rusk & Toast', glyph: '🍪' },
      { id: 'cakes-pastries', name: 'Cakes & Pastries', glyph: '🍰' },
    ],
  },
  {
    id: 'snacks',
    name: 'Snacks',
    tagline: 'Something for every craving',
    glyph: '🍫',
    imageKey: 'category-snacks',
    tint: 'coral',
    order: 4,
    subcategories: [
      { id: 'chips-namkeen', name: 'Chips & Namkeen', glyph: '🥔' },
      { id: 'biscuits-cookies', name: 'Biscuits & Cookies', glyph: '🍪' },
      { id: 'chocolates', name: 'Chocolates', glyph: '🍫' },
      { id: 'dry-fruits', name: 'Dry Fruits', glyph: '🥜' },
    ],
  },
  {
    id: 'beverages',
    name: 'Beverages',
    tagline: 'Chai to cold drinks',
    glyph: '🥤',
    imageKey: 'category-beverages',
    tint: 'violet',
    order: 5,
    subcategories: [
      { id: 'tea-coffee', name: 'Tea & Coffee', glyph: '☕' },
      { id: 'juices', name: 'Juices', glyph: '🧃' },
      { id: 'soft-drinks', name: 'Soft Drinks', glyph: '🥤' },
      { id: 'water-energy', name: 'Water & Energy', glyph: '💧' },
    ],
  },
  {
    id: 'instant-food',
    name: 'Instant Food',
    tagline: 'Dinner in ten minutes',
    glyph: '🍜',
    imageKey: 'category-instant-food',
    tint: 'amber',
    order: 6,
    subcategories: [
      { id: 'noodles-pasta', name: 'Noodles & Pasta', glyph: '🍜' },
      { id: 'sauces', name: 'Sauces', glyph: '🥫' },
      { id: 'ready-cook', name: 'Ready to Cook', glyph: '🍱' },
    ],
  },
  {
    id: 'staples',
    name: 'Staples & Grains',
    tagline: 'Your kitchen, stocked',
    glyph: '🌾',
    imageKey: 'category-staples',
    tint: 'green',
    order: 7,
    subcategories: [
      { id: 'rice-atta', name: 'Rice & Atta', glyph: '🍚' },
      { id: 'pulses-dals', name: 'Pulses & Dals', glyph: '🫘' },
      { id: 'oils-ghee', name: 'Oils & Ghee', glyph: '🫗' },
      { id: 'sugar-salt', name: 'Sugar & Salt', glyph: '🧂' },
    ],
  },
  {
    id: 'household',
    name: 'Household',
    tagline: 'Sparkling clean, fast',
    glyph: '🧹',
    imageKey: 'category-household',
    tint: 'blue',
    order: 8,
    subcategories: [
      { id: 'laundry', name: 'Laundry', glyph: '🧺' },
      { id: 'dishwash', name: 'Dishwash', glyph: '🍽️' },
      { id: 'floor-toilet', name: 'Floor & Toilet', glyph: '🚽' },
      { id: 'repellents', name: 'Repellents', glyph: '🦟' },
    ],
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    tagline: 'Small rituals, big difference',
    glyph: '🧴',
    imageKey: 'category-personal-care',
    tint: 'violet',
    order: 9,
    subcategories: [
      { id: 'bath-body', name: 'Bath & Body', glyph: '🧼' },
      { id: 'hair-care', name: 'Hair Care', glyph: '💇' },
      { id: 'oral-care', name: 'Oral Care', glyph: '🪥' },
      { id: 'deodorants', name: 'Deodorants', glyph: '🌬️' },
    ],
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    tagline: 'Gentle on tiny hands',
    glyph: '👶',
    imageKey: 'category-baby-care',
    tint: 'coral',
    order: 10,
    subcategories: [
      { id: 'baby-food', name: 'Baby Food', glyph: '🥣' },
      { id: 'diapers', name: 'Diapers', glyph: '🧷' },
      { id: 'baby-hygiene', name: 'Baby Hygiene', glyph: '🧴' },
      { id: 'feeding', name: 'Feeding', glyph: '🍼' },
    ],
  },
  {
    id: 'pet-care',
    name: 'Pet Care',
    tagline: 'Goodies for good boys',
    glyph: '🐶',
    imageKey: 'category-pet-care',
    tint: 'teal',
    order: 11,
    subcategories: [
      { id: 'dog-food', name: 'Dog Food', glyph: '🦴' },
      { id: 'cat-food', name: 'Cat Food', glyph: '🐟' },
      { id: 'pet-hygiene', name: 'Pet Hygiene', glyph: '🧴' },
      { id: 'pet-toys', name: 'Toys', glyph: '🎾' },
    ],
  },
  {
    id: 'stationery',
    name: 'Stationery',
    tagline: 'For school and desk',
    glyph: '✏️',
    imageKey: 'category-stationery',
    tint: 'amber',
    order: 12,
    subcategories: [
      { id: 'notebooks', name: 'Notebooks', glyph: '📓' },
      { id: 'pens-pencils', name: 'Pens & Pencils', glyph: '🖊️' },
      { id: 'art-supplies', name: 'Art Supplies', glyph: '🎨' },
    ],
  },
  {
    id: 'wellness',
    name: 'Everyday Wellness',
    tagline: 'Non-prescription basics',
    glyph: '💊',
    imageKey: 'category-wellness',
    tint: 'green',
    order: 13,
    subcategories: [
      { id: 'first-aid', name: 'First Aid', glyph: '🩹' },
      { id: 'hygiene', name: 'Hygiene', glyph: '🧼' },
      { id: 'vitamins', name: 'Vitamins', glyph: '💊' },
    ],
  },
  {
    id: 'home-care',
    name: 'Home Care',
    tagline: 'The finishing touches',
    glyph: '🏠',
    imageKey: 'category-home-care',
    tint: 'teal',
    order: 14,
    subcategories: [
      { id: 'air-fresheners', name: 'Air Fresheners', glyph: '🌸' },
      { id: 'batteries', name: 'Batteries', glyph: '🔋' },
      { id: 'home-utilities', name: 'Home Utilities', glyph: '🔧' },
    ],
  },
];

/**
 * Lookups.
 *
 * Screens resolve categories and subcategories from route params and cross-links,
 * so these centralise the `find` and keep callers free of optional chaining.
 */
export function getCategory(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

/** Resolves a subcategory within its parent, or `undefined` if either id is wrong. */
export function getSubcategory(
  categoryId: string,
  subcategoryId: string,
): Subcategory | undefined {
  return getCategory(categoryId)?.subcategories.find((sub) => sub.id === subcategoryId);
}

/** Categories in merchandising order, which is not the same as alphabetical. */
export function getCategoriesInOrder(): Category[] {
  return [...categories].sort((a, b) => a.order - b.order);
}
