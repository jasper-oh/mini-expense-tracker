import { defineStore } from 'pinia';
import type {
    Invoice,
    CreateInvoiceData,
    UpdateInvoiceData,
    LinkTransactionToInvoiceData,
    TransactionInvoiceLink,
} from '../types/Invoice';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useInvoiceStore = defineStore('invoice', {
    state: () => ({
        invoices: [] as Invoice[],
        loading: false,
        error: null as string | null,
    }),

    getters: {
        invoicesByStatus: (state) => {
            const grouped = state.invoices.reduce((acc, invoice) => {
                if (!acc[invoice.status]) {
                    acc[invoice.status] = [];
                }
                acc[invoice.status].push(invoice);
                return acc;
            }, {} as Record<string, Invoice[]>);
            return grouped;
        },

        invoicesByType: (state) => {
            const grouped = state.invoices.reduce((acc, invoice) => {
                if (!acc[invoice.type]) {
                    acc[invoice.type] = [];
                }
                acc[invoice.type].push(invoice);
                return acc;
            }, {} as Record<string, Invoice[]>);
            return grouped;
        },

        totalOutstanding: (state) => {
            return state.invoices
                .filter(
                    (invoice) =>
                        invoice.status === 'SENT' || invoice.status === 'DRAFT'
                )
                .reduce((total, invoice) => total + invoice.totalAmount, 0);
        },

        totalPaid: (state) => {
            return state.invoices
                .filter((invoice) => invoice.status === 'PAID')
                .reduce((total, invoice) => total + invoice.totalAmount, 0);
        },
    },

    actions: {
        async fetchInvoices() {
            try {
                this.loading = true;
                this.error = null;

                const response = await axios.get(
                    `${API_BASE_URL}/api/invoices`
                );

                if (response.data.success) {
                    this.invoices = response.data.data;
                } else {
                    throw new Error(
                        response.data.message || 'Failed to fetch invoices'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch invoices';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async syncFromXero() {
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
                    `${API_BASE_URL}/api/invoices/sync`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );

                if (response.data.success) {
                    this.invoices = response.data.data;
                    return response.data.data;
                } else {
                    throw new Error(
                        response.data.message ||
                            'Failed to sync invoices from Xero'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to sync invoices from Xero';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getInvoiceById(id: number) {
            try {
                this.loading = true;
                this.error = null;

                const response = await axios.get(
                    `${API_BASE_URL}/api/invoices/${id}`
                );

                if (response.data.success) {
                    return response.data.data;
                } else {
                    throw new Error(
                        response.data.message || 'Failed to fetch invoice'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch invoice';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async createInvoice(invoiceData: CreateInvoiceData) {
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
                    `${API_BASE_URL}/api/invoices`,
                    invoiceData,
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );

                if (response.data.success) {
                    this.invoices.unshift(response.data.data);
                    return response.data.data;
                } else {
                    throw new Error(
                        response.data.message || 'Failed to create invoice'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to create invoice';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateInvoice(id: number, invoiceData: UpdateInvoiceData) {
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

                const response = await axios.put(
                    `${API_BASE_URL}/api/invoices/${id}`,
                    invoiceData,
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );

                if (response.data.success) {
                    const index = this.invoices.findIndex(
                        (invoice) => invoice.id === id
                    );
                    if (index !== -1) {
                        this.invoices[index] = response.data.data;
                    }
                    return response.data.data;
                } else {
                    throw new Error(
                        response.data.message || 'Failed to update invoice'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to update invoice';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteInvoice(id: number) {
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

                const response = await axios.delete(
                    `${API_BASE_URL}/api/invoices/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );

                if (response.data.success) {
                    this.invoices = this.invoices.filter(
                        (invoice) => invoice.id !== id
                    );
                    return true;
                } else {
                    throw new Error(
                        response.data.message || 'Failed to delete invoice'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to delete invoice';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getInvoiceTransactions(
            invoiceId: number
        ): Promise<TransactionInvoiceLink[]> {
            try {
                this.loading = true;
                this.error = null;

                const response = await axios.get(
                    `${API_BASE_URL}/api/invoices/${invoiceId}/transactions`
                );

                if (response.data.success) {
                    return response.data.data;
                } else {
                    throw new Error(
                        response.data.message ||
                            'Failed to fetch invoice transactions'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch invoice transactions';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async linkTransactionToInvoice(data: LinkTransactionToInvoiceData) {
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
                    `${API_BASE_URL}/api/invoices/link-transaction`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );

                if (response.data.success) {
                    return response.data.data;
                } else {
                    throw new Error(
                        response.data.message ||
                            'Failed to link transaction to invoice'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to link transaction to invoice';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async unlinkTransactionFromInvoice(
            transactionId: number,
            invoiceId: number
        ) {
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

                const response = await axios.delete(
                    `${API_BASE_URL}/api/invoices/unlink-transaction`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                        data: {
                            transactionId,
                            invoiceId,
                        },
                    }
                );

                if (response.data.success) {
                    return true;
                } else {
                    throw new Error(
                        response.data.message ||
                            'Failed to unlink transaction from invoice'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to unlink transaction from invoice';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getTransactionInvoices(
            transactionId: number
        ): Promise<Invoice[]> {
            try {
                this.loading = true;
                this.error = null;
                const response = await axios.get(
                    `${API_BASE_URL}/api/transactions/${transactionId}/invoices`
                );
                if (response.data.success) {
                    return response.data.data;
                } else {
                    throw new Error(
                        response.data.message ||
                            'Failed to fetch transaction invoices'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch transaction invoices';
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
