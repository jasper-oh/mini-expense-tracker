/**
 * Calculates the percentage of a value relative to a total
 * @param value - The value to calculate percentage for
 * @param total - The total value
 * @returns Percentage string with 1 decimal place
 */
export function calculatePercentage(value: number, total: number): string {
    if (total === 0) return '0.0';
    return ((Math.abs(value) / total) * 100).toFixed(1);
}

/**
 * Calculates the total from an array of numbers
 * @param values - Array of numbers to sum
 * @returns Total sum
 */
export function calculateTotal(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0);
}

/**
 * Calculates the average from an array of numbers
 * @param values - Array of numbers to average
 * @returns Average value
 */
export function calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return calculateTotal(values) / values.length;
}
