import { categories } from '@/data/categories';
import { products } from '@/data/products';
import type { Category, Product } from '@/types';

const categoryNameById = new Map(categories.map((c) => [c.id, c.name.toLowerCase()]));

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

/** Every whitespace-separated token in the query, lowercased. */
function tokenize(query: string): string[] {
  return normalise(query).split(/\s+/).filter(Boolean);
}

/**
 * Relevance score for a single product.
 *
 * Higher is better; 0 means "no match". Scoring is deliberately ordered from
 * strongest signal to weakest so that typing "milk" surfaces the milk carton
 * before a shampoo that merely mentions "moisturising".
 */
function scoreProduct(product: Product, tokens: string[]): number {
  const name = product.name.toLowerCase();
  const fullQuery = tokens.join(' ');
  const categoryName = categoryNameById.get(product.categoryId) ?? '';

  // Every token has to land somewhere for the product to match at all, so a
  // single miss disqualifies it. Tracked with a flag rather than by zeroing the
  // running total, which a later matching token could otherwise rescue.
  let allTokensMatched = true;

  for (const token of tokens) {
    if (name.startsWith(token)) continue;
    if (name.includes(token)) continue;
    if (product.searchTerms.some((term) => term === token)) continue;
    if (product.searchTerms.some((term) => term.startsWith(token))) continue;
    if (categoryName.includes(token)) continue;
    allTokensMatched = false;
    break;
  }

  if (!allTokensMatched) return 0;

  let total = 0;

  if (name === fullQuery) total += 120;
  if (name.startsWith(fullQuery)) total += 80;

  for (const token of tokens) {
    if (name.startsWith(token)) total += 50;
    else if (name.includes(token)) total += 35;
    else if (product.searchTerms.some((term) => term === token)) total += 30;
    else if (product.searchTerms.some((term) => term.startsWith(token))) total += 20;
    else total += 8; // only reached when the token matched via the category
  }

  // Gentle popularity nudge so equally-relevant items order sensibly.
  total += product.rating * 2;
  if (product.stockStatus !== 'out_of_stock') total += 3;

  return total;
}

/** Ranked product search. Returns an empty array for a blank query. */
export function searchProducts(query: string, limit?: number): Product[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored: { product: Product; score: number }[] = [];

  for (const product of products) {
    const score = scoreProduct(product, tokens);
    if (score > 0) scored.push({ product, score });
  }

  scored.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating);

  const ranked = scored.map((entry) => entry.product);
  return typeof limit === 'number' ? ranked.slice(0, limit) : ranked;
}

/** Categories whose name or subcategory matches the query, for type-ahead. */
export function searchCategories(query: string, limit = 5): Category[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  return categories
    .map((category) => {
      const name = category.name.toLowerCase();
      const subNames = category.subcategories.map((s) => s.name.toLowerCase());
      let score = 0;
      for (const token of tokens) {
        if (name.startsWith(token)) score += 50;
        else if (name.includes(token)) score += 30;
        else if (subNames.some((s) => s.includes(token))) score += 12;
      }
      return { category, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.category);
}

/** Nearest match among a list of terms, used to power "did you mean". */
export function closestMatch(query: string, candidates: string[]): string | undefined {
  const tokens = tokenize(query);
  if (tokens.length === 0) return undefined;

  let best: string | undefined;
  let bestScore = 0;

  for (const candidate of candidates) {
    const term = candidate.toLowerCase();
    const score = tokens.reduce((acc, token) => {
      if (term.startsWith(token)) return acc + 3;
      if (term.includes(token)) return acc + 2;
      return acc;
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }

  return bestScore > 0 ? best : undefined;
}

export { categories as allCategories };
