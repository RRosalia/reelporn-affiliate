/**
 * Formats a monetary amount from cents to dollar display
 * @param cents - Amount in cents (e.g., 3999 for $39.99)
 * @returns Formatted currency string (e.g., "$39.99")
 */
export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}

/**
 * Formats a monetary amount from cents to dollar display with no decimal for whole dollars
 * @param cents - Amount in cents
 * @returns Formatted currency string (e.g., "$40" or "$39.99")
 */
export function formatCurrencyCompact(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars.toFixed(0)}` : `$${dollars.toFixed(2)}`;
}
