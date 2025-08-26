export interface Transaction {
    id: number;
    amount: number;
    currency: string;
    convertedCad: number;
    date: string;
    description: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTransactionData {
    amount: number;
    currency: string;
    date: string;
    description: string;
    category_id: number;
}

export interface CategoryBalance {
    categoryId: number;
    transactions: Transaction[];
    total: number;
}
