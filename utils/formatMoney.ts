// utils/formatMoney.ts
import { CURRENCY_SYMBOL_MAP } from '@/constants/currencies';

/** Format a single amount in a given currency. */
export function formatMoney(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOL_MAP[currency];
  const value = amount.toFixed(2);
  return symbol ? `${symbol}${value}` : `${currency} ${value}`;
}

/**
 * Format an entire CurrencyTotals bucket as a single inline string.
 * Used where space is tight (e.g. per-supplier subtotal).
 *
 * Example: { USD: 400, ILS: 300 } → "$400.00 · ₪300.00"
 */
export function formatCurrencyTotals(totals: Record<string, number>): string {
  const entries = Object.entries(totals);
  if (entries.length === 0) return formatMoney(0, 'USD');
  return entries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([currency, amount]) => formatMoney(amount, currency))
    .join(' · ');
}

/**
 * Return a CurrencyTotals bucket as a stable, sorted list of rows.
 * Used by CartSheet's footer to render one "Total in XXX" row per currency.
 */
export interface CurrencyTotalRow {
  currency: string;
  label: string;   // e.g. "Total in USD"
  amount: string;  // e.g. "$400.00"
}

export function toCurrencyTotalRows(totals: Record<string, number>): CurrencyTotalRow[] {
  return Object.entries(totals)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([currency, amount]) => ({
      currency,
      label: `Total in ${currency}`,
      amount: formatMoney(amount, currency),
    }));
}