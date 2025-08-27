/**
 * Formats a date string to a readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
}

/**
 * Formats a date string to a detailed format (e.g., "Jan 15, 2024")
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export function formatDateDetailed(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Gets current date in Vancouver timezone in YYYY-MM-DD format
 * @returns Current date string
 */
export function getCurrentVancouverDate(): string {
    return new Date()
        .toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' })
        .split('/')
        .reverse()
        .join('-');
}
