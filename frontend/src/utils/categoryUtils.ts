/**
 * Gets the CSS class for category badge styling
 * @param category - The category name
 * @returns CSS class string
 */
export function getCategoryBadgeClass(category: string): string {
    const classes = {
        'Food & Dining': 'bg-red-100 text-red-800',
        Transportation: 'bg-blue-100 text-blue-800',
        Shopping: 'bg-purple-100 text-purple-800',
        Entertainment: 'bg-green-100 text-green-800',
        'Bills & Utilities': 'bg-yellow-100 text-yellow-800',
        Healthcare: 'bg-pink-100 text-pink-800',
        Education: 'bg-indigo-100 text-indigo-800',
        Travel: 'bg-orange-100 text-orange-800',
        Housing: 'bg-cyan-100 text-cyan-800',
        Other: 'bg-gray-100 text-gray-800',
    };
    return (
        classes[category as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
}

/**
 * Gets the CSS class for category color dots
 * @param category - The category name
 * @returns CSS class string
 */
export function getCategoryColorClass(category: string): string {
    const classes = {
        'Food & Dining': 'bg-red-500',
        Transportation: 'bg-blue-500',
        Shopping: 'bg-purple-500',
        Entertainment: 'bg-green-500',
        'Bills & Utilities': 'bg-yellow-500',
        Healthcare: 'bg-pink-500',
        Education: 'bg-indigo-500',
        Travel: 'bg-orange-500',
        Housing: 'bg-cyan-500',
        Other: 'bg-gray-500',
    };
    return classes[category as keyof typeof classes] || 'bg-gray-500';
}

/**
 * Gets the hex color for chart rendering
 * @param category - The category name
 * @returns Hex color string
 */
export function getChartColor(category: string): string {
    const colors = {
        'Food & Dining': '#ef4444',
        Transportation: '#3b82f6',
        Shopping: '#8b5cf6',
        Entertainment: '#10b981',
        'Bills & Utilities': '#eab308',
        Healthcare: '#ec4899',
        Education: '#6366f1',
        Travel: '#f97316',
        Housing: '#06b6d4',
        Other: '#6b7280',
    };
    return colors[category as keyof typeof colors] || '#6b7280';
}
