<template>
    <div
        :class="[
            'bg-white rounded-lg shadow',
            paddingClasses[padding],
            hover && 'hover:shadow-lg transition-shadow duration-200',
        ]"
    >
        <div v-if="$slots.header" class="px-6 py-4 border-b border-gray-200">
            <slot name="header" />
        </div>

        <div :class="paddingClasses[padding]">
            <slot />
        </div>

        <div
            v-if="$slots.footer"
            class="px-6 py-4 border-t border-gray-200 bg-gray-50"
        >
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    padding: 'md',
    hover: false,
});

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};
</script>
