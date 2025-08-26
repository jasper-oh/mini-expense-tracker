import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        token: null as string | null,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        hasToken: (state) => !!state.token,
        isTokenValid: (state) => state.isAuthenticated && !!state.token,
    },

    actions: {
        // Validate JWT token with backend
        async validateToken(
            token: string
        ): Promise<{ isValid: boolean; error?: string }> {
            try {
                this.loading = true;
                this.error = null;

                const response = await axios.post(
                    `${API_BASE_URL}/validate-token`,
                    { token },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.data.success) {
                    this.isAuthenticated = true;
                    this.token = token;
                    this.error = null;
                    return { isValid: true };
                } else {
                    this.isAuthenticated = false;
                    this.token = null;
                    this.error =
                        response.data.message || 'Token validation failed';
                    return {
                        isValid: false,
                        error: this.error || 'Token validation failed',
                    };
                }
            } catch (error: any) {
                this.isAuthenticated = false;
                this.token = null;

                if (error.response) {
                    // Server responded with error status
                    this.error =
                        error.response.data?.message ||
                        `Validation failed (${error.response.status})`;
                } else if (error.request) {
                    // Request was made but no response received
                    this.error =
                        'Unable to reach the server. Please check your connection.';
                } else {
                    // Something else happened
                    this.error =
                        error.message || 'An unexpected error occurred';
                }

                return {
                    isValid: false,
                    error: this.error || 'An unexpected error occurred',
                };
            } finally {
                this.loading = false;
            }
        },

        // Set token manually (for cases where token is already validated)
        setToken(token: string) {
            this.token = token;
            this.isAuthenticated = true;
            this.error = null;
        },

        // Clear authentication state
        clearAuth() {
            this.token = null;
            this.isAuthenticated = false;
            this.error = null;
        },

        // Check if token exists in sessionStorage and validate it
        async checkExistingToken(): Promise<boolean> {
            const storedToken = sessionStorage.getItem('jwt_token');
            if (!storedToken) {
                this.clearAuth();
                return false;
            }

            // Validate the stored token
            const result = await this.validateToken(storedToken);
            if (result.isValid) {
                // Store the validated token
                sessionStorage.setItem('jwt_token', storedToken);
                return true;
            } else {
                // Remove invalid token from sessionStorage
                sessionStorage.removeItem('jwt_token');
                return false;
            }
        },

        // Logout - clear both store and sessionStorage
        logout() {
            sessionStorage.removeItem('jwt_token');
            this.clearAuth();
        },

        // Clear any error messages
        clearError() {
            this.error = null;
        },
    },
});
