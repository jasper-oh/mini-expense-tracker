<template>
    <button
        :type="props.type"
        :disabled="disabled"
        :class="[
            'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            sizeClasses[props.size],
            variantClasses[props.variant],
            disabled && 'opacity-50 cursor-not-allowed',
            fullWidth && 'w-full',
        ]"
        @click="$emit('click', $event)"
    >
        <svg
            v-if="loading"
            class="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
        </svg>
        <svg
            v-else-if="icon"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="icon"
            />
        </svg>
        <span v-if="$slots.default">
            <slot />
        </span>
    </button>
</template>

<script setup lang="ts">
interface Props {
    variant?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'info';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    fullWidth?: boolean;
}

interface Emits {
    (e: 'click', event: MouseEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
});

defineEmits<Emits>();

const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning:
        'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500',
};
</script>
