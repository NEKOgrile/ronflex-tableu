import { SnorlaxCard } from '../types/card';

// Define the order of card conditions
type CardCondition = 'normal' | 'normal-stamp' | 'holo' | 'holo-stamp' | 'reverse';

const conditionOrder: Record<CardCondition, number> = {
  'normal': 0,
  'normal-stamp': 1,
  'holo': 2,
  'holo-stamp': 3,
  'reverse': 4,
};

/**
 * Extract card condition from the card name/rarity/type
 * Prioritizes: Reverse > Holo > Stamp > Normal
 */
function extractCardCondition(card: SnorlaxCard): CardCondition {
  const name = (card.name || '').toLowerCase();
  const rarity = (card.rarity || '').toLowerCase();
  const type = (card.type || '').toLowerCase();
  const combined = `${name} ${rarity} ${type}`.toLowerCase();

  // Check for reverse first (highest priority)
  if (combined.includes('reverse') || combined.includes('rev ')) {
    return 'reverse';
  }

  // Check for holo with stamp
  if (combined.includes('holo') && combined.includes('stamp')) {
    return 'holo-stamp';
  }

  // Check for holo alone
  if (combined.includes('holo')) {
    return 'holo';
  }

  // Check for normal with stamp
  if (combined.includes('normal') && combined.includes('stamp')) {
    return 'normal-stamp';
  }

  // Default to normal
  return 'normal';
}

/**
 * Sort cards by:
 * 1. Release date (earliest first)
 * 2. Set/Series name (alphabetically)
 * 3. Card condition (normal → normal-stamp → holo → holo-stamp → reverse)
 * 4. Card number (as secondary tiebreaker)
 */
export function sortCardsByHierarchy(cardsToSort: SnorlaxCard[]): SnorlaxCard[] {
  return [...cardsToSort].sort((a, b) => {
    // 1. Sort by release date (earliest first)
    const dateA = new Date(a.release_date || '9999-12-31').getTime();
    const dateB = new Date(b.release_date || '9999-12-31').getTime();
    if (dateA !== dateB) {
      return dateA - dateB;
    }

    // 2. Sort by set name (alphabetically)
    const setComparison = (a.set || '').localeCompare(b.set || '');
    if (setComparison !== 0) {
      return setComparison;
    }

    // 3. Sort by card condition
    const conditionA = extractCardCondition(a);
    const conditionB = extractCardCondition(b);
    const conditionOrder_ = conditionOrder[conditionA] - conditionOrder[conditionB];
    if (conditionOrder_ !== 0) {
      return conditionOrder_;
    }

    // 4. Sort by card number (for final tiebreaker)
    const numA = parseInt(a.number || '0', 10);
    const numB = parseInt(b.number || '0', 10);
    return numA - numB;
  });
}
