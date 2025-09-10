<template>
    <div class="space-y-6" v-if="invoice">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-bold text-gray-900">
                    Link Transaction to Invoice
                </h2>
                <p class="text-gray-600">
                    {{ invoice.invoiceNumber }} - {{ invoice.contactName }}
                </p>
            </div>
            <button
                @click="goBack"
                class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
                Back to Invoice
            </button>
        </div>

        <!-- Invoice Summary -->
        <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Invoice Summary
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-500"
                        >Total Amount</label
                    >
                    <p class="mt-1 text-lg font-semibold text-gray-900">
                        {{ formatCurrency(invoice.totalAmount) }}
                        {{ invoice.currency }}
                    </p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500"
                        >Status</label
                    >
                    <p class="mt-1 text-sm text-gray-900">
                        {{ invoice.status }}
                    </p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-500"
                        >Type</label
                    >
                    <p class="mt-1 text-sm text-gray-900">
                        {{
                            invoice.type === 'ACCREC'
                                ? 'Accounts Receivable'
                                : 'Accounts Payable'
                        }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Search and Filter -->
        <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Available Transactions
            </h3>
            <div class="flex flex-col md:flex-row gap-4 mb-4">
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
                            placeholder="Search by description or amount..."
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
            </div>

            <!-- Transactions List -->
            <div v-if="filteredTransactions.length > 0" class="space-y-2">
                <div
                    v-for="transaction in filteredTransactions"
                    :key="transaction.id"
                    class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="flex items-center space-x-4">
                                <div class="flex-1">
                                    <h4
                                        class="text-sm font-medium text-gray-900"
                                    >
                                        {{ transaction.description }}
                                    </h4>
                                    <div
                                        class="flex items-center space-x-4 mt-1"
                                    >
                                        <span class="text-sm text-gray-500">{{
                                            formatDate(transaction.date)
                                        }}</span>
                                        <span class="text-sm text-gray-500">{{
                                            transaction.categoryName
                                        }}</span>
                                        <span
                                            class="text-sm font-medium text-gray-900"
                                            >{{
                                                formatCurrency(
                                                    transaction.amount
                                                )
                                            }}
                                            {{ transaction.currency }}</span
                                        >
                                    </div>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <input
                                        v-model="linkAmounts[transaction.id]"
                                        type="number"
                                        :placeholder="
                                            transaction.convertedCad.toString()
                                        "
                                        :max="transaction.convertedCad"
                                        step="0.01"
                                        class="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                    />
                                    <span class="text-sm text-gray-500"
                                        >CAD</span
                                    >
                                </div>
                                <button
                                    @click="linkTransaction(transaction.id)"
                                    :disabled="
                                        linkingTransaction === transaction.id
                                    "
                                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                >
                                    <svg
                                        v-if="
                                            linkingTransaction ===
                                            transaction.id
                                        "
                                        class="w-4 h-4 animate-spin"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        ></path>
                                    </svg>
                                    <span>{{
                                        linkingTransaction === transaction.id
                                            ? 'Linking...'
                                            : 'Link'
                                    }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <NoDataDisplay
                v-else
                :title="
                    searchQuery || selectedCategory
                        ? 'No transactions match your filters.'
                        : 'No available transactions to link.'
                "
                :subtitle="
                    searchQuery || selectedCategory
                        ? 'Try adjusting your search criteria.'
                        : 'All transactions may already be linked to this invoice.'
                "
                icon="info"
            />
        </div>

        <!-- Success Message -->
        <div
            v-if="showSuccessMessage"
            class="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-2"
        >
            <svg
                class="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>
            <span>{{ successMessage }}</span>
        </div>
    </div>

    <!-- Error State -->
    <div v-else-if="!loading" class="text-center py-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Invoice not found</h2>
        <p class="text-gray-600 mb-4">
            The invoice you're looking for doesn't exist or has been deleted.
        </p>
        <button
            @click="goBack"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
            Back to Invoices
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Invoice } from '../types/Invoice';
import type { Transaction } from '../types/Transaction';
import type { Category } from '../types/Category';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';
import NoDataDisplay from '../components/NoDataDisplay.vue';
import { formatCurrency, formatDate } from '../utils';

const route = useRoute();
const router = useRouter();
const invoiceStore = useInvoiceStore();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const invoice = ref<Invoice | null>(null);
const transactions = ref<Transaction[]>([]);
const categories = ref<Category[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const linkAmounts = ref<Record<number, number>>({});
const linkingTransaction = ref<number | null>(null);
const loading = ref(false);
const showSuccessMessage = ref(false);
const successMessage = ref('');

// Computed properties
const filteredTransactions = computed(() => {
    let filtered = transactions.value;

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
            (transaction) =>
                transaction.description.toLowerCase().includes(query) ||
                transaction.amount.toString().includes(query) ||
                transaction.categoryName.toLowerCase().includes(query)
        );
    }

    // Filter by category
    if (selectedCategory.value) {
        filtered = filtered.filter(
            (transaction) =>
                transaction.categoryId === parseInt(selectedCategory.value)
        );
    }

    return filtered;
});

// Methods
const loadData = async () => {
    const invoiceId = parseInt(route.params.id as string);
    if (!invoiceId) return;

    try {
        loading.value = true;

        // Load invoice
        const invoiceData = await invoiceStore.getInvoiceById(invoiceId);
        invoice.value = invoiceData;

        // Load transactions and categories
        await Promise.all([
            transactionStore.fetchTransactions(),
            categoryStore.fetchCategories(),
        ]);

        transactions.value = transactionStore.transactions;
        categories.value = categoryStore.categories;

        // Load already linked transactions to exclude them
        const linkedTransactions = await invoiceStore.getInvoiceTransactions(
            invoiceId
        );
        const linkedTransactionIds = new Set(
            linkedTransactions.map((link) => link.transactionId)
        );

        // Filter out already linked transactions
        transactions.value = transactions.value.filter(
            (transaction) => !linkedTransactionIds.has(transaction.id)
        );
    } catch (error) {
        console.error('Failed to load data:', error);
    } finally {
        loading.value = false;
    }
};

const linkTransaction = async (transactionId: number) => {
    if (!invoice.value) return;

    try {
        linkingTransaction.value = transactionId;

        const linkData = {
            transactionId,
            invoiceId: invoice.value.id,
            amount: linkAmounts.value[transactionId] || undefined,
            notes: '',
        };

        await invoiceStore.linkTransactionToInvoice(linkData);

        // Remove the linked transaction from the list
        transactions.value = transactions.value.filter(
            (t) => t.id !== transactionId
        );
        delete linkAmounts.value[transactionId];

        successMessage.value = 'Transaction linked successfully!';
        showSuccessMessage.value = true;
        setTimeout(() => {
            showSuccessMessage.value = false;
        }, 3000);
    } catch (error) {
        console.error('Failed to link transaction:', error);
    } finally {
        linkingTransaction.value = null;
    }
};

const goBack = () => {
    router.push(`/invoices/${invoice.value?.id}`);
};

onMounted(() => {
    loadData();
});
</script>
