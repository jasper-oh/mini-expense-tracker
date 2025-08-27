/**
 * Formats a number by adding commas every 3 digits
 * @param value - The number to format
 * @returns Formatted string with commas
 */
export function formatNumber(value: number | string): string {
    // Convert to string and handle edge cases
    if (value === null || value === undefined) return '0';

    const numStr = value.toString();

    // Handle negative numbers
    const isNegative = numStr.startsWith('-');
    const absNumStr = isNegative ? numStr.slice(1) : numStr;

    // Split into integer and decimal parts
    const [integerPart, decimalPart] = absNumStr.split('.');

    // Add commas to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine parts
    let result = formattedInteger;
    if (decimalPart !== undefined) {
        result += '.' + decimalPart;
    }

    // Add negative sign back if needed
    if (isNegative) {
        result = '-' + result;
    }

    return result;
}
