import { createRouter, createWebHistory } from 'vue-router';
import AddTransaction from '../views/AddTransaction.vue';
import TransactionList from '../views/TransactionList.vue';

const routes = [
    {
        path: '/',
        redirect: '/transactions',
    },
    {
        path: '/transactions',
        name: 'TransactionList',
        component: TransactionList,
    },
    {
        path: '/add',
        name: 'AddTransaction',
        component: AddTransaction,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
