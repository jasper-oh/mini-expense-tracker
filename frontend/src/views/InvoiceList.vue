<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <h2 class="text-3xl font-bold text-gray-900">Invoices</h2>
            <div class="flex items-center space-x-4">
                <div
                    v-if="isAuthenticated"
                    class="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full"
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    <span>Authenticated</span>
                </div>
                <button
                    @click="handleSyncFromXero"
                    :disabled="!isAuthenticated || loading"
                    :class="[
                        'px-6 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2',
                        isAuthenticated && !loading
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-400 text-white cursor-not-allowed',
                    ]"
                >
                    <svg
                        v-if="loading"
                        class="w-5 h-5 animate-spin"
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
                    <svg
                        v-else
                        class="w-5 h-5"
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
                    <span>{{ loading ? 'Syncing...' : 'Sync from Xero' }}</span>
                </button>
                <button
                    @click="handleAddInvoiceClick"
                    :class="[
                        'px-6 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2',
                        isAuthenticated
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700',
                    ]"
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
                    <span>{{
                        isAuthenticated
                            ? 'Add Invoice'
                            : 'Add Invoice (Login Required)'
                    }}</span>
                </button>
            </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg
                                class="h-6 w-6 text-gray-400"
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
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt
                                    class="text-sm font-medium text-gray-500 truncate"
                                >
                                    Total Invoices
                                </dt>
                                <dd class="text-lg font-medium text-gray-900">
                                    {{ invoices.length }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg
                                class="h-6 w-6 text-yellow-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt
                                    class="text-sm font-medium text-gray-500 truncate"
                                >
                                    Outstanding
                                </dt>
                                <dd class="text-lg font-medium text-gray-900">
                                    {{ formatCurrency(totalOutstanding) }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg
                                class="h-6 w-6 text-green-400"
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
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt
                                    class="text-sm font-medium text-gray-500 truncate"
                                >
                                    Paid
                                </dt>
                                <dd class="text-lg font-medium text-gray-900">
                                    {{ formatCurrency(totalPaid) }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg
                                class="h-6 w-6 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                ></path>
                            </svg>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt
                                    class="text-sm font-medium text-gray-500 truncate"
                                >
                                    Total Value
                                </dt>
                                <dd class="text-lg font-medium text-gray-900">
                                    {{ formatCurrency(totalValue) }}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search and Filter Bar -->
        <div class="bg-white shadow rounded-lg p-4">
            <div class="flex flex-col md:flex-row gap-4">
                <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Search Invoices</label
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
                            placeholder="Search by invoice number, contact name, or description..."
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div class="md:w-48">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Filter by Status</label
                    >
                    <select
                        v-model="selectedStatus"
                        class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent</option>
                        <option value="PAID">Paid</option>
                        <option value="VOIDED">Voided</option>
                    </select>
                </div>
                <div class="md:w-48">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                        >Filter by Type</label
                    >
                    <select
                        v-model="selectedType"
                        class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">All Types</option>
                        <option value="ACCREC">Accounts Receivable</option>
                        <option value="ACCPAY">Accounts Payable</option>
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
                        <option value="status">Status</option>
                        <option value="contact">Contact</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Invoices Table -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">
                        Invoice List
                        <span class="text-sm font-normal text-gray-500 ml-2">
                            ({{ filteredInvoices.length }} invoices)
                        </span>
                    </h3>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Invoice #
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Contact
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Date
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Amount
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Status
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Type
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                            v-for="(invoice, index) in filteredInvoices"
                            :key="invoice.id"
                            :class="[
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                'hover:bg-blue-50 transition-colors duration-150',
                            ]"
                        >
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ invoice.invoiceNumber }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ invoice.xeroInvoiceId }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ invoice.contactName }}
                                </div>
                                <div
                                    v-if="invoice.contactEmail"
                                    class="text-sm text-gray-500"
                                >
                                    {{ invoice.contactEmail }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">
                                    {{ formatDate(invoice.invoiceDate) }}
                                </div>
                                <div
                                    v-if="invoice.dueDate"
                                    class="text-sm text-gray-500"
                                >
                                    Due: {{ formatDate(invoice.dueDate) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div
                                    class="text-sm font-semibold text-gray-900"
                                >
                                    {{ formatCurrency(invoice.totalAmount) }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ invoice.currency }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="getStatusBadgeClass(invoice.status)"
                                >
                                    {{ invoice.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="getTypeBadgeClass(invoice.type)"
                                >
                                    {{
                                        invoice.type === 'ACCREC'
                                            ? 'Receivable'
                                            : 'Payable'
                                    }}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                            >
                                <div class="flex space-x-2">
                                    <button
                                        @click="viewInvoice(invoice.id)"
                                        class="text-blue-600 hover:text-blue-900"
                                    >
                                        View
                                    </button>
                                    <button
                                        v-if="isAuthenticated"
                                        @click="editInvoice(invoice.id)"
                                        class="text-green-600 hover:text-green-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        v-if="isAuthenticated"
                                        @click="linkTransaction(invoice.id)"
                                        class="text-purple-600 hover:text-purple-900"
                                    >
                                        Link
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <NoDataDisplay
                v-if="filteredInvoices.length === 0"
                :title="
                    searchQuery || selectedStatus || selectedType
                        ? 'No invoices match your filters.'
                        : 'No invoices found.'
                "
                :subtitle="
                    searchQuery || selectedStatus || selectedType
                        ? 'Try adjusting your search criteria.'
                        : 'Sync invoices from Xero or add your first invoice!'
                "
                icon="document"
            />
        </div>

        <!-- JWT Modal -->
        <JWTModal
            :is-visible="showJWTModal"
            @close="showJWTModal = false"
            @success="handleJWTSuccess"
        />

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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Invoice } from '../types/Invoice';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useAuthStore } from '../stores/authStore';
import JWTModal from '../components/JWTModal.vue';
import NoDataDisplay from '../components/NoDataDisplay.vue';
import { formatCurrency, formatDate } from '../utils';

const router = useRouter();
const invoiceStore = useInvoiceStore();
const authStore = useAuthStore();

const invoices = ref<Invoice[]>([]);
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedType = ref('');
const sortBy = ref('date');
const showJWTModal = ref(false);
const showSuccessMessage = ref(false);
const successMessage = ref('');

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);
const loading = computed(() => invoiceStore.loading);
const totalOutstanding = computed(() => invoiceStore.totalOutstanding);
const totalPaid = computed(() => invoiceStore.totalPaid);
const totalValue = computed(() =>
    invoices.value.reduce((total, invoice) => total + invoice.totalAmount, 0)
);

const filteredInvoices = computed(() => {
    let filtered = invoices.value;

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
            (invoice) =>
                invoice.invoiceNumber.toLowerCase().includes(query) ||
                invoice.contactName.toLowerCase().includes(query) ||
                (invoice.description &&
                    invoice.description.toLowerCase().includes(query)) ||
                invoice.xeroInvoiceId.toLowerCase().includes(query)
        );
    }

    // Filter by status
    if (selectedStatus.value) {
        filtered = filtered.filter(
            (invoice) => invoice.status === selectedStatus.value
        );
    }

    // Filter by type
    if (selectedType.value) {
        filtered = filtered.filter(
            (invoice) => invoice.type === selectedType.value
        );
    }

    // Sort invoices
    filtered = [...filtered].sort((a, b) => {
        switch (sortBy.value) {
            case 'date':
                return (
                    new Date(b.invoiceDate).getTime() -
                    new Date(a.invoiceDate).getTime()
                );
            case 'amount':
                return b.totalAmount - a.totalAmount;
            case 'status':
                return a.status.localeCompare(b.status);
            case 'contact':
                return a.contactName.localeCompare(b.contactName);
            default:
                return 0;
        }
    });

    return filtered;
});

