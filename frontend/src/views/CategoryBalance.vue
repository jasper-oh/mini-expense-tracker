<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex items-center space-x-4">
            <router-link
                to="/transactions"
                class="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-2"
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                    ></path>
                </svg>
                <span>Back to Transactions</span>
            </router-link>
            <h2 class="text-3xl font-bold text-gray-900">Category Balance</h2>
        </div>

        <!-- Filter Controls -->
        <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Filter Options
            </h3>
            <div class="flex flex-col md:flex-row gap-4 items-end">
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Date Range</label
                    >
                    <div class="flex space-x-2">
                        <input
                            v-model="filters.startDate"
                            type="date"
                            class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Start Date"
                        />
                        <input
                            v-model="filters.endDate"
                            type="date"
                            class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="End Date"
                        />
                    </div>
                </div>
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Category</label
                    >
                    <select
                        v-model="filters.selectedCategory"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option
                            v-for="category in categoryStore.categories"
                            :key="category.id"
                            :value="category.id"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <div class="flex space-x-3">
                    <button
                        @click="clearFilters"
                        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        @click="applyFilters"
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Total Balance
                </h3>
                <p class="text-3xl font-bold text-green-600">
                    {{ formatAmount(totalBalance) }}
                </p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Categories
                </h3>
                <p class="text-3xl font-bold text-blue-600">
                    {{ filteredBalances.length }}
                </p>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    Average per Category
                </h3>
                <p class="text-3xl font-bold text-green-600">
                    {{ formatAmount(averagePerCategory) }}
                </p>
            </div>
        </div>

        <!-- Chart and Table Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Pie Chart -->
            <div class="bg-white shadow rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    Category Distribution
                </h3>
                <div class="relative h-80">
                    <canvas
                        ref="chartCanvas"
                        @click="handleChartClick"
                    ></canvas>
                </div>
                <div class="mt-4 text-sm text-gray-600 text-center">
                    Click on a chart segment to view detailed transactions
                </div>
            </div>

            <!-- Category Balance Table -->
            <div class="bg-white shadow rounded-lg overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Category Balances
                    </h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Category
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Total Amount
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Percentage
                                </th>
                                <th
                                    scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Balance
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr
                                v-for="balance in filteredBalances"
                                :key="balance.categoryId"
                                @click="
                                    showCategoryTransactions(balance.categoryId)
                                "
                                class="cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div
                                            class="w-3 h-3 rounded-full mr-3"
                                            :class="
                                                getCategoryColor(
                                                    getCategoryName(
                                                        balance.categoryId
                                                    )
                                                )
                                            "
                                        ></div>
                                        <span
                                            class="text-sm font-medium text-gray-900"
                                        >
                                            {{
                                                getCategoryName(
                                                    balance.categoryId
                                                )
                                            }}
                                        </span>
                                    </div>
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {{ formatAmount(balance.total) }}
                                </td>
                                <td
                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                >
                                    {{ calculatePercentage(balance.total) }}%
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="text-sm font-semibold text-green-600"
                                    >
                                        {{ formatAmount(balance.total) }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Transactions Modal Component -->
        <TransactionsModal
            :is-visible="showTransactionsModal"
            :category-name="selectedCategoryName"
            :transactions="categoryTransactions"
            @close="closeTransactionsModal"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import type { ChartConfiguration } from 'chart.js';
import { useCategoryStore } from '../stores/categoryStore';
import { useTransactionStore } from '../stores/transactionStore';
import TransactionsModal from '../components/TransactionsModal.vue';
import type { Transaction } from '../types/Transaction';

interface Filters {
    startDate: string;
    endDate: string;
    selectedCategory: string;
}

// Filter state
const filters = ref<Filters>({
    startDate: '',
    endDate: '',
    selectedCategory: '',
});

const categoryStore = useCategoryStore();
const transactionStore = useTransactionStore();

const chartCanvas = ref<HTMLCanvasElement>();
let chart: Chart | null = null;

onMounted(async () => {
    try {
        await Promise.all([
            categoryStore.fetchCategories(),
            transactionStore.fetchTransactions(),
            transactionStore.fetchCategoryBalances(),
        ]);

        // Create chart after data is loaded
        await nextTick();
        createChart();
    } catch (error) {
        console.error('Error loading data:', error);
    }
});

// Modal state
const showTransactionsModal = ref(false);
const selectedCategoryName = ref('');
const categoryTransactions = ref<Transaction[]>([]);

const filteredBalances = computed(() => {
    let filtered = [...transactionStore.categoryBalances];

    // Filter by category
    if (filters.value.selectedCategory) {
        const categoryId = parseInt(filters.value.selectedCategory);
        filtered = filtered.filter(
            (balance) => balance.categoryId === categoryId
        );
    }

    // Filter by date range
    if (filters.value.startDate || filters.value.endDate) {
        // Get all transactions from the store
        const allTransactions = transactionStore.transactions;

        filtered = filtered.map((balance) => {
            // Filter transactions for this specific category
            let categoryTransactions = allTransactions.filter(
                (transaction) => transaction.categoryId === balance.categoryId
            );

            // Apply date filtering
            if (filters.value.startDate || filters.value.endDate) {
                categoryTransactions = categoryTransactions.filter(
                    (transaction) => {
                        const transactionDate = new Date(transaction.date);
                        const startDate = filters.value.startDate
                            ? new Date(filters.value.startDate)
                            : null;
                        const endDate = filters.value.endDate
                            ? new Date(filters.value.endDate)
                            : null;

                        // If start date is set, transaction must be on or after it
                        if (startDate && transactionDate < startDate) {
                            return false;
                        }

                        // If end date is set, transaction must be on or before it
                        if (endDate && transactionDate > endDate) {
                            return false;
                        }

                        return true;
                    }
                );
            }

            // Calculate new total based on filtered transactions
            const filteredTotal = categoryTransactions.reduce(
                (sum, transaction) => {
                    return sum + transaction.amount;
                },
                0
            );

            // Return new balance object with filtered transactions and recalculated total
            return {
                ...balance,
                transactions: categoryTransactions,
                total: filteredTotal,
            };
        });
    }

    return filtered;
});

const totalBalance = computed(() => {
    return filteredBalances.value.reduce(
        (sum, balance) => sum + balance.total,
        0
    );
});

const averagePerCategory = computed(() => {
    if (filteredBalances.value.length === 0) return 0;
    return totalBalance.value / filteredBalances.value.length;
});

// Chart configuration
const createChart = () => {
    if (!chartCanvas.value) {
        console.warn('Chart canvas not available');
        return;
    }

    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) {
        console.warn('Could not get chart context');
        return;
    }

    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
        chart = null;
    }

    // Check if we have data to display
    if (filteredBalances.value.length === 0) {
        console.warn('No data available for chart');
        return;
    }

    const chartData = filteredBalances.value.map((balance) => ({
        label: getCategoryName(balance.categoryId),
        value: Math.abs(balance.total),
        color: getChartColor(getCategoryName(balance.categoryId)),
    }));

    const config: ChartConfiguration = {
        type: 'pie',
        data: {
            labels: chartData.map((item) => item.label),
            datasets: [
                {
                    data: chartData.map((item) => item.value),
                    backgroundColor: chartData.map((item) => item.color),
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 3,
                    hoverBorderColor: '#000000',
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                        },
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = (
                                context.dataset.data as number[]
                            ).reduce((a: number, b: number) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(
                                1
                            );
                            return `${label}: ${formatAmount(
                                value
                            )} (${percentage}%)`;
                        },
                    },
                },
            },
            onClick: (_event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const categoryId = filteredBalances.value[index].categoryId;
                    showCategoryTransactions(categoryId);
                }
            },
        },
    };

    chart = new Chart(ctx, config);
};

