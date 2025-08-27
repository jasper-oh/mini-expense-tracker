<template>
    <div class="space-y-2">
        <label
            v-if="label"
            :for="id"
            class="block text-sm font-medium text-gray-700"
        >
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <textarea
            :id="id"
            :value="modelValue"
            :placeholder="placeholder"
            :required="required"
            :disabled="disabled"
            :rows="rows"
            :class="[
                'block w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none',
                sizeClasses[size],
                disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            ]"
            @input="
                $emit(
                    'update:modelValue',
                    ($event.target as HTMLTextAreaElement).value
                )
            "
            @blur="$emit('blur', $event)"
            @focus="$emit('focus', $event)"
        />

        <p v-if="helpText" class="text-xs text-gray-500">
            {{ helpText }}
        </p>

        <p v-if="error" class="text-xs text-red-600">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
interface Props {
    modelValue: string;
    label?: string;
    id?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
    helpText?: string;
    error?: string;
    size?: 'sm' | 'md' | 'lg';
}

interface Emits {
    (e: 'update:modelValue', value: string): void;
    (e: 'blur', event: FocusEvent): void;
    (e: 'focus', event: FocusEvent): void;
}

const props = withDefaults(defineProps<Props>(), {
    rows: 4,
    size: 'md',
    required: false,
    disabled: false,
});

defineEmits<Emits>();

const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
};
</script>
