import { formatNumber } from './formatNumber';

/**
 * Formats an amount by converting to absolute value and fixing to 2 decimal places
 * @param amount - The amount to format
 * @returns Formatted amount string
 */
export function formatAmount(amount: number): string {
    return Math.abs(amount).toFixed(2);
}

/**
 * Formats an amount with commas and currency symbol
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = '$'): string {
    return `${currency}${formatNumber(formatAmount(amount))}`;
}

/**
 * Formats an amount as CAD with commas
 * @param amount - The amount to format
 * @returns Formatted CAD amount string
 */
export function formatCAD(amount: number): string {
    return `${formatNumber(formatAmount(amount))} CAD`;
}
