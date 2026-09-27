import type { CategoryTint } from '@/types';

/**
 * Category/deal accent pairs.
 *
 * These are the same gradients the placeholder generator writes to
 * `assets/images/categories`, so a card's chip colour and its artwork agree
 * until real photography replaces the placeholders. Once real assets land the
 * `gradient` pair is only used for tinted surfaces behind text.
 */
type Tint = {
  /** Lightest wash — safe as a background behind dark text. */
  soft: string;
  /** Mid tone for borders and inactive chips. */
  mid: string;
  /** Dark tone for text and icons on `soft`. */
  strong: string;
  /** On-brand solid for icons on `soft`. */
  accent: string;
  /** Two-stop gradient for hero-style surfaces. */
  gradient: readonly [string, string];
};

export const tints: Record<CategoryTint, Tint> = {
  green: {
    soft: '#D5F5E3',
    mid: '#A9E9C6',
    strong: '#046B3C',
    accent: '#00A65A',
    gradient: ['#D5F5E3', '#A9E9C6'],
  },
  amber: {
    soft: '#FFF1D6',
    mid: '#FFD98A',
    strong: '#7A5206',
    accent: '#F5A524',
    gradient: ['#FFF1D6', '#FFD98A'],
  },
  coral: {
    soft: '#FFE7DC',
    mid: '#FFC2A8',
    strong: '#A83C12',
    accent: '#FF6B35',
    gradient: ['#FFE7DC', '#FFC2A8'],
  },
  violet: {
    soft: '#EEE8FF',
    mid: '#CDBCF7',
    strong: '#442FA0',
    accent: '#7C5CE0',
    gradient: ['#EEE8FF', '#CDBCF7'],
  },
  blue: {
    soft: '#E1EDFF',
    mid: '#B9D3FF',
    strong: '#17478F',
    accent: '#2F80ED',
    gradient: ['#E1EDFF', '#B9D3FF'],
  },
  teal: {
    soft: '#CCF2EA',
    mid: '#96E0D0',
    strong: '#0A5347',
    accent: '#12A594',
    gradient: ['#CCF2EA', '#96E0D0'],
  },
};
