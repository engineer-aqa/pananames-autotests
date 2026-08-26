const PRICE_PATTERN = /\$([\d,]+\.\d{2})/g;

/**
 * Returns the last price found in a text block.
 * Promo rows show the crossed out price first and the actual one last, so the
 * last match is always the price the customer pays.
 */
export function parseLastPrice(text: string): number {
  const matches = [...text.matchAll(PRICE_PATTERN)];

  if (matches.length === 0) {
    throw new Error(`No price found in text: "${text}"`);
  }

  return Number(matches[matches.length - 1][1].replace(/,/g, ''));
}

export function sumPrices(prices: number[]): number {
  return prices.reduce((total, price) => total + price, 0);
}

/** Money the way the application prints it, thousands separator included. */
export function formatUsd(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
