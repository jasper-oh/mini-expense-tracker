<template>
    <div class="space-y-6" v-if="invoice">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <div>
                <h2 class="text-3xl font-bold text-gray-900">
                    {{ invoice.invoiceNumber }}
                </h2>
                <p class="text-gray-600">{{ invoice.contactName }}</p>
            </div>
            <div class="flex items-center space-x-4">
                <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="getStatusBadgeClass(invoice.status)"
                >
                    {{ invoice.status }}
                </span>
                <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    :class="getTypeBadgeClass(invoice.type)"
                >
                    {{
                        invoice.type === 'ACCREC'
                            ? 'Accounts Receivable'
                            : 'Accounts Payable'
                    }}
                </span>
                <button
                    @click="goBack"
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    Back to Invoices
                </button>
            </div>
        </div>

        <!-- Invoice Details -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Invoice Info -->
            <div class="lg:col-span-2">
                <div class="bg-white shadow rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        Invoice Details
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-500"
                                >Invoice Number</label
                            >
                            <p class="mt-1 text-sm text-gray-900">
                                {{ invoice.invoiceNumber }}
                            </p>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-500"
                                >Xero Invoice ID</label
                            >
                            <p class="mt-1 text-sm text-gray-900 font-mono">
                                {{ invoice.xeroInvoiceId }}
                            </p>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-500"
                                >Contact Name</label
                            >
                            <p class="mt-1 text-sm text-gray-900">
                                {{ invoice.contactName }}
                            </p>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-500"
                                >Contact Email</label
                            >
                            <p class="mt-1 text-sm text-gray-900">
                                {{ invoice.contactEmail || 'N/A' }}
                            </p>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-500"
                                >Invoice Date</label
                            >
                            <p class="mt-1 text-sm text-gray-900">
                                {{ formatDate(invoice.invoiceDate) }}
                            </p>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-500"
                                >Due Date</label
                            >
                            <p class="mt-1 text-sm text-gray-900">
                                {{
                                    invoice.dueDate
                                        ? formatDate(invoice.dueDate)
                                        : 'N/A'
                                }}
                            </p>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-500"
                                >Paid Date</label
                            >
                            <p class="mt-1 text-sm text-gray-900">
                                {{
                                    invoice.paidDate
                                        ? formatDate(invoice.paidDate)
                                        : 'N/A'
                                }}
                            </p>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-500"
                                >Reference</label
                            >
                            <p class="mt-1 text-sm text-gray-900">
                                {{ invoice.reference || 'N/A' }}
                            </p>
                        </div>
                    </div>
                    <div v-if="invoice.description" class="mt-4">
                        <label class="block text-sm font-medium text-gray-500"
                            >Description</label
                        >
                        <p class="mt-1 text-sm text-gray-900">
                            {{ invoice.description }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Financial Summary -->
            <div class="lg:col-span-1">
                <div class="bg-white shadow rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        Financial Summary
                    </h3>
                    <div class="space-y-4">
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-500">Subtotal</span>
                            <span class="text-sm font-medium text-gray-900"
                                >{{ formatCurrency(invoice.subTotal) }}
                                {{ invoice.currency }}</span
                            >
                        </div>
                        <div class="flex justify-between">
                            <span class="text-sm text-gray-500"
                                >Tax Amount</span
                            >
                            <span class="text-sm font-medium text-gray-900"
                                >{{ formatCurrency(invoice.taxAmount) }}
                                {{ invoice.currency }}</span
                            >
                        </div>
                        <div class="border-t pt-4">
                            <div class="flex justify-between">
                                <span
                                    class="text-base font-medium text-gray-900"
                                    >Total Amount</span
                                >
                                <span class="text-base font-bold text-gray-900"
                                    >{{ formatCurrency(invoice.totalAmount) }}
                                    {{ invoice.currency }}</span
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Linked Transactions -->
        <div class="bg-white shadow rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">
                    Linked Transactions
                </h3>
                <button
                    v-if="isAuthenticated"
                    @click="linkNewTransaction"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                    </svg>
                    <span>Link Transaction</span>
                </button>
            </div>

            <div v-if="linkedTransactions.length > 0" class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Transaction
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
                                Linked Amount
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Notes
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
                            v-for="(link, index) in linkedTransactions"
                            :key="link.id"
                            :class="[
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                                'hover:bg-blue-50 transition-colors duration-150',
                            ]"
                        >
                            <td class="px-6 py-4">
                                <div class="text-sm font-medium text-gray-900">
                                    {{ link.transaction?.description }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    ID: {{ link.transactionId }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">
                                    {{
                                        link.transaction
                                            ? formatDate(link.transaction.date)
                                            : 'N/A'
                                    }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">
                                    {{
                                        link.transaction
                                            ? formatCurrency(
                                                  link.transaction.amount
                                              )
                                            : 'N/A'
                                    }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ link.transaction?.currency || '' }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">
                                    {{
                                        link.amount
                                            ? formatCurrency(link.amount)
                                            : 'Full Amount'
                                    }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="text-sm text-gray-900">
                                    {{ link.notes || 'No notes' }}
                                </div>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                            >
                                <button
                                    v-if="isAuthenticated"
                                    @click="
                                        unlinkTransaction(
                                            link.transactionId,
                                            link.invoiceId
                                        )
                                    "
                                    class="text-red-600 hover:text-red-900"
                                >
                                    Unlink
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <NoDataDisplay
                v-else
                title="No linked transactions"
                subtitle="Link transactions to this invoice to track payments and expenses."
                icon="info"
            />
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
            <svg
                class="animate-spin h-8 w-8 text-blue-600"
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
import type { Invoice, TransactionInvoiceLink } from '../types/Invoice';
import { useInvoiceStore } from '../stores/invoiceStore';
import { useAuthStore } from '../stores/authStore';
import NoDataDisplay from '../components/NoDataDisplay.vue';
import { formatCurrency, formatDate } from '../utils';

const route = useRoute();
const router = useRouter();
const invoiceStore = useInvoiceStore();
const authStore = useAuthStore();

const invoice = ref<Invoice | null>(null);
const linkedTransactions = ref<TransactionInvoiceLink[]>([]);
const loading = ref(false);
const showSuccessMessage = ref(false);
const successMessage = ref('');

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);

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

const loadInvoice = async () => {
    const invoiceId = parseInt(route.params.id as string);
    if (!invoiceId) return;

    try {
        loading.value = true;
        const invoiceData = await invoiceStore.getInvoiceById(invoiceId);
        invoice.value = invoiceData;

        // Load linked transactions
        const transactions = await invoiceStore.getInvoiceTransactions(
            invoiceId
        );
        linkedTransactions.value = transactions;
    } catch (error) {
        console.error('Failed to load invoice:', error);
    } finally {
        loading.value = false;
    }
};

const goBack = () => {
    router.push('/invoices');
};

const linkNewTransaction = () => {
    router.push(`/invoices/${invoice.value?.id}/link`);
};

const unlinkTransaction = async (transactionId: number, invoiceId: number) => {
    if (!confirm('Are you sure you want to unlink this transaction?')) return;

    try {
        await invoiceStore.unlinkTransactionFromInvoice(
            transactionId,
            invoiceId
        );
        linkedTransactions.value = linkedTransactions.value.filter(
            (link) =>
                !(
                    link.transactionId === transactionId &&
                    link.invoiceId === invoiceId
                )
        );
        successMessage.value = 'Transaction unlinked successfully!';
        showSuccessMessage.value = true;
        setTimeout(() => {
            showSuccessMessage.value = false;
        }, 3000);
    } catch (error) {
        console.error('Failed to unlink transaction:', error);
    }
};

onMounted(() => {
    loadInvoice();
});
</script>