// Methods
const getStatusBadgeClass = (status: string) => {
    const classes = {
        DRAFT: 'bg-gray-100 text-gray-800',
        SENT: 'bg-yellow-100 text-yellow-800',
        PAID: 'bg-green-100 text-green-800',
        VOIDED: 'bg-red-100 text-red-800',
    };
    return (
        classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
    );
};

const getTypeBadgeClass = (type: string) => {
    const classes = {
        ACCREC: 'bg-blue-100 text-blue-800',
        ACCPAY: 'bg-orange-100 text-orange-800',
    };
    return classes[type as keyof typeof classes] || 'bg-gray-100 text-gray-800';
};

const handleSyncFromXero = async () => {
    if (!isAuthenticated.value) {
        showJWTModal.value = true;
        return;
    }

    try {
        await invoiceStore.syncFromXero();
        invoices.value = invoiceStore.invoices;
        successMessage.value = 'Invoices synced successfully from Xero!';
        showSuccessMessage.value = true;
        setTimeout(() => {
            showSuccessMessage.value = false;
        }, 3000);
    } catch (error) {
        console.error('Failed to sync invoices:', error);
    }
};

const handleAddInvoiceClick = () => {
    if (isAuthenticated.value) {
        // Navigate to add invoice page (would need to be created)
        router.push('/invoices/add');
    } else {
        showJWTModal.value = true;
    }
};

const handleJWTSuccess = () => {
    showSuccessMessage.value = true;
    successMessage.value = 'JWT token validated successfully!';
    setTimeout(() => {
        showSuccessMessage.value = false;
    }, 3000);
};

const viewInvoice = (id: number) => {
    router.push(`/invoices/${id}`);
};

const editInvoice = (id: number) => {
    router.push(`/invoices/${id}/edit`);
};

const linkTransaction = (id: number) => {
    router.push(`/invoices/${id}/link`);
};

onMounted(async () => {
    try {
        await invoiceStore.fetchInvoices();
        invoices.value = invoiceStore.invoices;

        console.log(invoices.value.map((invoice) => typeof invoice.subTotal));
    } catch (error) {
        console.error('Failed to fetch invoices:', error);
    }
});
</script>
