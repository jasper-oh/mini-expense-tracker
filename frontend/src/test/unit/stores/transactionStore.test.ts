/**
 * Unit tests for Transaction Store
 *
 * This test suite covers:
 * - Store state initialization
 * - Getters for computed values
 * - Actions for API interactions
 * - Error handling and loading states
 * - State mutations and updates
 * - JWT token validation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTransactionStore } from '../../../stores/transactionStore';
import type {
    Transaction,
    CreateTransactionData,
    CategoryBalance,
} from '../../../types/Transaction';
import { mockAxios } from '../../setup';

describe('Transaction Store', () => {
    let store: ReturnType<typeof useTransactionStore>;

    beforeEach(() => {
        setActivePinia(createPinia());
        store = useTransactionStore();

        // Reset mocks
        vi.clearAllMocks();

        // Mock sessionStorage
        Object.defineProperty(window, 'sessionStorage', {
            value: {
                getItem: vi.fn(),
                setItem: vi.fn(),
                removeItem: vi.fn(),
                clear: vi.fn(),
            },
            writable: true,
        });
    });

    describe('Initial State', () => {
        it('should initialize with default values', () => {
            expect(store.transactions).toEqual([]);
            expect(store.categoryBalances).toEqual([]);
            expect(store.loading).toBe(false);
            expect(store.error).toBeNull();
        });
    });

    describe('Getters', () => {
        describe('totalBalance', () => {
            it('should calculate total balance from transactions', () => {
                // Arrange
                store.transactions = [
                    {
                        id: 1,
                        amount: 100,
                        currency: 'USD',
                        date: '2024-01-01',
                        description: 'Test',
                        categoryId: 1,
                        categoryName: 'Food',
                    } as Transaction,
                    {
                        id: 2,
                        amount: 50,
                        currency: 'USD',
                        date: '2024-01-02',
                        description: 'Test',
                        categoryId: 1,
                        categoryName: 'Food',
                    } as Transaction,
                    {
                        id: 3,
                        amount: 25.5,
                        currency: 'USD',
                        date: '2024-01-03',
                        description: 'Test',
                        categoryId: 1,
                        categoryName: 'Food',
                    } as Transaction,
                ];

                // Act
                const total = store.totalBalance;

                // Assert
                expect(total).toBe(175.5);
            });

            it('should return 0 when no transactions', () => {
                expect(store.totalBalance).toBe(0);
            });

            it('should handle negative amounts', () => {
                // Arrange
                store.transactions = [
                    {
                        id: 1,
                        amount: -100,
                        currency: 'USD',
                        date: '2024-01-01',
                        description: 'Test',
                        categoryId: 1,
                        categoryName: 'Food',
                    } as Transaction,
                    {
                        id: 2,
                        amount: 50,
                        currency: 'USD',
                        date: '2024-01-02',
                        description: 'Test',
                        categoryId: 1,
                        categoryName: 'Food',
                    } as Transaction,
                ];

                // Act
                const total = store.totalBalance;

                // Assert
                expect(total).toBe(-50);
            });
        });

        describe('transactionsByCategory', () => {
            it('should group transactions by category name', () => {
                // Arrange
                store.transactions = [
                    {
                        id: 1,
                        amount: 100,
                        currency: 'USD',
                        date: '2024-01-01',
                        description: 'Lunch',
                        categoryId: 1,
                        categoryName: 'Food',
                    } as Transaction,
                    {
                        id: 2,
                        amount: 50,
                        currency: 'USD',
                        date: '2024-01-02',
                        description: 'Dinner',
                        categoryId: 1,
                        categoryName: 'Food',
                    } as Transaction,
                    {
                        id: 3,
                        amount: 25,
                        currency: 'USD',
                        date: '2024-01-03',
                        description: 'Uber',
                        categoryId: 2,
                        categoryName: 'Transport',
                    } as Transaction,
                ];

                // Act
                const grouped = store.transactionsByCategory;

                // Assert
                expect(Object.keys(grouped)).toEqual(['Food', 'Transport']);
                expect(grouped.Food).toHaveLength(2);
                expect(grouped.Transport).toHaveLength(1);
                expect(grouped.Food[0].description).toBe('Lunch');
                expect(grouped.Transport[0].description).toBe('Uber');
            });

            it('should use fallback category name when categoryName is missing', () => {
                // Arrange
                store.transactions = [
                    {
                        id: 1,
                        amount: 100,
                        convertedCad: 100,
                        currency: 'USD',
                        date: '2024-01-01',
                        description: 'Test',
                        categoryId: 5,
                        categoryName: undefined as any,
                    } as Transaction,
                ];

                // Act
                const grouped = store.transactionsByCategory;

                // Assert
                expect(Object.keys(grouped)).toEqual(['Category 5']);
                expect(grouped['Category 5']).toHaveLength(1);
            });

            it('should return empty object when no transactions', () => {
                expect(store.transactionsByCategory).toEqual({});
            });
        });
    });

    describe('Actions', () => {
        describe('fetchTransactions', () => {
            it('should fetch transactions successfully', async () => {
                // Arrange
                const mockTransactions: Transaction[] = [
                    {
                        id: 1,
                        amount: 100,
                        currency: 'USD',
                        date: '2024-01-01',
                        description: 'Test',
                        categoryId: 1,
                        categoryName: 'Food',
                    } as Transaction,
                ];

                mockAxios.get.mockResolvedValueOnce({
                    data: { success: true, data: mockTransactions },
                });

                // Act
                await store.fetchTransactions();

                // Assert
                expect(store.transactions).toEqual(mockTransactions);
                expect(store.loading).toBe(false);
                expect(store.error).toBeNull();
                expect(mockAxios.get).toHaveBeenCalledWith(
                    'http://localhost:3333/api/transactions'
                );
            });

            it('should handle API error response', async () => {
                // Arrange
                mockAxios.get.mockResolvedValueOnce({
                    data: { success: false, message: 'Failed to fetch' },
                });

                // Act & Assert
                await expect(store.fetchTransactions()).rejects.toThrow(
                    'Failed to fetch'
                );
                expect(store.error).toBe('Failed to fetch');
                expect(store.loading).toBe(false);
            });

            it('should handle network errors', async () => {
                // Arrange
                const networkError = new Error('Network error');
                mockAxios.get.mockRejectedValueOnce(networkError);

                // Act & Assert
                await expect(store.fetchTransactions()).rejects.toThrow(
                    'Network error'
                );
                expect(store.error).toBe('Network error');
                expect(store.loading).toBe(false);
            });

            it('should set loading state correctly', async () => {
                // Arrange
                mockAxios.get.mockResolvedValueOnce({
                    data: { success: true, data: [] },
                });

                // Act
                const promise = store.fetchTransactions();

                // Assert loading state
                expect(store.loading).toBe(true);

                await promise;

                // Assert final state
                expect(store.loading).toBe(false);
            });
        });

        describe('addTransaction', () => {
            it('should add transaction successfully with valid JWT token', async () => {
                // Arrange
                const mockJWT = 'valid-jwt-token';
                const mockTransaction: Transaction = {
                    id: 1,
                    amount: 100,
                    currency: 'USD',
                    convertedCad: 100 * 1.3,
                    date: '2024-01-01',
                    description: 'Test',
                    categoryId: 1,
                    categoryName: 'Food',
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-01',
                } as Transaction;

                const transactionData: CreateTransactionData = {
                    amount: 100,
                    currency: 'USD',
                    date: '2024-01-01',
                    description: 'Test',
                    category_id: 1,
                };

                vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue(
                    mockJWT
                );
                mockAxios.post.mockResolvedValueOnce({
                    data: { success: true, data: mockTransaction },
                });

                // Act
                const result = await store.addTransaction(transactionData);

                // Assert
                expect(result).toEqual(mockTransaction);
                expect(store.transactions).toContain(mockTransaction);
                expect(store.loading).toBe(false);
                expect(store.error).toBeNull();
                expect(mockAxios.post).toHaveBeenCalledWith(
                    'http://localhost:3333/api/transactions',
                    transactionData,
                    {
                        headers: { Authorization: `Bearer ${mockJWT}` },
                    }
                );
            });

            it('should throw error when JWT token is missing', async () => {
                // Arrange
                const transactionData: CreateTransactionData = {
                    amount: 100,
                    currency: 'USD',
                    date: '2024-01-01',
                    description: 'Test',
                    category_id: 1,
                };

                vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue(
                    null
                );

                // Act & Assert
                await expect(
                    store.addTransaction(transactionData)
                ).rejects.toThrow(
                    'JWT token not found. Please authenticate first.'
                );
                expect(store.loading).toBe(false);
                expect(store.error).toBe(
                    'JWT token not found. Please authenticate first.'
                );
            });

            it('should handle API error response', async () => {
                // Arrange
                const mockJWT = 'valid-jwt-token';
                const transactionData: CreateTransactionData = {
                    amount: 100,
                    currency: 'USD',
                    date: '2024-01-01',
                    description: 'Test',
                    category_id: 1,
                };

                vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue(
                    mockJWT
                );
                mockAxios.post.mockResolvedValueOnce({
                    data: { success: false, message: 'Invalid data' },
                });

                // Act & Assert
                await expect(
                    store.addTransaction(transactionData)
                ).rejects.toThrow('Invalid data');
                expect(store.error).toBe('Invalid data');
                expect(store.loading).toBe(false);
            });

            it('should handle network errors', async () => {
                // Arrange
                const mockJWT = 'valid-jwt-token';
                const transactionData: CreateTransactionData = {
                    amount: 100,
                    currency: 'USD',
                    date: '2024-01-01',
                    description: 'Test',
                    category_id: 1,
                };

                vi.spyOn(window.sessionStorage, 'getItem').mockReturnValue(
                    mockJWT
                );
                const networkError = new Error('Network error');
                mockAxios.post.mockRejectedValueOnce(networkError);

                // Act & Assert
                await expect(
                    store.addTransaction(transactionData)
                ).rejects.toThrow('Network error');
                expect(store.error).toBe('Network error');
                expect(store.loading).toBe(false);
            });
        });

        describe('fetchCategoryBalances', () => {
            it('should fetch category balances successfully', async () => {
                // Arrange
                const mockBalances: CategoryBalance[] = [
                    {
                        categoryId: 1,
                        transactions: [
                            {
                                id: 1,
                                amount: 100,
                                currency: 'USD',
                                convertedCad: 100 * 1.3,
                                date: '2024-01-01',
                                description: 'Test',
                                categoryId: 1,
                                categoryName: 'Food',
                                createdAt: '2024-01-01',
                                updatedAt: '2024-01-01',
                            } as Transaction,
                            {
                                id: 2,
                                amount: 50,
                                currency: 'USD',
                                convertedCad: 50 * 1.3,
                                date: '2024-01-02',
                                description: 'Test',
                                categoryId: 1,
                                categoryName: 'Food',
                                createdAt: '2024-01-01',
                                updatedAt: '2024-01-01',
                            } as Transaction,
                        ],
                        total: 100,
                    },
                ];

                mockAxios.get.mockResolvedValueOnce({
                    data: { success: true, data: mockBalances },
                });

                // Act
                await store.fetchCategoryBalances();

                // Assert
                expect(store.categoryBalances).toEqual(mockBalances);
                expect(store.loading).toBe(false);
                expect(store.error).toBeNull();
                expect(mockAxios.get).toHaveBeenCalledWith(
                    'http://localhost:3333/api/transactions/balance'
                );
            });

            it('should handle API error response', async () => {
                // Arrange
                mockAxios.get.mockResolvedValueOnce({
                    data: {
                        success: false,
                        message: 'Failed to fetch balances',
                    },
                });

                // Act & Assert
                await expect(store.fetchCategoryBalances()).rejects.toThrow(
                    'Failed to fetch balances'
                );
                expect(store.error).toBe('Failed to fetch balances');
                expect(store.loading).toBe(false);
            });
        });
    });

    describe('Error Handling', () => {
        it('should clear error when starting new operation', async () => {
            // Arrange
            store.error = 'Previous error';
            mockAxios.get.mockResolvedValueOnce({
                data: { success: true, data: [] },
            });

            // Act
            await store.fetchTransactions();

            // Assert
            expect(store.error).toBeNull();
        });

        it('should handle unknown error types', async () => {
            // Arrange
            const unknownError = 'Unknown error string';
            mockAxios.get.mockRejectedValueOnce(unknownError);

            // Act & Assert
            await expect(store.fetchTransactions()).rejects.toThrow(
                'Unknown error string'
            );
            expect(store.error).toBe('Failed to fetch transactions');
        });
    });
});
