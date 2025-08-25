<template>
    <div id="app">
        <header class="bg-blue-600 text-white p-4">
            <h1 class="text-2xl font-bold">Mini Expense Tracker</h1>
        </header>

        <main class="container mx-auto p-4">Hellow Expense Tracker</main>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
        'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
        'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#app {
    min-height: 100vh;
}
</style>
