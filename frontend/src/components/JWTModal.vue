<template>
    <div
        v-if="isVisible"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
        <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold text-gray-900">
                    Authentication Required
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

            <div class="space-y-4">
                <p class="text-gray-600">
                    Please enter your JWT token to access the Add Transaction
                    page.
                </p>

                <div>
                    <label
                        for="jwtToken"
                        class="block text-sm font-medium text-gray-700 mb-2"
                    >
                        JWT Token
                    </label>
                    <textarea
                        id="jwtToken"
                        v-model="jwtToken"
                        rows="4"
                        class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your JWT token here..."
                    ></textarea>
                </div>

                <div
                    v-if="error"
                    class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md"
                >
                    {{ error }}
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        @click="closeModal"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        @click="validateAndProceed"
                        :disabled="!jwtToken.trim() || isValidating"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <span v-if="isValidating">Validating...</span>
                        <span v-else>Proceed</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

interface Props {
    isVisible: boolean;
}

interface Emits {
    (e: 'close'): void;
    (e: 'success', token: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();
const authStore = useAuthStore();
const jwtToken = ref('');
const error = ref('');
const isValidating = ref(false);

const closeModal = () => {
    jwtToken.value = '';
    error.value = '';
    emit('close');
};

const validateAndProceed = async () => {
    if (!jwtToken.value.trim()) {
        error.value = 'Please enter a JWT token';
        return;
    }

    try {
        isValidating.value = true;
        error.value = '';

        // Validate JWT token with backend API
        const validationResult = await authStore.validateToken(
            jwtToken.value.trim()
        );

        if (!validationResult.isValid) {
            error.value = validationResult.error || 'Token validation failed';
            return;
        }

        // Store token in sessionStorage
        sessionStorage.setItem('jwt_token', jwtToken.value.trim());

        // Emit success event
        emit('success', jwtToken.value.trim());

        // Close modal
        closeModal();

        // Navigate to AddTransaction
        router.push('/add');
    } catch (err) {
        error.value = 'Failed to validate token. Please try again.';
    } finally {
        isValidating.value = false;
    }
};
</script>
