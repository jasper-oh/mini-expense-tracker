# NoDataDisplay Components

This directory contains reusable components for displaying "no data" states across the application.

## Components

### NoDataDisplay

Full-size "no data" display component for main content areas.

**Props:**

-   `title` (string): Main message to display
-   `subtitle` (string): Secondary message below the title
-   `icon` (string, optional): Icon to display. Defaults to 'document'

**Available Icons:**

-   `document` - Document icon (default)
-   `chart` - Bar chart icon
-   `search` - Magnifying glass icon
-   `category` - Category/folder icon
-   `user` - User profile icon
-   `settings` - Settings/gear icon
-   `warning` - Warning triangle icon
-   `info` - Information circle icon

**Usage:**

```vue
<NoDataDisplay
    title="No Data Available"
    subtitle="Try adjusting your filters or add some data to get started."
    icon="chart"
/>
```

### NoDataCompact

Compact version of NoDataDisplay for use in tables and smaller spaces.

**Props:** Same as NoDataDisplay

**Usage:**

```vue
<NoDataCompact
    title="No Results"
    subtitle="No data matches your criteria."
    icon="search"
/>
```

## Examples

### Transaction List (No Results)

```vue
<NoDataDisplay
    v-if="filteredTransactions.length === 0"
    title="No transactions found"
    subtitle="Add your first transaction to get started!"
    icon="document"
/>
```

### Category Balance (No Data)

```vue
<NoDataDisplay
    v-if="filteredBalances.length === 0"
    title="No Data Available"
    :subtitle="getNoDataMessage()"
    icon="chart"
/>
```

### Table Row (No Data)

```vue
<tr v-if="data.length === 0">
    <td colspan="4" class="px-6 py-12 text-center">
        <NoDataCompact
            title="No Data Available"
            subtitle="No records found for the selected criteria."
            icon="info"
        />
    </td>
</tr>
```

## Benefits

-   **Consistent UI**: All "no data" states look the same across the app
-   **Reusable**: Use the same component in multiple places
-   **Maintainable**: Update the design in one place
-   **Flexible**: Different icons and messages for different contexts
-   **Accessible**: Proper semantic structure and styling
