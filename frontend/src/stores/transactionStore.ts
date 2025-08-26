import { defineStore } from 'pinia';
import type {
    CategoryBalance,
    CreateTransactionData,
    Transaction,
} from '../types/Transaction';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        transactions: [] as Transaction[],
        categoryBalances: [] as CategoryBalance[],
        loading: false,
        error: null as string | null,
    }),

    getters: {
        totalBalance: (state) => {
            return state.transactions.reduce(
                (total, transaction) => total + transaction.amount,
                0
            );
        },

        transactionsByCategory: (state) => {
            const grouped = state.transactions.reduce((acc, transaction) => {
                const categoryName =
                    transaction.categoryName ||
                    `Category ${transaction.categoryId}`;
                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(transaction);
                return acc;
            }, {} as Record<string, Transaction[]>);

            return grouped;
        },
    },

    actions: {
        async fetchTransactions() {
            try {
                this.loading = true;
                this.error = null;

                const response = await axios.get(
                    `${API_BASE_URL}/api/transactions`
                );

                if (response.data.success) {
                    this.transactions = response.data.data;
                } else {
                    throw new Error(
                        response.data.message || 'Failed to fetch transactions'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch transactions';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async addTransaction(transactionData: CreateTransactionData) {
            try {
                this.loading = true;
                this.error = null;

                // Get JWT token from sessionStorage
                const jwtToken = sessionStorage.getItem('jwt_token');

                if (!jwtToken) {
                    throw new Error(
                        'JWT token not found. Please authenticate first.'
                    );
                }

                const response = await axios.post(
                    `${API_BASE_URL}/api/transactions`,
                    transactionData,
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );

                if (response.data.success) {
                    this.transactions.push(response.data.data);
                    return response.data.data;
                } else {
                    throw new Error(
                        response.data.message || 'Failed to add transaction'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to add transaction';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchCategoryBalances() {
            try {
                this.loading = true;
                this.error = null;

                const response = await axios.get(
                    `${API_BASE_URL}/api/transactions/balance`
                );

                if (response.data.success) {
                    this.categoryBalances = response.data.data;
                } else {
                    throw new Error(
                        response.data.message ||
                            'Failed to fetch category balances'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch category balances';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        clearError() {
            this.error = null;
        },
    },
});
