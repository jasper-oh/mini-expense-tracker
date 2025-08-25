<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <h2 class="text-3xl font-bold text-gray-900">Transactions</h2>
            <router-link
                to="/add"
                class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                </svg>
                <span>Add Transaction</span>
            </router-link>
        </div>

        <!-- Search and Filter Bar -->
        <div class="bg-white shadow rounded-lg p-4">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Search Transactions</label
                    >
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <svg
                                class="h-5 w-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search by description or category..."
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div class="md:w-48">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Filter by Category</label
                    >
                    <select
                        v-model="selectedCategory"
                        class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Categories</option>
                        <option
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.id.toString()"
                        >
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <div class="md:w-48">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Sort by</label
                    >
                    <select
                        v-model="sortBy"
                        class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="category">Category</option>
                        <option value="description">Description</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Transactions Table -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Transaction List
                        <span class="text-sm font-normal text-gray-500 ml-2">
                            ({{ filteredTransactions.length }} transactions)
                        </span>
                    </h3>
                    <div
                        class="flex items-center space-x-2 text-sm text-gray-500"
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            ></path>
                        </svg>
                        <span>Total: {{ formatTotalAmount() }}</span>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Date
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Description
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Category
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Amount
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Currency
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                            v-for="(transaction, index) in filteredTransactions"
                            :key="transaction.id"
                            :class="[
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                'hover:bg-blue-50 transition-colors duration-150',
                            ]"
                        >
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 font-medium">
                                    {{ formatDate(transaction.date) }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ formatTime(transaction.date) }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div
                                    class="text-sm text-gray-900 font-medium max-w-xs truncate"
                                    :title="transaction.description"
                                >
                                    {{ transaction.description }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                    :class="
                                        getCategoryBadgeClass(
                                            getCategoryName(transaction)
                                        )
                                    "
                                >
                                    {{ getCategoryName(transaction) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="text-sm font-semibold text-green-600"
                                >
                                    {{ formatAmount(transaction.amount) }}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium"
                            >
                                {{ transaction.currency }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                v-if="filteredTransactions.length === 0"
                class="text-center py-12"
            >
                <svg
                    class="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                </svg>
                <p class="text-gray-500 text-lg">
                    {{
                        searchQuery || selectedCategory
                            ? 'No transactions match your filters.'
                            : 'No transactions found.'
                    }}
                </p>
                <p class="text-gray-400 text-sm mt-1">
                    {{
                        searchQuery || selectedCategory
                            ? 'Try adjusting your search criteria.'
                            : 'Add your first transaction to get started!'
                    }}
                </p>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-4">
            <router-link
                to="/balance"
                class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                </svg>
                <span>View Category Balance</span>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Transaction } from '../types/Transaction';
import type { Category } from '../types/Category';

const transactions = ref<Transaction[]>([
    {
        id: 1,
        amount: 25.5,
        currency: 'CAD',
        date: '2025-08-24T14:30:00Z',
        description: 'Lunch at Cafe',
        categoryId: 1,
        categoryName: 'Food & Dining',
        createdAt: '2025-08-24T14:31:00Z',
        updatedAt: '2025-08-24T14:31:00Z',
    },
    {
        id: 2,
        amount: 50,
        currency: 'CAD',
        date: '2025-08-23T10:00:00Z',
        description: 'Monthly Metro Pass',
        categoryId: 2,
        categoryName: 'Transportation',
        createdAt: '2025-08-23T10:01:00Z',
        updatedAt: '2025-08-23T10:01:00Z',
    },
    {
        id: 3,
        amount: 2000,
        currency: 'CAD',
        date: '2025-08-22T09:00:00Z',
        description: 'Monthly housing pay',
        categoryId: 9,
        categoryName: 'Housing',
        createdAt: '2025-08-22T09:01:00Z',
        updatedAt: '2025-08-22T09:01:00Z',
    },
]);
const categories = ref<Category[]>([
    { id: 1, name: 'Housing' },
    { id: 2, name: 'Transportation' },
    { id: 3, name: 'Food & Dining' },
]);
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('date');

const filteredTransactions = computed(() => {
    let filtered = transactions.value;

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
            (transaction) =>
                transaction.description.toLowerCase().includes(query) ||
                (
                    transaction.categoryName ||
                    `Category ${transaction.categoryId}`
                )
                    .toLowerCase()
                    .includes(query) ||
                transaction.amount.toString().includes(query)
        );
    }

    // Filter by category
    if (selectedCategory.value) {
        filtered = filtered.filter(
            (transaction) =>
                transaction.categoryId === parseInt(selectedCategory.value)
        );
    }

    // Sort transactions
    filtered = [...filtered].sort((a, b) => {
        switch (sortBy.value) {
            case 'date':
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case 'amount':
                return Math.abs(b.amount) - Math.abs(a.amount);
            case 'category':
                return (
                    a.categoryName || `Category ${a.categoryId}`
                ).localeCompare(b.categoryName || `Category ${b.categoryId}`);
            case 'description':
                return a.description.localeCompare(b.description);
            default:
                return 0;
        }
    });

    return filtered;
});

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-CA', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

const formatAmount = (amount: number): string => {
    return Math.abs(amount).toFixed(2);
};

const formatTotalAmount = (): string => {
    const total = filteredTransactions.value.reduce(
        (sum, transaction) => sum + parseFloat(transaction.amount.toString()),
        0
    );
    return `${total.toFixed(2)}`;
};

const getCategoryBadgeClass = (category: string): string => {
    const classes = {
        'Food & Dining': 'bg-red-100 text-red-800',
        Transportation: 'bg-blue-100 text-blue-800',
        Shopping: 'bg-purple-100 text-purple-800',
        Entertainment: 'bg-green-100 text-green-800',
        'Bills & Utilities': 'bg-yellow-100 text-yellow-800',
        Healthcare: 'bg-pink-100 text-pink-800',
        Education: 'bg-indigo-100 text-indigo-800',
        Travel: 'bg-orange-100 text-orange-800',
        Other: 'bg-gray-100 text-gray-800',
    };
    return (
        classes[category as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
};

const getCategoryName = (transaction: Transaction): string => {
    return transaction.categoryName || `Category ${transaction.categoryId}`;
};
</script>
