<template>
    <div
        v-if="isVisible"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="closeModal"
    >
        <div
            class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden"
            @click.stop
        >
            <div
                class="px-6 py-4 border-b border-gray-200 flex justify-between items-center"
            >
                <h3 class="text-lg font-semibold text-gray-900">
                    Transactions for {{ categoryName }}
                </h3>
                <button
                    @click="closeModal"
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        ></path>
                    </svg>
                </button>
            </div>
            <div class="overflow-y-auto max-h-[60vh]">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50 sticky top-0">
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
                            v-for="transaction in transactions"
                            :key="transaction.id"
                        >
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                                {{ formatDate(transaction.date) }}
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900">
                                {{ transaction.description }}
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600"
                            >
                                {{
                                    formatNumber(
                                        formatAmount(transaction.amount)
                                    )
                                }}
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                                {{ transaction.currency }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">
                        Total: {{ formatNumber(formatAmount(totalAmount)) }}
                    </span>
                    <button
                        @click="closeModal"
                        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Transaction } from '../types/Transaction';
import { formatNumber, formatAmount, formatDate } from '../utils';

interface Props {
    isVisible: boolean;
    categoryName: string;
    transactions: Transaction[];
}

interface Emits {
    (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const totalAmount = computed(() => {
    if (!props.transactions) return 0;
    return props.transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    );
});

const closeModal = () => {
    emit('close');
};
</script>