const getChartColor = (categoryName: string): string => {
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
    return colors[categoryName as keyof typeof colors] || '#6b7280';
};

// Methods
const formatAmount = (amount: number): string => {
    return Math.abs(amount).toFixed(2);
};

const calculatePercentage = (amount: number): string => {
    const total = filteredBalances.value.reduce(
        (sum, balance) => sum + Math.abs(balance.total),
        0
    );

    if (total === 0) return '0.00';
    return ((Math.abs(amount) / total) * 100).toFixed(1);
};

const getCategoryColor = (category: string): string => {
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
};

const getCategoryName = (categoryId: number): string => {
    const category = categoryStore.categories.find(
        (cat) => cat.id === categoryId
    );
    return category ? category.name : 'Unknown Category';
};

const showCategoryTransactions = (categoryId: number) => {
    const categoryName = getCategoryName(categoryId);
    selectedCategoryName.value = categoryName;
    const balance = transactionStore.categoryBalances.find(
        (balance) => balance.categoryId === categoryId
    );
    categoryTransactions.value = balance ? balance.transactions : [];
    showTransactionsModal.value = true;
};

const closeTransactionsModal = () => {
    showTransactionsModal.value = false;
    selectedCategoryName.value = '';
    categoryTransactions.value = [];
};

const handleChartClick = (_event: MouseEvent) => {
    // Chart click is handled by Chart.js onClick option
};

const applyFilters = () => {
    console.log('Filters applied:', filters.value);
    // Recreate chart when filters change
    recreateChart();
};

const clearFilters = () => {
    filters.value = {
        startDate: '',
        endDate: '',
        selectedCategory: '',
    };
    // Recreate chart when filters are cleared
    recreateChart();
};

// Chart recreation when data changes
const recreateChart = async () => {
    try {
        if (chart) {
            chart.destroy();
            chart = null;
        }
        await nextTick();
        createChart();
    } catch (error) {
        console.error('Error recreating chart:', error);
    }
};

// Watch for changes in category balances and recreate chart
watch(
    () => transactionStore.categoryBalances,
    () => {
        if (transactionStore.categoryBalances.length > 0) {
            recreateChart();
        }
    },
    { deep: true }
);
</script>
