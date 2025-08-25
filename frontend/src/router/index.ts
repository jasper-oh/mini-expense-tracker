import { createRouter, createWebHistory } from 'vue-router';
import AddTransaction from '../views/AddTransaction.vue';

const routes = [
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
