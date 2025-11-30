/**
 * Currency formatting utilities
 */

export const DEFAULT_CURRENCY = 'BDT';
export const CURRENCY_SYMBOL = '৳';

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  _currency: string = DEFAULT_CURRENCY
): string {
  if (isNaN(amount) || amount < 0) {
    return `${CURRENCY_SYMBOL} 0`;
  }

  // Format number with thousand separators
  const formatted = new Intl.NumberFormat('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${CURRENCY_SYMBOL} ${formatted}`;
}

/**
 * Format price range
 */
export function formatPriceRange(
  min: number,
  max: number,
  currency: string = DEFAULT_CURRENCY
): string {
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
}

/**
 * Get display text for products without price
 */
export function getNoPriceText(): string {
  return 'Contact for pricing';
}

