<template>
    <div class="max-w-4xl mx-auto space-y-8">
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
            <h2 class="text-3xl font-bold text-gray-900">
                Add New Transaction
            </h2>
        </div>

        <!-- Transaction Form -->
        <form
            @submit.prevent="handleSubmit"
            class="bg-white shadow-lg rounded-xl p-8 space-y-8"
        >
            <!-- Amount and Currency Section -->
            <div class="border-b border-gray-200 pb-6">
                <h3
                    class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2"
                >
                    <svg
                        class="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        ></path>
                    </svg>
                    <span>Transaction Details</span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label
                            for="amount"
                            class="block text-sm font-semibold text-gray-700"
                        >
                            Amount *
                        </label>
                        <div class="relative">
                            <div
                                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                            >
                                <span class="text-gray-500 text-sm">$</span>
                            </div>
                            <input
                                id="amount"
                                v-model="form.amount"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                class="block w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                        <p class="text-xs text-gray-500">
                            Enter the transaction amount
                        </p>
                    </div>

                    <div class="space-y-2">
                        <label
                            for="currency"
                            class="block text-sm font-semibold text-gray-700"
                        >
                            Currency *
                        </label>
                        <select
                            id="currency"
                            v-model="form.currency"
                            required
                            class="block w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                            <option value="">Select Currency</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                        </select>
                        <p class="text-xs text-gray-500">
                            Choose your expense currency
                        </p>
                    </div>
                </div>
            </div>

            <!-- Date and Category Section -->
            <div class="border-b border-gray-200 pb-6">
                <h3
                    class="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2"
                >
                    <svg
                        class="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                    </svg>
                    <span>When & Where</span>
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label
                            for="date"
                            class="block text-sm font-semibold text-gray-700"
                        >
                            Date *
                        </label>
                        <input
                            id="date"
                            v-model="form.date"
                            type="date"
                            required
                            class="block w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <p class="text-xs text-gray-500">
                            When did this transaction occur?
                        </p>
                    </div>

                    <div class="space-y-2">
                        <label
                            for="categoryId"
                            class="block text-sm font-semibold text-gray-700"
                        >
                            Category *
                        </label>
                        <select
                            id="categoryId"
                            v-model="form.categoryId"
                            required
                            class="block w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            :disabled="categories.length === 0"
                        >
                            <option value="">Select Category</option>
                            <option
                                v-for="category in categories"
                                :key="category.id"
                                :value="category.id"
                            >
                                {{ category.name }}
                            </option>
                        </select>
                        <p class="text-xs text-gray-500">
                            Categorize your expense
                        </p>
                        <div
                            v-if="categories.length === 0"
                            class="text-xs text-yellow-600"
                        >
                            Loading categories...
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description Section -->
            <div class="space-y-2">
                <label
                    for="description"
                    class="block text-sm font-semibold text-gray-700"
                >
                    Description *
                </label>
                <textarea
                    id="description"
                    v-model="form.description"
                    rows="4"
                    required
                    class="block w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Enter a detailed description of this transaction..."
                ></textarea>
                <p class="text-xs text-gray-500">
                    Provide details about what this transaction was for
                </p>
            </div>

            <!-- Form Actions -->
            <div
                class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200"
            >
                <router-link
                    to="/transactions"
                    class="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
                >
                    Cancel
                </router-link>
                <button
                    type="submit"
                    :disabled="isSubmitting || categories.length === 0"
                    class="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <div class="flex items-center justify-center space-x-2">
                        <svg
                            v-if="!isSubmitting"
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
                        <svg
                            v-else
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
                        <span>{{
                            isSubmitting
                                ? 'Adding Transaction...'
                                : 'Add Transaction'
                        }}</span>
                    </div>
                </button>
            </div>
        </form>

        <!-- Success/Error Messages -->
        <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center space-x-2"
        >
            <svg
                class="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>
            <span>{{ error }}</span>
        </div>

        <div
            v-if="success"
            class="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg flex items-center space-x-2"
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
            <span>Transaction added successfully! Redirecting...</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { Category } from '../types/Category';
import { categoryStore } from '../stores/categoryStore';

const form = reactive({
    amount: '',
    currency: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    categoryId: '',
});

const categories = ref<Category[]>(categoryStore.mockDataCategory);
const isSubmitting = ref(false);
const error = ref('');
const success = ref(false);

const handleSubmit = async () => {};
</script>
