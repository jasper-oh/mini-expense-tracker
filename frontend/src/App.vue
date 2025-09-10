<template>
    <div id="app">
        <header class="bg-blue-600 text-white p-4">
            <div class="container mx-auto flex justify-between items-center">
                <h1 class="text-2xl font-bold">Mini Expense Tracker</h1>
                <nav class="flex space-x-4">
                    <router-link
                        to="/transactions"
                        class="text-white hover:text-blue-200 transition-colors"
                        :class="{
                            'font-semibold': $route.name === 'TransactionList',
                        }"
                    >
                        Transactions
                    </router-link>
                    <router-link
                        to="/invoices"
                        class="text-white hover:text-blue-200 transition-colors"
                        :class="{
                            'font-semibold': $route.name === 'InvoiceList',
                        }"
                    >
                        Invoices
                    </router-link>
                    <router-link
                        to="/balance"
                        class="text-white hover:text-blue-200 transition-colors"
                        :class="{
                            'font-semibold': $route.name === 'CategoryBalance',
                        }"
                    >
                        Balance
                    </router-link>
                </nav>
            </div>
        </header>

        <main class="container mx-auto p-4">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts"></script>
