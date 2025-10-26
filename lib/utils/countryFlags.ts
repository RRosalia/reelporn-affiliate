/**
 * Converts a country code (ISO 3166-1 alpha-2) to its flag emoji
 * @param countryCode - Two-letter country code (e.g., 'US', 'GB', 'NL')
 * @returns Flag emoji or empty string if invalid
 */
export function getCountryFlag(countryCode: string | null): string {
  if (!countryCode || countryCode.length !== 2) {
    return '';
  }

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

/**
 * Returns a flag emoji with the country code
 * @param countryCode - Two-letter country code
 * @returns Formatted string with flag and code, or just the code if flag unavailable
 */
export function getCountryFlagWithCode(countryCode: string | null): string {
  if (!countryCode) {
    return '—';
  }

  const flag = getCountryFlag(countryCode);
  return flag ? `${flag} ${countryCode.toUpperCase()}` : countryCode.toUpperCase();
}
