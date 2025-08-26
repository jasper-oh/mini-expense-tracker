import { defineStore } from 'pinia';
import type { Category } from '../types/Category';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [] as Category[],
        loading: false,
        error: null as string | null,
    }),

    getters: {
        getCategoryName: (state) => (categoryId: number) => {
            const category = state.categories.find(
                (cat) => cat.id === categoryId
            );

            return category?.name || `Category ${categoryId}`;
        },
    },

    actions: {
        async fetchCategories() {
            try {
                this.loading = true;
                this.error = null;

                const response = await axios.get(
                    `${API_BASE_URL}/api/categories`
                );

                if (response.data.success) {
                    this.categories = response.data.data;
                } else {
                    throw new Error(
                        response.data.message || 'Failed to fetch categories'
                    );
                }
            } catch (error) {
                this.error =
                    error instanceof Error
                        ? error.message
                        : 'Failed to fetch categories';
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
