import { createRouter, createWebHistory } from 'vue-router';
import AddTransaction from '../views/AddTransaction.vue';
import TransactionList from '../views/TransactionList.vue';
import CategoryBalance from '../views/CategoryBalance.vue';
import InvoiceList from '../views/InvoiceList.vue';
import InvoiceDetail from '../views/InvoiceDetail.vue';
import LinkTransaction from '../views/LinkTransaction.vue';

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
    {
        path: '/balance',
        name: 'CategoryBalance',
        component: CategoryBalance,
    },
    {
        path: '/invoices',
        name: 'InvoiceList',
        component: InvoiceList,
    },
    {
        path: '/invoices/:id',
        name: 'InvoiceDetail',
        component: InvoiceDetail,
    },
    {
        path: '/invoices/:id/link',
        name: 'LinkTransaction',
        component: LinkTransaction,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Route guard for AddTransaction page
router.beforeEach((to, _, next) => {
    if (to.name === 'AddTransaction') {
        const jwtToken = sessionStorage.getItem('jwt_token');
        if (!jwtToken) {
            // Redirect to transactions page if no JWT token
            next({ name: 'TransactionList' });
            return;
        }
    }
    next();
});

export default router;
